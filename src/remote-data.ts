import dogsFixture from '../fixtures/dogs.json'
import dogFixture from '../fixtures/dog.json'
import { RemoteDog, SingularRemoteDog } from './types'

const useFixtures = false
const pageSize = 200

const BASE_URL = localStorage.apiUrl
  ? localStorage.apiUrl
  : /local/.test(location.hostname)
    ? `http://${location.hostname}:3333`
    : 'https://proxy.crbapps.com'

async function makeRequest<T> (path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}/${path}`)

  return res.json()
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

  const { results } = await makeRequest<{ results: RemoteDog[]}>(`dogs?${query}`)

  return results
}

export async function fetchRemoteDog (id: string) {
  if (useFixtures) {
    return dogFixture as SingularRemoteDog
  }

  return makeRequest<SingularRemoteDog>(`dogs/${id}`)
}
