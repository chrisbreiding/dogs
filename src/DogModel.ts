import dayjs from 'dayjs'
import { agesMap, unknownValue } from './constants'
import { LocalAge, Gender, RemoteDog, DogProps, MaybeDogProps } from './types'

export class DogModel {
  id: string
  age: LocalAge
  breeds: string[]
  gender: Gender
  intakeDate: dayjs.Dayjs
  isAvailable: boolean
  isFavorite: boolean
  isNew: boolean
  name: string
  photo: string
  weight: string

  static fromRemoteData (remoteDog: RemoteDog, localDog?: MaybeDogProps) {
    return new DogModel({
      id: `${remoteDog.id}`,
      age: agesMap[remoteDog.ageGroup.value] as LocalAge,
      breeds: remoteDog.secondaryBreed?.value
        ? [remoteDog.primaryBreed.value, remoteDog.secondaryBreed?.value]
        : [remoteDog.primaryBreed.value],
      gender: remoteDog.gender.value,
      intakeDate: remoteDog.intakeDate,
      isAvailable: true,
      isFavorite: !!localDog?.isFavorite,
      isNew: localDog?.isNew === undefined ? true : localDog.isNew,
      name: remoteDog.name,
      photo: remoteDog.mainPhoto,
      weight: remoteDog.weight ? remoteDog.weight.value : unknownValue,
    })
  }

  constructor (dogProps: DogProps) {
    this.id = dogProps.id
    this.age = dogProps.age
    this.breeds = dogProps.breeds
    this.gender = dogProps.gender
    this.intakeDate = dayjs(dogProps.intakeDate)
    this.isAvailable = dogProps.isAvailable
    this.isFavorite = dogProps.isFavorite
    this.isNew = dogProps.isNew
    this.name = dogProps.name
    this.photo = dogProps.photo
    this.weight = dogProps.weight
  }

  get breed () {
    return this.breeds.join(' | ')
  }

  get intakeMonth () {
    return this.intakeDate.format('M')
  }

  get intakeDay () {
    return this.intakeDate.format('D')
  }

  get intakeYear () {
    return this.intakeDate.format('YY')
  }

  serialize (): DogProps {
    return {
      id: this.id,
      age: this.age,
      breeds: this.breeds,
      gender: this.gender,
      intakeDate: this.intakeDate.toISOString(),
      isAvailable: this.isAvailable,
      isFavorite: this.isFavorite,
      isNew: this.isNew,
      name: this.name,
      photo: this.photo,
      weight: this.weight,
    }
  }
}
