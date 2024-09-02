import { ages } from './constants'
import { DogModel } from './DogModel'
import { Filters } from './types'

export function deriveFilters (dogs: DogModel[]) {
  const filters = dogs.reduce((memo, dog) => {
    for (const key in memo) {
      const value = dog[key]

      if (!memo[key].includes(value)) {
        memo[key].push(value)
      }
    }

    return memo
  }, { breed: [], gender: [], age: [] } as Filters)

  for (const key of ['breed', 'gender']) {
    filters[key].sort()
  }

  filters['age'].sort((a, b) => ages.indexOf(a) - ages.indexOf(b))

  return filters
}

export function clone<T> (data: any) {
  return JSON.parse(JSON.stringify(data)) as T
}
