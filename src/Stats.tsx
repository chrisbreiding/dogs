import React from 'react'
import PawIcon from '../assets/paw.svg?react'
import NewIcon from '../assets/new.svg?react'

interface StatsOptions {
  dogsShowingCount: number
  newCount: number
  totalDogsCount: number
}

export function Stats ({ dogsShowingCount, newCount, totalDogsCount }: StatsOptions) {
  return (
    <div className='container stats'>
      <div className='alert alert-light'>
        <div className='stat stat-showing'>
          <PawIcon />
          <span>{dogsShowingCount} / {totalDogsCount} showing</span>
        </div>
        <div className='stat stat-new'>
          <NewIcon />
          <span>{newCount} new</span>
        </div>
      </div>
    </div>
  )
}
