import { useCallback, useMemo } from 'react'
import { clone, filterAndSortDogs } from '../data'
import { saveLocalData } from '../local-data'
import type { DogUpdate, FilterValues, LocalData, SortingValue } from '../types'
import { DogModel } from '../DogModel'

export function useRemoveDog (
  localDogs: LocalData['dogs'] | null,
  setLocalDogs: (dogs: LocalData['dogs']) => void,
) {
  return useCallback((id: string) => {
    if (!localDogs) return

    const newValues = clone<LocalData['dogs']>(localDogs)

    delete newValues[id]

    saveLocalData<LocalData['dogs']>('dogs:dogs', newValues)
    setLocalDogs(newValues)
  }, [localDogs, setLocalDogs])
}

export function useUpdateDog (
  dogs: DogModel[] | null,
  localDogs: LocalData['dogs'] | null,
  setLocalDogs: (dogs: LocalData['dogs']) => void,
) {
  return useCallback((update: DogUpdate) => {
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
}

export function useFilteredAndSortedDogs (
  dogs: DogModel[] | null,
  filterValues: FilterValues,
  sortingValues: SortingValue[],
) {
  return useMemo(() => {
    return filterAndSortDogs(dogs || [], filterValues, sortingValues)
  }, [dogs, filterValues, sortingValues])
}

export function useNewDogs (dogs: DogModel[] | null) {
  return useMemo(() => {
    if (!dogs) return []

    return dogs.filter((dog) => dog.isNew)
  }, [dogs])
}

export function useUnavailableDogs (dogs: DogModel[] | null) {
  return useMemo(() => {
    if (!dogs) return []

    return dogs.filter((dog) => !dog.isAvailable)
  }, [dogs])
}
