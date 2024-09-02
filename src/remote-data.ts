import dataFixture from '../fixtures/data.json'
import { RemoteDog } from './types'

const useFixtures = false
const pageSize = 200

const BASE_URL = localStorage.apiUrl
  ? localStorage.apiUrl
  : /local/.test(location.hostname)
    ? `http://${location.hostname}:3333`
    : 'https://proxy.crbapps.com'

export async function fetchRemoteDogs () {
  if (useFixtures) {
    return dataFixture.results as RemoteDog[]
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

  const res = await fetch(`${BASE_URL}/dogs?${query}`)
  const resJson = await res.json()

  return resJson.results as RemoteDog[]
}
