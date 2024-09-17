/// <reference types="vite-plugin-svgr/client" />

import React, { MouseEvent } from 'react'
import PawIcon from '../assets/paw.svg?react'
import NewIcon from '../assets/new.svg?react'
import HomeIcon from '../assets/home.svg?react'
import RemoveIcon from '../assets/remove.svg?react'
import { Tooltip } from './Tooltip'
import { FilterValues } from './types'

interface StatsOptions {
  appliedFiltersCount: number
  dogsShowingCount: number
  newCount: number
  onClearFilters: () => void
  onReplaceFilter: (key: keyof FilterValues, value: string) => void
  totalDogsCount: number
  unavailableDogsCount: number
}

export function Stats ({
  appliedFiltersCount,
  dogsShowingCount,
  newCount,
  onClearFilters,
  onReplaceFilter,
  totalDogsCount,
  unavailableDogsCount,
}: StatsOptions) {
  const onFilter = (key: keyof FilterValues, value: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    onReplaceFilter(key, value)
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
          <Tooltip title='Apply filter'>
            <a href='#' className='link-secondary link-underline-opacity-25' onClick={onFilter('isNew', 'true')}>
              {newCount} new
            </a>
          </Tooltip>
        </div>
      )}
      {unavailableDogsCount > 0 && (
        <div className='stat stat-unavailable'>
          <HomeIcon />
          <Tooltip title='Apply filter'>
            <a href='#' className='link-secondary link-underline-opacity-25' onClick={onFilter('isAvailable', 'false')}>
              {unavailableDogsCount} no longer available
            </a>
          </Tooltip>
        </div>
      )}
      {appliedFiltersCount > 0 && (
        <>
          <span className='filters-count'>
            <Tooltip title={`Remove ${filtersText}`}>
              <button onClick={onClearFilters} className='filters-clear'>
                <RemoveIcon />
              </button>
            </Tooltip>
            <span className='filters-count-text'>
              {appliedFiltersCount} {filtersText} applied
            </span>
          </span>
        </>
      )}
    </div>
  )
}
