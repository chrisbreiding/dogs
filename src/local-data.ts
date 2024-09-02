import { LocalDataKeys } from './types'

export function fetchLocalData<T> (key: LocalDataKeys): T {
  const data = localStorage[key]

  return data ? JSON.parse(data) : undefined
}

export function saveLocalData<T> (key: LocalDataKeys, data: T) {
  localStorage[key] = JSON.stringify(data)
}
