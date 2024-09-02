export type RemoteAge =
  | 'Baby (Under 5 Months)'
  | 'Puppy (5 months - 2 Years)'
  | 'Youth (2 - 5 Years)'
  | 'Adult (5 - 9 Years)'
  | 'Senior (9+ Years)'
export type LocalAge =
  | '< 5 mo'
  | '5 mo - 2 yr'
  | '2 - 5 yr'
  | '5 - 9 yr'
  | '> 9 yr'
export type Gender = 'Female' | 'Male'

export interface RemoteDog {
  id: number
  name: string
  alsoKnownAs: string
  headline: string
  primaryBreed: {
    id: number
    value: string
  }
  secondaryBreed: {
    id: number
    value: string
  }
  gender: {
    id: number
    value: Gender
  }
  ageGroup: {
    id: number
    value: RemoteAge
  }
  foster: {
    id: number
    value: string
  }
  status: {
    id: number
    value: string
  }
  subStatus: {
    id: number
    value: string
  }
  weight: {
    id: number
    value: string
  } | null
  mainPhoto: string
  intakeDate: string // ISO-8601
  statusUpdated: string // ISO-8601
}

type DogId = string

export interface LocalData {
  dogs: {
    [key: DogId]: {
      isSeen?: boolean
      isFavorite?: boolean
    }
  }
  sorting: SortingValue[]
}

export type LocalDataKeys = 'dogs:dogs' | 'dogs:sorting'

export interface Filters {
  breed: string[]
  gender: string[]
  age: LocalAge[]
}

export interface FilterValues {
  age?: string[]
  breed?: string[]
  gender?: string
  isFavorite?: string
  isNew?: string
  name?: string
}

type SortingDirection = 'asc' | 'desc'

export interface SortingValue {
  key: 'isNew' | 'name' | 'breed' | 'gender' | 'age'
  direction: SortingDirection
}

export interface DogUpdate {
  id: number
  isSeen?: true
  isFavorite?: boolean
}

export interface SelectOption {
  label: string
  value: string
}
