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

export interface LocalDogsV0 {
  [key: DogId]: {
    isFavorite?: boolean
    isSeen?: boolean
  }
}

export interface DogProps {
  id: string
  age: LocalAge
  breeds: string[]
  gender: Gender
  isAvailable: boolean
  isFavorite: boolean
  isNew: boolean
  name: string
  photo: string
  weight?: string
}

export type MaybeDogProps = Partial<DogProps>

export interface LocalData {
  dataVersion: number
  dogs: {
    [key: DogId]: DogProps
  }
  sorting: SortingValue[]
}

export type LocalDataKeys = 'dogs:dataVersion' | 'dogs:dogs' | 'dogs:sorting'

export interface Filters {
  age: { value: LocalAge, count: number }[]
  breed: { value: string, count: number }[]
  gender: { value: string, count: number }[]
  isAvailable: { label: string, value: string }[]
  isFavorite: { label: string, value: string }[]
  isNew: { label: string, value: string }[]
}

export interface FilterValues {
  age?: string[]
  breed?: string[]
  gender?: string
  isAvailable?: string
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
  id: string
  isNew?: false
  isFavorite?: boolean
}

export interface SelectOption {
  label: string
  value: string
}
