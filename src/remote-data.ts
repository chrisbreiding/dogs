import dataFixture from '../fixtures/data.json'
import { RemoteDog } from './types'

const useFixtures = false
const pageSize = 21

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

  const res = await fetch(`http://localhost:3333/dogs?${query}`)
  const resJson = await res.json()

  return resJson.results as RemoteDog[]
}
