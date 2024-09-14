import { DogModel } from './DogModel'
import {
  LocalData,
  LocalDogsV0,
  LocalDogsV1,
  MaybeDogProps,
  RemoteDog,
} from './types'

export const latestDataVersion = 2

interface TempLocalDogs {
  [key: string]: MaybeDogProps
}

function migrateZeroToOne (remoteDogs: RemoteDog[], localDataDogs: LocalDogsV0) {
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
  }, {} as LocalDogsV1)
}

function migrateOneToTwo (remoteDogs: RemoteDog[], localDataDogs: LocalDogsV1) {
  return Object.keys(localDataDogs).reduce((memo, id) => {
    const remoteDog = remoteDogs.find((dog) => `${dog.id}` === id)

    if (!remoteDog) return memo

    memo[id] = {
      ...localDataDogs[id],
      intakeDate: remoteDog.intakeDate,
    }

    return memo
  }, {} as LocalData['dogs'])
}

export function migrateData (currentDataVersion: number, remoteDogs: RemoteDog[], localDataDogs: unknown) {
  if (currentDataVersion === 0) {
    localDataDogs = migrateZeroToOne(remoteDogs, localDataDogs as LocalDogsV0)
    currentDataVersion++
  }

  if (currentDataVersion === 1) {
    return migrateOneToTwo(remoteDogs, localDataDogs as LocalDogsV1)
  }

  return localDataDogs as LocalData['dogs']
}
