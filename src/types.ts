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

export interface SingularRemoteDog {
  id: number
  name: string
  alsoKnownAs: string
  intakeDate: string
  approximateBirthdate: string
  headline: string
  description: string
  medicalDog: boolean
  mixedBreed: boolean
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
    value: string
  }
  ageGroup: {
    id: number
    value: string
  }
  foster: {
    id: number
    value: string
  }
  location: any
  dogOrigin: {
    id: number
    value: string
  }
  microchipCompany: any
  microchipNumber: string
  adoptionFee: number
  status: {
    id: number
    value: string
  }
  subStatus: {
    id: number
    value: string
  }
  statusUpdated: string
  mainPhotoId: number
  photos: {
    id: number
    fileName: any
    uploadedDate: string
    fileType: {
      id: number
      value: string
    }
    documentType: {
      id: any
      value: any
    }
    entityId: number
    url: string
    upload: any
    viewable: boolean
    order: any
  }[]
  documents: {
    id: number
    fileName: string
    uploadedDate: string
    fileType: {
      id: number
      value: string
    }
    documentType: {
      id: number
      value: any
    }
    entityId: number
    url: string
    upload: any
    viewable: boolean
    order: any
  }[]
  notes: any[]
  coatColors: any[]
  markings: string
  paLicense: any
  weight: any
  alterStatus: any
  alterDue: any
  rabiesDue: any
  dispositionDate: any
  dogMother: any
}

type DogId = string

export interface LocalDogsV0 {
  [key: DogId]: {
    isFavorite?: boolean
    isSeen?: boolean
  }
}

export interface DogPropsV1 {
  id: string
  age: LocalAge
  breeds: string[]
  gender: Gender
  intakeDate: string
  isAvailable: boolean
  isFavorite: boolean
  isNew: boolean
  name: string
  photo: string
  weight: string
}

export interface LocalDogsV1 {
  [key: DogId]: DogPropsV1
}

export type DogProps = DogPropsV1 &{
  intakeDate: string
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
  weight: { value: string, count: number }[]
}

export interface FilterValues {
  age?: string[]
  breed?: string[]
  gender?: string
  isAvailable?: string
  isFavorite?: string
  isNew?: string
  name?: string
  weight?: string
}

type SortingDirection = 'asc' | 'desc'

export interface SortingValue {
  key: 'age' | 'breed' | 'intakeDate' | 'isNew' | 'name' | 'gender' |'weight'
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
