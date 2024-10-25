import 'bootstrap/dist/css/bootstrap.min.css'
import '@cypress/react-tooltip/dist/tooltip.css'
import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

import { defaultSortingValues } from './constants'
import { deriveFilters, getDogs, getPhotosForUnavailableDogs } from './data'
import { DogModel } from './DogModel'
import { Dogs } from './Dogs'
import { Filters } from './Filters'
import { fetchLocalData, saveLocalData } from './local-data'
import { latestDataVersion, migrateData } from './migrations'
import { fetchRemoteDogs } from './remote-data'
import { Sorting } from './Sorting'
import { Stats } from './Stats'
import { FilterValues, Filters as IFilters, LocalData, RemoteDog, SortingValue } from './types'
import { useAppliedFiltersCount, useReplaceFilter, useUpdateFilter } from './hooks/filters'
import { useAddSortingOption, useDeleteSortingOption, useUpdateSortingOption } from './hooks/sorting'
import { useFilteredAndSortedDogs, useNewDogs, useRemoveDog, useUnavailableDogs, useUpdateDog } from './hooks/dogs'

const initialSortingValues = fetchLocalData<LocalData['sorting']>('dogs:sorting') || defaultSortingValues
const initialDataVersion = fetchLocalData<LocalData['dataVersion']>('dogs:dataVersion') || 0
const initialFilterValues = fetchLocalData<LocalData['filters']>('dogs:filters') || {}

function Main () {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [remoteDogs, setRemoteDogs] = useState<RemoteDog[] | null>(null)
  const [dogs, setDogs] = useState<DogModel[] | null>(null)
  const [localDogs, setLocalDogs] = useState<LocalData['dogs'] | null>(null)
  const [filters, setFilters] = useState<IFilters | null>(null)
  const [filterValues, setFilterValues] = useState<FilterValues>(initialFilterValues)
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
      const response = await fetchRemoteDogs()

      if ('error' in response) {
        setError(response.error as Error)
        setIsLoading(false)

        return
      }

      const remoteDogs = response
      let localDogs = fetchLocalData<LocalData['dogs']>('dogs:dogs') || {}

      if (dataVersion < latestDataVersion) {
        localDogs = migrateData(dataVersion, remoteDogs, localDogs)

        setDataVersion(latestDataVersion)
        saveLocalData<LocalData['dataVersion']>('dogs:dataVersion', latestDataVersion)
      }

      localDogs = await getPhotosForUnavailableDogs(remoteDogs, localDogs)

      setRemoteDogs(remoteDogs)
      setLocalDogs(localDogs)
      saveLocalData<LocalData['dogs']>('dogs:dogs', localDogs)
    })()
  }, [true])

  const onReplaceFilter = useReplaceFilter(setFilterValues)
  const onUpdateFilter = useUpdateFilter(filterValues, setFilterValues)
  const onClearFilters = onReplaceFilter.bind(null, {})

  const onAddSortingOption = useAddSortingOption(sortingValues, setSortingValues)
  const onUpdateSortingOption = useUpdateSortingOption(sortingValues, setSortingValues)
  const onDeleteSortingOption = useDeleteSortingOption(sortingValues, setSortingValues)

  const onRemoveDog = useRemoveDog(localDogs, setLocalDogs)
  const onUpdateDog = useUpdateDog(dogs, localDogs, setLocalDogs)

  const appliedFiltersCount = useAppliedFiltersCount(filterValues)
  const filteredAndSortedDogs = useFilteredAndSortedDogs(dogs, filterValues, sortingValues)
  const newDogs = useNewDogs(dogs)
  const unavailableDogs = useUnavailableDogs(dogs)

  if (isLoading) {
    return (
      <div className='loading'>Loading...</div>
    )
  }

  if (error) {
    return (
      <div className='error mt-5 d-flex justify-content-center align-items-center'>
        <div>
          <h3>Error</h3>
          <pre className='alert alert-light'>
            <code>
              {JSON.stringify(error, null, 2)}
            </code>
          </pre>
        </div>
      </div>
    )
  }

  return (
    <>
      <header>
        <Stats
          appliedFiltersCount={appliedFiltersCount}
          dogsShowingCount={filteredAndSortedDogs.length}
          newCount={newDogs.length}
          onClearFilters={onClearFilters}
          onReplaceFilter={onReplaceFilter}
          totalDogsCount={dogs?.length || 0}
          unavailableDogsCount={unavailableDogs.length}
        />
      </header>
      <div className='filter-sorting'>
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
      </div>
      <Dogs
        dogs={filteredAndSortedDogs}
        onRemoveDog={onRemoveDog}
        onUpdateDog={onUpdateDog}
      />
    </>
  )
}

createRoot(document.getElementById('app')!).render(<Main />)
