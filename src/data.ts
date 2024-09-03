import { ages } from './constants'
import { DogModel } from './DogModel'
import { Filters, FilterValues, SortingValue } from './types'

export function deriveFilters (dogs: DogModel[]) {
  const filters = dogs.reduce((memo, dog) => {
    for (const key in memo) {
      const value = dog[key]
      const existing = memo[key].find((item) => item.value === value)

      if (existing) {
        existing.count++
      } else {
        memo[key].push({ value, count: 1 })
      }
    }

    return memo
  }, { breed: [], gender: [], age: [] } as Pick<Filters, 'breed' | 'gender' | 'age'>)

  for (const key of ['breed', 'gender']) {
    filters[key].sort((a, b) => a.value - b.value)
  }

  filters['age'].sort((a, b) => ages.indexOf(a.value) - ages.indexOf(b.value))

  const newCount = dogs.filter(({ isNew }) => isNew).length
  const favoritesCount = dogs.filter(({ isFavorite }) => isFavorite).length

  const isNewOptions = [
    { label: 'All', value: '' },
    { label: `New (${newCount})`, value: 'true' },
    { label: `Seen (${dogs.length - newCount})`, value: 'false' },
  ]
  const isFavoriteOptions = [
    { label: 'All', value: '' },
    { label: `Favorite (${favoritesCount})`, value: 'true' },
    { label: `Not Favorite (${dogs.length - favoritesCount})`, value: 'false' },
  ]

  return {
    isNew: isNewOptions,
    isFavorite: isFavoriteOptions,
    ...filters,
  }
}

export function clone<T> (data: any) {
  return JSON.parse(JSON.stringify(data)) as T
}

function includesString (key, value, dog) {
  return dog[key].toLowerCase().includes(value.toLowerCase())
}

function includesArray (key, value, dog) {
  return value.includes(dog[key])
}

function equals (key, value, dog) {
  return dog[key] === value
}

const filterSchema = {
  age: includesArray,
  breed: includesArray,
  gender: equals,
  isFavorite: equals,
  isNew: equals,
  name: includesString,
}

function getSortValue (key, dog) {
  if (key === 'age') {
    return ages.findIndex((age) => dog[key].includes(age))
  }

  if (typeof dog[key] === 'boolean') {
    return !dog[key]
  }

  return dog[key]
}

function getSortComparison (aValue: string, bValue: string) {
  if (aValue < bValue) {
    return -1
  }
  if (aValue > bValue) {
    return 1
  }
  return 0
}

export function filterAndSortDogs (
  dogs: DogModel[],
  filterValues: FilterValues,
  sortingValues: SortingValue[],
) {
  const filterEntries = Object.entries(filterValues)

  const filteredDogs = (() => {
    if (!filterEntries.length) return dogs

    return dogs.filter((dog) => {
      return filterEntries.every(([key, value]) => {
        return filterSchema[key](key, value, dog)
      })
    })
  })()

  const sortedDogs = filteredDogs.sort((a, b) => {
    for (const sortingValue of sortingValues) {
      const { direction, key } = sortingValue
      const aValue = getSortValue(key, a)
      const bValue = getSortValue(key, b)

      const comparisonValue = direction === 'asc' ?
        getSortComparison(aValue, bValue) :
        getSortComparison(bValue, aValue)

      if (comparisonValue !== 0) {
        return comparisonValue
      }
    }

    return 0
  })

  return sortedDogs
}
