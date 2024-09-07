import { ages, unknownValue, weights } from './constants'
import { DogModel } from './DogModel'
import { Filters, FilterValues, LocalData, LocalDogsV0, MaybeDogProps, RemoteDog, SortingValue } from './types'

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
  }, { breed: [], gender: [], age: [], weight: [] } as Pick<Filters, 'breed' | 'gender' | 'age' | 'weight'>)

  for (const key of ['breed', 'gender']) {
    filters[key].sort((a, b) => a.value - b.value)
  }

  filters['age'].sort((a, b) => ages.indexOf(a.value) - ages.indexOf(b.value))
  filters['weight'].sort((a, b) => weights.indexOf(a.value) - weights.indexOf(b.value))

  const newCount = dogs.filter(({ isNew }) => isNew).length
  const availableCount = dogs.filter(({ isAvailable }) => isAvailable).length
  const favoritesCount = dogs.filter(({ isFavorite }) => isFavorite).length

  const isAvailableOptions = [
    { label: 'All', value: '' },
    { label: `Available (${availableCount})`, value: 'true' },
    { label: `Not Available (${dogs.length - availableCount})`, value: 'false' },
  ]
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
    isAvailable: isAvailableOptions,
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

function equalsBooleanString (key, value, dog) {
  return `${dog[key]}` === value
}

const filterSchema = {
  age: includesArray,
  breed: includesArray,
  gender: equals,
  isAvailable: equalsBooleanString,
  isFavorite: equalsBooleanString,
  isNew: equalsBooleanString,
  name: includesString,
  weight: includesArray,
}

function getSortValue (key, dog) {
  if (key === 'age') {
    return ages.findIndex((age) => dog[key].includes(age))
  }

  if (key === 'weight') {
    return weights.findIndex((weight) => dog[key] === weight)
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

export function getDogs (remoteDogs: RemoteDog[], localDogs: LocalData['dogs']) {
  const availableDogs = remoteDogs.map((dog) => {
    return DogModel.fromRemoteData(dog, localDogs[dog.id])
  })
  const unavailableDogs = Object.keys(localDogs).reduce((memo, localDogId) => {
    const isRemoteDog = remoteDogs.find(({ id }) => localDogId === `${id}`)

    if (isRemoteDog) return memo

    const localDog = localDogs[localDogId]

    return memo.concat(new DogModel({
      ...localDog,
      isAvailable: false,
      weight: localDog.weight || unknownValue,
    }))
  }, [] as DogModel[])

  return availableDogs.concat(unavailableDogs)
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

  const _sortingValues = [
    { key: 'isAvailable', direction: 'asc' },
    ...sortingValues,
  ]

  const sortedDogs = filteredDogs.sort((a, b) => {
    for (const sortingValue of _sortingValues) {
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

interface TempLocalDogs {
  [key: string]: MaybeDogProps
}

export function migrateData (remoteDogs: RemoteDog[], localDataDogs: LocalDogsV0) {
  const translatedLocalDogs = Object.keys(localDataDogs).reduce((memo, id) => {
    const localDog = localDataDogs[id]

    memo[id] = {
      isFavorite: localDog.isFavorite,
      isNew: localDog.isSeen === undefined ? undefined : !localDog.isSeen,
    }

    return memo
  }, {} as TempLocalDogs)

  return Object.keys(translatedLocalDogs).reduce((memo, id) => {
    const remoteDog = remoteDogs.find((dog) => `${dog.id}` === id)

    if (!remoteDog) return memo

    const dog = DogModel.fromRemoteData(remoteDog, translatedLocalDogs[id])

    memo[id] = dog.serialize()

    return memo
  }, {} as LocalData['dogs'])
}
