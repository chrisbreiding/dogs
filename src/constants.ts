import { SortingValue } from './types'

export const ages = [
  '< 5 mo',
  '5 mo - 2 yr',
  '2 - 5 yr',
  '5 - 9 yr',
  '> 9 yr',
]

export const agesMap = {
  'Baby (Under 5 Months)': '< 5 mo',
  'Puppy (5 months - 2 Years)': '5 mo - 2 yr',
  'Youth (2 - 5 Years)': '2 - 5 yr',
  'Adult (5 - 9 Years)': '5 - 9 yr',
  'Senior (9+ Years)': '> 9 yr',
}

export const unknownValue = '(unknown)'

export const weights = [
  '< 20 lbs',
  '20 - 50 lbs',
  '> 50 lbs',
  unknownValue,
]


export const defaultSortingValues = [{
  key: 'isNew',
  direction: 'asc',
}, {
  key: 'isFavorite',
  direction: 'asc',
}, {
  key: 'gender',
  direction: 'asc',
}, {
  key: 'age',
  direction: 'desc',
}, {
  key: 'weight',
  direction: 'asc',
}, {
  key: 'name',
  direction: 'asc',
}] as SortingValue[]
