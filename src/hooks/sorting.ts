import { useCallback } from 'react'
import { clone } from '../data'
import { saveLocalData } from '../local-data'
import { SortingOptionUpdate } from '../Sorting'
import type { LocalData, SortingValue } from '../types'

function replaceSortingValues (
  sortingValues: SortingValue[],
  setSortingValues: (values: SortingValue[]) => void,
) {
  saveLocalData<LocalData['sorting']>('dogs:sorting', sortingValues)
  setSortingValues(sortingValues)
}

export function useAddSortingOption (
  sortingValues: SortingValue[],
  setSortingValues: (values: SortingValue[]) => void,
) {
  return useCallback((value: SortingValue) => {
    const newValues = [
      ...sortingValues,
      value,
    ]

    replaceSortingValues(newValues, setSortingValues)
  }, [sortingValues, setSortingValues])
}

export function useDeleteSortingOption (
  sortingValues: SortingValue[],
  setSortingValues: (values: SortingValue[]) => void,
) {
  return useCallback((key: SortingValue['key']) => {
    const clonedValues = clone<LocalData['sorting']>(sortingValues)

    const deleteIndex = clonedValues.findIndex((value) => {
      return value.key === key
    })

    const newValues = [
      ...clonedValues.slice(0, deleteIndex),
      ...clonedValues.slice(deleteIndex + 1),
    ]

    replaceSortingValues(newValues, setSortingValues)
  }, [sortingValues, setSortingValues])
}

export function useUpdateSortingOption (
  sortingValues: SortingValue[],
  setSortingValues: (values: SortingValue[]) => void,
) {
  return useCallback(({ prevValue, updatedValue }: SortingOptionUpdate) => {
    const clonedValues = clone<LocalData['sorting']>(sortingValues)
    const updateIndex = clonedValues.findIndex((value) => value.key === prevValue.key)
    const newValues = [
      ...sortingValues.slice(0, updateIndex),
      updatedValue,
      ...sortingValues.slice(updateIndex + 1),
    ]

    replaceSortingValues(newValues, setSortingValues)
  }, [sortingValues, setSortingValues])
}
