/// <reference types="vite-plugin-svgr/client" />

import React, { useCallback } from 'react'
import { DogModel } from './DogModel'
import { DogUpdate } from './types'
import CalendarIcon from '../assets/calendar.svg?react'
import FemaleIcon from '../assets/female.svg?react'
import HeartIcon from '../assets/heart.svg?react'
import MaleIcon from '../assets/male.svg?react'
import PawIcon from '../assets/paw.svg?react'
import ScaleIcon from '../assets/scale.svg?react'
import NewIcon from '../assets/new.svg?react'

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
  onUpdateDog: DogOptions['onUpdateDog']
}

export function Dogs ({ dogs, onUpdateDog }: DogsOptions) {
  return (
    <div className='dogs container'>
      <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5'>
        {dogs.map((dog) => (
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
