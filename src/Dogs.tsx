/// <reference types="vite-plugin-svgr/client" />

import React, { useCallback, useMemo } from 'react'
import { DogModel } from './DogModel'
import { DogUpdate, FilterValues, SortingValue } from './types'
import CalendarIcon from '../assets/calendar.svg?react'
import FemaleIcon from '../assets/female.svg?react'
import HeartIcon from '../assets/heart.svg?react'
import MaleIcon from '../assets/male.svg?react'
import PawIcon from '../assets/paw.svg?react'
import ScaleIcon from '../assets/scale.svg?react'
import NewIcon from '../assets/new.svg?react'
import { ages } from './constants'

function includesString (key, value, dog) {
  return dog[key].toLowerCase().includes(value.toLowerCase())
}

function includesArray (key, value, dog) {
  return value.includes(dog[key])
}

function equals (key, value, dog) {
  return dog[key] === value
}

const filterSchema = {
  age: includesArray,
  breed: includesArray,
  gender: equals,
  isFavorite: equals,
  isNew: equals,
  name: includesString,
}

function getSortValue (key, dog) {
  if (key === 'age') {
    return ages.findIndex((age) => dog[key].includes(age))
  }

  if (typeof dog[key] === 'boolean') {
    return !dog[key]
  }

  return dog[key]
}

function getSortComparison (aValue: string, bValue: string) {
  if (aValue < bValue) {
    return -1
  }
  if (aValue > bValue) {
    return 1
  }
  return 0
}

interface DogOptions {
  dog: DogModel
  onUpdateDog: (update: DogUpdate) => void
}

function Dog ({ dog, onUpdateDog }: DogOptions) {
  const onMarkAsSeen = useCallback(() => {
    onUpdateDog({ id: dog.id, isSeen: true })
  }, [dog, onUpdateDog])

  const onToggleFavorite = useCallback(() => {
    onUpdateDog({ id: dog.id, isFavorite: !dog.isFavorite })
  }, [dog, onUpdateDog])

  return (
    <div className={`dog card${dog.isNew ? ' dog-is-new' : ''}${dog.isFavorite ? ' dog-is-favorite' : ''}`}>
      <img className='card-img-top' src={dog.photo} />
      <button className='mark-seen-button' onClick={onMarkAsSeen}>
        <NewIcon />
      </button>
      <button className='toggle-favorite-button' onClick={onToggleFavorite}>
        <HeartIcon />
      </button>
      <div className='card-content'>
        <h5>
          {dog.name}
        </h5>
        <ul className='card-text list-group list-group-flush'>
          <li className='list-group-item'>
            <PawIcon />
            <span>{dog.breed}</span>
          </li>

          <li className='list-group-item'>
            {dog.gender === 'Female' ? <FemaleIcon /> : <MaleIcon />}
            <span>{dog.gender}</span>
          </li>

          <li className='list-group-item'>
            <CalendarIcon />
            <span>{dog.age}</span>
          </li>

          {dog.weight && (
            <li className='list-group-item'>
              <ScaleIcon />
              <span>{dog.weight}</span>
            </li>
          )}
        </ul>
        <div className='spacer' />
        <div className='d-grid'>
          <a
            href={`https://homeatlastdogrescue.com/dog/${dog.id}`}
            className='btn btn-secondary'
            target='_blank'
            rel='noreferrer'
          >View</a>
        </div>
      </div>
    </div>
  )
}

interface DogsOptions {
  dogs: DogModel[]
  filterValues: FilterValues
  sortingValues: SortingValue[]
  onUpdateDog: DogOptions['onUpdateDog']
}

export function Dogs ({ dogs, filterValues, sortingValues, onUpdateDog }: DogsOptions) {
  const filterEntries = useMemo(() => {
    return Object.entries(filterValues)
  }, [filterValues])

  const filteredDogs = useMemo(() => {
    if (!filterEntries.length) return dogs

    return dogs.filter((dog) => {
      return filterEntries.every(([key, value]) => {
        return filterSchema[key](key, value, dog)
      })
    })
  }, [dogs, filterEntries])

  const sortedDogs = useMemo(() => {
    return filteredDogs.sort((a, b) => {
      for (const sortingValue of sortingValues) {
        const { direction, key } = sortingValue
        const aValue = getSortValue(key, a)
        const bValue = getSortValue(key, b)

        const comparisonValue = direction === 'asc' ?
          getSortComparison(aValue, bValue) :
          getSortComparison(bValue, aValue)

        if (comparisonValue !== 0) {
          return comparisonValue
        }
      }

      return 0
    })
  }, [filteredDogs, sortingValues])

  return (
    <div className='dogs container'>
      <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5'>
        {sortedDogs.map((dog) => (
          <div key={dog.id} className='card-wrapper offset-xs-1'>
            <Dog
              dog={dog}
              onUpdateDog={onUpdateDog}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
