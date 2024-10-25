import { useCallback, useMemo } from 'react'
import { clone } from '../data'
import { saveLocalData } from '../local-data'
import type { FilterValues, LocalData, MultiFilterValues, SingleFilterValues } from '../types'

function replaceFilters (
  replaceValues: FilterValues,
  setFilterValues: (values: FilterValues) => void,
) {
  saveLocalData<LocalData['filters']>('dogs:filters', replaceValues)
  setFilterValues(replaceValues)
}

export function useReplaceFilter (setFilterValues: (values: FilterValues) => void) {
  return useCallback((replaceValues: FilterValues) => {
    replaceFilters(replaceValues, setFilterValues)
  }, [setFilterValues])
}

export function useUpdateFilter (
  filterValues: FilterValues,
  setFilterValues: (values: FilterValues) => void,
) {
  return useCallback((key: keyof FilterValues, value: string | string[] | boolean | undefined) => {
    const newValues = clone<FilterValues>(filterValues)

    if (value !== undefined && value !== '') {
      if (typeof value === 'string') {
        newValues[key as SingleFilterValues] = value as string
      } else {
        newValues[key as MultiFilterValues] = value as string[]
      }
    } else {
      delete newValues[key]
    }

    replaceFilters(newValues, setFilterValues)
  }, [filterValues])
}

export function useAppliedFiltersCount (filterValues: FilterValues) {
  return useMemo(() => {
    return Object.keys(filterValues).length
  }, [filterValues])
}
