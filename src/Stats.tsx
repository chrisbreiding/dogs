/// <reference types="vite-plugin-svgr/client" />

import React, { MouseEvent } from 'react'
import PawIcon from '../assets/paw.svg?react'
import NewIcon from '../assets/new.svg?react'
import HomeIcon from '../assets/home.svg?react'
import RemoveIcon from '../assets/remove.svg?react'

interface StatsOptions {
  appliedFiltersCount: number
  dogsShowingCount: number
  newCount: number
  onClearFilters: () => void
  onViewUnavailable: () => void
  totalDogsCount: number
  unavailableDogsCount: number
}

export function Stats ({
  appliedFiltersCount,
  dogsShowingCount,
  newCount,
  onClearFilters,
  onViewUnavailable,
  totalDogsCount,
  unavailableDogsCount,
}: StatsOptions) {
  const onFilterUnavailable = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    onViewUnavailable()
  }

  const filtersText = appliedFiltersCount === 1 ? 'filter' : 'filters'

  return (
    <div className='stats alert alert-light'>
      <div className='stat stat-showing'>
        <PawIcon />
        <span>{dogsShowingCount} / {totalDogsCount} dogs</span>
      </div>
      {newCount > 0 && (
        <div className='stat stat-new'>
          <NewIcon />
          <span>{newCount} new</span>
        </div>
      )}
      {unavailableDogsCount > 0 && (
        <div className='stat stat-unavailable'>
          <HomeIcon />
          <a href='#' className='link-secondary link-underline-opacity-25' onClick={onFilterUnavailable}>
            {unavailableDogsCount} no longer available
          </a>
        </div>
      )}
      {appliedFiltersCount > 0 && (
        <>
          <span className='filters-count'>
            <button onClick={onClearFilters} className='filters-clear'>
              <RemoveIcon />
            </button>
            <span className='filters-count-text'>
              {appliedFiltersCount} {filtersText} applied
            </span>
          </span>
        </>
      )}
    </div>
  )
}
