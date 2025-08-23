import dogsFixture from '../fixtures/dogs.json'
import dogFixture from '../fixtures/dog.json'
import { ErrorResponse, RemoteDog, RemoteDogResponse, RemoteDogsResponse, SingularRemoteDog } from './types'

const useFixtures = false
const pageSize = 200

const BASE_URL = localStorage.apiUrl
  ? localStorage.apiUrl
  : /local/.test(location.hostname)
    ? `http://${location.hostname}:3333`
    : 'https://proxy.crbapps.com'

async function makeRequest<T> (path: string): Promise<T | ErrorResponse> {
  const res = await fetch(`${BASE_URL}/${path}`)
  const data = await res.json()

  if (res.ok && typeof data === 'object') {
    return data
  }

  return { error: data } as ErrorResponse
}

export async function fetchRemoteDogs () {
  if (useFixtures) {
    return dogsFixture.results as RemoteDog[]
  }

  const query = [
    'pageNumber=1',
    `pageSize=${pageSize}`,
    'includePhotos=true',
    'orderBy=name',
    'orderDirection=0',
    // these are the filters used on HAL's site
    'filters=status:2', // Status: Adoptable
    'filters=status:4', // Status: Crosspost
    'filters=status:10', // Status: ?
    'filters=sub:11', // Sub-status: Available
    'filters=sub:12', // Sub-status: ?
    'filters=sub:13', // Sub-status: Active
  ].join('&')

  const response = await makeRequest<RemoteDogsResponse>(`dogs?${query}`)

  if ('error' in response) {
    return response as ErrorResponse
  }

  return response.results as RemoteDog[]
}

export async function fetchRemoteDog (id: string) {
  if (useFixtures) {
    return dogFixture as SingularRemoteDog
  }

  const response = await makeRequest<RemoteDogResponse>(`dogs/${id}`)

  if ('error' in response) {
    return response as ErrorResponse
  }

  return response
}
