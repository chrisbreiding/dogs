/// <reference types="vite-plugin-svgr/client" />

import React, { useCallback } from 'react'
import cs from 'clsx'
import { DogModel } from './DogModel'
import { DogUpdate } from './types'
import CalendarIcon from '../assets/calendar.svg?react'
import FemaleIcon from '../assets/female.svg?react'
import HeartIcon from '../assets/heart.svg?react'
import HomeIcon from '../assets/home.svg?react'
import MaleIcon from '../assets/male.svg?react'
import NewIcon from '../assets/new.svg?react'
import NewWindowIcon from '../assets/new-window.svg?react'
import PawIcon from '../assets/paw.svg?react'
import RemoveIcon from '../assets/remove.svg?react'
import ScaleIcon from '../assets/scale.svg?react'

interface DogOptions {
  dog: DogModel
  onRemoveDog: (id: string) => void
  onUpdateDog: (update: DogUpdate) => void
}

function Dog ({ dog, onRemoveDog, onUpdateDog }: DogOptions) {
  const onMarkAsSeen = useCallback(() => {
    onUpdateDog({ id: dog.id, isNew: false })
  }, [dog, onUpdateDog])

  const onToggleFavorite = useCallback(() => {
    onUpdateDog({ id: dog.id, isFavorite: !dog.isFavorite })
  }, [dog, onUpdateDog])

  const onRemove = useCallback(() => {
    onRemoveDog(dog.id)
  }, [dog, onRemoveDog])

  return (
    <div className={cs('dog card', {
      'dog-is-new': dog.isNew,
      'dog-is-favorite': dog.isFavorite,
      'dog-is-available': dog.isAvailable,
    })}>
      <img className='card-img-top' src={dog.photo} />
      <button className='mark-seen-button' onClick={onMarkAsSeen}>
        <NewIcon />
      </button>
      <button className='toggle-favorite-button' onClick={onToggleFavorite}>
        <HeartIcon />
      </button>
      <button className='remove-button' onClick={onRemove}>
        <RemoveIcon />
      </button>
      <div className='card-content'>
        <h5 title={dog.name}>
          {dog.name}
        </h5>
        <ul className='card-text list-group list-group-flush'>
          {!dog.isAvailable && (
            <li className='list-group-item dog-unavailable bg-danger-subtle'>
              <HomeIcon />
              <span>No Longer Available</span>
            </li>
          )}

          <li className='list-group-item dog-breed'>
            <PawIcon />
            <span title={dog.breed}>{dog.breed}</span>
          </li>

          <li className='list-group-item'>
            {dog.gender === 'Female' ? <FemaleIcon /> : <MaleIcon />}
            <span>{dog.gender}</span>
          </li>

          <li className='list-group-item'>
            <CalendarIcon />
            <span>{dog.age}</span>
          </li>

          {dog.isAvailable && dog.weight && (
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
          >
            View <NewWindowIcon />
          </a>
        </div>
      </div>
    </div>
  )
}

interface DogsOptions {
  dogs: DogModel[]
  onRemoveDog: DogOptions['onRemoveDog']
  onUpdateDog: DogOptions['onUpdateDog']
}

export function Dogs ({ dogs, onRemoveDog, onUpdateDog }: DogsOptions) {
  return (
    <div className='dogs'>
      {dogs.map((dog) => (
        <div key={dog.id} className='dog-wrapper'>
          <Dog
            dog={dog}
            onRemoveDog={onRemoveDog}
            onUpdateDog={onUpdateDog}
          />
        </div>
      ))}
    </div>
  )
}
