import { agesMap } from './constants'
import { LocalAge, Gender, RemoteDog, LocalData } from './types'

interface DogProps {
  id: number
  age: LocalAge
  breeds: string[]
  gender: Gender
  name: string
  photo: string
  weight?: string
}

export class DogModel {
  id: number
  age: LocalAge
  breeds: string[]
  gender: Gender
  isFavorite: boolean
  isNew: boolean
  name: string
  photo: string
  weight?: string

  static fromRemoteData (remoteDog: RemoteDog, localDataDogs: LocalData['dogs']) {
    return new DogModel({
      id: remoteDog.id,
      age: agesMap[remoteDog.ageGroup.value] as LocalAge,
      breeds: remoteDog.secondaryBreed?.value
        ? [remoteDog.primaryBreed.value, remoteDog.secondaryBreed?.value]
        : [remoteDog.primaryBreed.value],
      gender: remoteDog.gender.value,
      name: remoteDog.name,
      photo: remoteDog.mainPhoto,
      weight: remoteDog.weight ? remoteDog.weight.value : undefined,
    }, localDataDogs)
  }

  constructor (dogProps: DogProps, localDataDogs: LocalData['dogs']) {
    this.id = dogProps.id
    this.age = dogProps.age
    this.breeds = dogProps.breeds
    this.gender = dogProps.gender
    this.isFavorite = !!localDataDogs[dogProps.id]?.isFavorite
    this.isNew = !localDataDogs[dogProps.id]?.isSeen
    this.name = dogProps.name
    this.photo = dogProps.photo
    this.weight = dogProps.weight
  }

  get breed () {
    return this.breeds.join(' | ')
  }
}
