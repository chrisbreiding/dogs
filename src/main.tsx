import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Dogs } from './Dogs'
import { DogModel } from './DogModel'
import { Filters } from './Filters'
import { DogUpdate, Filters as IFilters, FilterValues, LocalData, RemoteDog, SortingValue } from './types'
import { clone, deriveFilters, filterAndSortDogs } from './data'
import { fetchRemoteDogs } from './remote-data'
import { fetchLocalData, saveLocalData } from './local-data'
import { Sorting, SortingOptionUpdate } from './Sorting'

import 'bootstrap/dist/css/bootstrap.min.css'
import { Stats } from './Stats'

const initialSortingValues = fetchLocalData<LocalData['sorting']>('dogs:sorting') || [{
  key: 'isNew',
  direction: 'asc',
}, {
  key: 'isFavorite',
  direction: 'asc',
}, {
  key: 'name',
  direction: 'asc',
}] as SortingValue[]

function Main () {
  const [isLoading, setIsLoading] = useState(true)
  const [remoteDogs, setRemoteDogs] = useState<RemoteDog[] | null>(null)
  const [dogs, setDogs] = useState<DogModel[] | null>(null)
  const [localDataDogs, setLocalDataDogs] = useState<LocalData['dogs'] | null>(null)
  const [filters, setFilters] = useState<IFilters | null>(null)
  const [filterValues, setFilterValues] = useState<FilterValues>({})
  const [sortingValues, setSortingValues] = useState<SortingValue[]>(initialSortingValues)

  useEffect(() => {
    if (!remoteDogs || !localDataDogs) return

    const _dogs = remoteDogs.map((dog) => {
      return DogModel.fromRemoteData(dog, localDataDogs)
    })
    const _filters = deriveFilters(_dogs)

    setDogs(_dogs)
    setFilters(_filters)

    setIsLoading(false)
  }, [remoteDogs, localDataDogs, setDogs, setFilters])

  useEffect(() => {
    if (!remoteDogs) return

    const data = fetchLocalData<LocalData['dogs']>('dogs:dogs') || {}

    setLocalDataDogs(data)
  }, [remoteDogs, setLocalDataDogs])

  useEffect(() => {
    (async () => {
      const _remoteDogs = await fetchRemoteDogs()

      setRemoteDogs(_remoteDogs)
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

  const onUpdateDog = useCallback((update: DogUpdate) => {
    if (!localDataDogs) return

    const newValues = clone<LocalData['dogs']>(localDataDogs)

    if (update.isSeen !== undefined) {
      newValues[update.id] = {
        ...(newValues[update.id] || {}),
        isSeen: update.isSeen,
      }
    }

    if (update.isFavorite !== undefined) {
      newValues[update.id] = {
        ...(newValues[update.id] || {}),
        isFavorite: update.isFavorite,
      }
    }

    saveLocalData<LocalData['dogs']>('dogs:dogs', newValues)
    setLocalDataDogs(newValues)
  }, [localDataDogs, setLocalDataDogs])

  const filteredAndSortedDogs = useMemo(() => {
    return filterAndSortDogs(dogs || [], filterValues, sortingValues)
  }, [dogs, filterValues, sortingValues])

  const newDogs = useMemo(() => {
    if (!dogs) return []

    return dogs.filter((dog) => dog.isNew)
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
        newCount={newDogs.length}
        totalDogsCount={dogs?.length || 0}
      />
      <Dogs dogs={filteredAndSortedDogs} onUpdateDog={onUpdateDog} />
    </>
  )
}

createRoot(document.getElementById('app')!).render(<Main />)
