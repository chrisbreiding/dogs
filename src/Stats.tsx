import React from 'react'
import PawIcon from '../assets/paw.svg?react'
import NewIcon from '../assets/new.svg?react'
import HomeIcon from '../assets/home.svg?react'

interface StatsOptions {
  dogsShowingCount: number
  newCount: number
  totalDogsCount: number
  unavailableDogsCount: number
}

export function Stats ({ dogsShowingCount, newCount, totalDogsCount, unavailableDogsCount }: StatsOptions) {
  return (
    <div className='stats'>
      <div className='alert alert-light'>
        <div className='stat stat-showing'>
          <PawIcon />
          <span>{dogsShowingCount} / {totalDogsCount} showing</span>
        </div>
        <div className='stat stat-new'>
          <NewIcon />
          <span>{newCount} new</span>
        </div>
        {unavailableDogsCount > 0 && (
          <div className='stat stat-unavailable'>
            <HomeIcon />
            <span>{unavailableDogsCount} no longer available</span>
          </div>
        )}
      </div>
    </div>
  )
}
