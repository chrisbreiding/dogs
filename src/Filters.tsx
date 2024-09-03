/// <reference types="vite-plugin-svgr/client" />

import React, { useCallback, useMemo } from 'react'
import Select, { OnChangeValue } from 'react-select'
import Accordion from 'react-bootstrap/Accordion'
import { Filters, FilterValues, SelectOption } from './types'
import FilterIcon from '../assets/filter.svg?react'

type FilterKey = 'name' | 'isNew' | 'isFavorite' | keyof Filters

export interface FiltersOptions {
  filters: Filters
  filterValues: FilterValues
  onUpdateFilter: (key: FilterKey, value: string | string[] | boolean | undefined) => void
}

function convertBooleanString (booleanValueString?: string) {
  return !booleanValueString || booleanValueString === '' ? '' : Boolean(booleanValueString)
}

export function Filters ({ filters, filterValues, onUpdateFilter }: FiltersOptions) {
  const breedOptions = useMemo(() => {
    return filters.breed.map(({ count, value }) => ({
      label: `${value} (${count})`,
      value,
    }))
  }, [filters.age])
  const genderOptions = useMemo(() => {
    return [
      { label: 'All', value: '' },
      ...filters.gender.map(({ count, value }) => ({
        label: `${value} (${count})`,
        value,
      })),
    ]
  }, [filters.gender])
  const ageOptions = useMemo(() => {
    return filters.age.map(({ count, value }) => ({
      label: `${value} (${count})`,
      value,
    }))
  }, [filters.age])
  const numAppliedFilters = useMemo(() => {
    return Object.keys(filterValues).length
  }, [filterValues])

  const onChangeName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateFilter('name', e.target.value)
  }, [onUpdateFilter])

  const onChangeBreed = useCallback((newValue: OnChangeValue<SelectOption, true>) => {
    onUpdateFilter('breed', newValue.length ? newValue.map(({ value }) => value) : undefined)
  }, [onUpdateFilter])

  const onChangeGender = useCallback((newValue: OnChangeValue<SelectOption, false>) => {
    onUpdateFilter('gender', newValue?.value)
  }, [onUpdateFilter])

  const onChangeAge = useCallback((newValue: OnChangeValue<SelectOption, true>) => {
    onUpdateFilter('age', newValue.length ? newValue.map(({ value }) => value) : undefined)
  }, [onUpdateFilter])

  const onChangeIsNew = useCallback((newValue: OnChangeValue<SelectOption, false>) => {
    onUpdateFilter('isNew', convertBooleanString(newValue?.value))
  }, [onUpdateFilter])

  const onChangeIsFavorite = useCallback((newValue: OnChangeValue<SelectOption, false>) => {
    onUpdateFilter('isFavorite', convertBooleanString(newValue?.value))
  }, [onUpdateFilter])

  const badge = numAppliedFilters ? <span className='badge text-bg-secondary'>{numAppliedFilters}</span> : null

  return (
    <Accordion className='filters'>
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <FilterIcon />
          Filters{badge}
        </Accordion.Header>
        <Accordion.Body>
          <ul className='list-group list-group-flush'>
            <li className='list-group-item'>
              <label htmlFor='name'>Name</label>
              <input
                name='name'
                type='text'
                className='name'
                autoComplete='off'
                onChange={onChangeName}
              />
            </li>
            <li className='list-group-item'>
              <label htmlFor='breed'>Breed</label>
              <Select
                name='breed'
                className='breed select'
                isMulti
                options={breedOptions}
                onChange={onChangeBreed}
              />
            </li>
            <li className='list-group-item'>
              <label htmlFor='gender'>Gender</label>
              <Select
                name='gender'
                className='gender select'
                defaultValue={genderOptions[0]}
                options={genderOptions}
                onChange={onChangeGender}
              />
            </li>
            <li className='list-group-item'>
              <label htmlFor='age'>Age</label>
              <Select
                name='age'
                className='age select'
                isMulti
                options={ageOptions}
                onChange={onChangeAge}
              />
            </li>
            <li className='list-group-item'>
              <label htmlFor='isNew'>New</label>
              <Select
                name='isNew'
                className='new-seen select'
                defaultValue={filters.isNew[0]}
                options={filters.isNew}
                onChange={onChangeIsNew}
              />
            </li>
            <li className='list-group-item'>
              <label htmlFor='isFavorite'>Favorite</label>
              <Select
                name='isFavorite'
                className='favorite select'
                defaultValue={filters.isFavorite[0]}
                options={filters.isFavorite}
                onChange={onChangeIsFavorite}
              />
            </li>
          </ul>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}
