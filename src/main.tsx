import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Dogs } from './Dogs'
import { DogModel } from './DogModel'
import { Filters } from './Filters'
import { DogUpdate, Filters as IFilters, FilterValues, LocalData, RemoteDog, SortingValue } from './types'
import { clone, deriveFilters, filterAndSortDogs, getDogs, migrateData } from './data'
import { fetchRemoteDogs } from './remote-data'
import { fetchLocalData, saveLocalData } from './local-data'
import { Sorting, SortingOptionUpdate } from './Sorting'

import 'bootstrap/dist/css/bootstrap.min.css'
import { Stats } from './Stats'
import { defaultSortingValues } from './constants'

const initialSortingValues = fetchLocalData<LocalData['sorting']>('dogs:sorting') || defaultSortingValues
const initialDataVersion = fetchLocalData<LocalData['dataVersion']>('dogs:dataVersion') || 0

function Main () {
  const [isLoading, setIsLoading] = useState(true)
  const [remoteDogs, setRemoteDogs] = useState<RemoteDog[] | null>(null)
  const [dogs, setDogs] = useState<DogModel[] | null>(null)
  const [localDogs, setLocalDogs] = useState<LocalData['dogs'] | null>(null)
  const [filters, setFilters] = useState<IFilters | null>(null)
  const [filterValues, setFilterValues] = useState<FilterValues>({})
  const [sortingValues, setSortingValues] = useState<SortingValue[]>(initialSortingValues)
  const [dataVersion, setDataVersion] = useState<number>(initialDataVersion)

  useEffect(() => {
    if (!remoteDogs || !localDogs) return

    const dogs = getDogs(remoteDogs, localDogs)
    const filters = deriveFilters(dogs)

    setDogs(dogs)
    setFilters(filters)

    setIsLoading(false)
  }, [remoteDogs, localDogs, setDogs, setFilters])

  useEffect(() => {
    (async () => {
      const remoteDogs = await fetchRemoteDogs()
      let localDogs = fetchLocalData<LocalData['dogs']>('dogs:dogs') || {}

      if (dataVersion === 0) {
        localDogs = migrateData(remoteDogs, localDogs)

        setDataVersion(1)
        saveLocalData<LocalData['dataVersion']>('dogs:dataVersion', 1)
      }

      setRemoteDogs(remoteDogs)
      setLocalDogs(localDogs)
      saveLocalData<LocalData['dogs']>('dogs:dogs', localDogs)
    })()
  }, [true])

  const onUpdateFilter = useCallback((key, value) => {
    const newValues = clone<FilterValues>(filterValues)

    if (value !== undefined && value !== '') {
      newValues[key] = value
    } else {
      delete newValues[key]
    }

    setFilterValues(newValues)
  }, [filterValues, setFilterValues])

  const onAddSortingOption = useCallback((value: SortingValue) => {
    const newValues = [
      ...sortingValues,
      value,
    ]

    saveLocalData<LocalData['sorting']>('dogs:sorting', newValues)
    setSortingValues(newValues)
  }, [sortingValues, setSortingValues])

  const onDeleteSortingOption = useCallback((key: SortingValue['key']) => {
    const clonedValues = clone<LocalData['sorting']>(sortingValues)

    const deleteIndex = clonedValues.findIndex((value) => {
      return value.key === key
    })

    const newValues = [
      ...clonedValues.slice(0, deleteIndex),
      ...clonedValues.slice(deleteIndex + 1),
    ]

    saveLocalData<LocalData['sorting']>('dogs:sorting', newValues)
    setSortingValues(newValues)
  }, [sortingValues, setSortingValues])

  const onUpdateSortingOption = useCallback(({ prevValue, updatedValue }: SortingOptionUpdate) => {
    const clonedValues = clone<LocalData['sorting']>(sortingValues)
    const updateIndex = clonedValues.findIndex((value) => value.key === prevValue.key)
    const newValues = [
      ...sortingValues.slice(0, updateIndex),
      updatedValue,
      ...sortingValues.slice(updateIndex + 1),
    ]

    saveLocalData<LocalData['sorting']>('dogs:sorting', newValues)
    setSortingValues(newValues)
  }, [sortingValues, setSortingValues])

  const onRemoveDog = useCallback((id: string) => {
    if (!localDogs) return

    const newValues = clone<LocalData['dogs']>(localDogs)

    delete newValues[id]

    saveLocalData<LocalData['dogs']>('dogs:dogs', newValues)
    setLocalDogs(newValues)
  }, [localDogs, setLocalDogs])

  const onUpdateDog = useCallback((update: DogUpdate) => {
    if (!localDogs || !dogs) return

    const dog = dogs.find((dog) => update.id === dog.id)

    if (!dog) return

    const newValues = clone<LocalData['dogs']>(localDogs)
    const newDog = dog.serialize()

    if (update.isNew !== undefined) {
      newDog.isNew = update.isNew
      newValues[update.id] = newDog
    }

    if (update.isFavorite !== undefined) {
      newDog.isFavorite = update.isFavorite
      newValues[update.id] = newDog
    }

    saveLocalData<LocalData['dogs']>('dogs:dogs', newValues)
    setLocalDogs(newValues)
  }, [dogs, localDogs, setLocalDogs])

  const filteredAndSortedDogs = useMemo(() => {
    return filterAndSortDogs(dogs || [], filterValues, sortingValues)
  }, [dogs, filterValues, sortingValues])

  const newDogs = useMemo(() => {
    if (!dogs) return []

    return dogs.filter((dog) => dog.isNew)
  }, [dogs])

  const unavailableDogs = useMemo(() => {
    if (!dogs) return []

    return dogs.filter((dog) => !dog.isAvailable)
  }, [dogs])

  if (isLoading) {
    return (
      <div className='loading'>Loading...</div>
    )
  }

  return (
    <>
      <header>
        <Filters
          filters={filters!}
          filterValues={filterValues}
          onUpdateFilter={onUpdateFilter}
        />
        <Sorting
          onAddOption={onAddSortingOption}
          onDeleteOption={onDeleteSortingOption}
          onUpdateOption={onUpdateSortingOption}
          sortingValues={sortingValues}
        />
      </header>
      <Stats
        dogsShowingCount={filteredAndSortedDogs.length}
        unavailableDogsCount={unavailableDogs.length}
        newCount={newDogs.length}
        totalDogsCount={dogs?.length || 0}
      />
      <Dogs
        dogs={filteredAndSortedDogs}
        onRemoveDog={onRemoveDog}
        onUpdateDog={onUpdateDog}
      />
    </>
  )
}

createRoot(document.getElementById('app')!).render(<Main />)
