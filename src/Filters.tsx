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
  const weightOptions = useMemo(() => {
    return filters.weight.map(({ count, value }) => ({
      label: `${value} (${count})`,
      value,
    }))
  }, [filters.weight])
  const numAppliedFilters = useMemo(() => {
    return Object.keys(filterValues).filter((key) => key !== 'isAvailable').length
  }, [filterValues])

  const onChangeName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateFilter('name', e.target.value)
  }, [onUpdateFilter])

  const onChangeMulti = useMemo(() => {
    return ['age', 'breed', 'weight'].reduce((memo, key) => {
      memo[key] = (newValue: OnChangeValue<SelectOption, true>) => {
        onUpdateFilter(key as FilterKey, newValue.length ? newValue.map(({ value }) => value) : undefined)
      }

      return memo
    }, {} as { [key: string]: (newValue: OnChangeValue<SelectOption, true>) => void })
  }, [onUpdateFilter])

  const onChangeSingle = useMemo(() => {
    return ['gender', 'isAvailable', 'isNew', 'isFavorite'].reduce((memo, key) => {
      memo[key] = (newValue: OnChangeValue<SelectOption, false>) => {
        onUpdateFilter(key as FilterKey, newValue?.value)
      }

      return memo
    }, {} as { [key: string]: (newValue: OnChangeValue<SelectOption, false>) => void })
  }, [onUpdateFilter])

  const badge = numAppliedFilters ? <span className='badge text-bg-secondary'>{numAppliedFilters}</span> : null

  const selectedGenderOption = useMemo(() => {
    return filterValues.gender === undefined
      ? genderOptions[0]
      : genderOptions.find(({ value }) => value === filterValues.gender)
  }, [filterValues.gender, genderOptions])

  const selectedIsFavoriteOption = useMemo(() => {
    return filterValues.isFavorite === undefined
      ? filters.isFavorite[0]
      : filters.isFavorite.find(({ value }) => value === filterValues.isFavorite)
  }, [filterValues.isFavorite, filters.isFavorite])

  const selectedIsNewOption = useMemo(() => {
    return filterValues.isNew === undefined
      ? filters.isNew[0]
      : filters.isNew.find(({ value }) => value === filterValues.isNew)
  }, [filterValues.isNew, filters.isNew])

  const selectedIsAvailableOption = useMemo(() => {
    return filterValues.isAvailable === undefined
      ? filters.isAvailable[0]
      : filters.isAvailable.find(({ value }) => value === filterValues.isAvailable)
  }, [filterValues.isAvailable, filters.isAvailable])

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
              <label htmlFor='isNew'>New</label>
              <Select
                name='isNew'
                className='select'
                value={selectedIsNewOption}
                options={filters.isNew}
                onChange={onChangeSingle.isNew}
              />
            </li>
            <li className='list-group-item'>
              <label htmlFor='isFavorite'>Favorite</label>
              <Select
                name='isFavorite'
                className='select'
                value={selectedIsFavoriteOption}
                options={filters.isFavorite}
                onChange={onChangeSingle.isFavorite}
              />
            </li>
            <li className='list-group-item'>
              <label htmlFor='breed'>Breed</label>
              <Select
                name='breed'
                className='select'
                isMulti
                options={breedOptions}
                onChange={onChangeMulti.breed}
              />
            </li>
            <li className='list-group-item'>
              <label htmlFor='gender'>Gender</label>
              <Select
                name='gender'
                className='select'
                value={selectedGenderOption}
                options={genderOptions}
                onChange={onChangeSingle.gender}
              />
            </li>
            <li className='list-group-item'>
              <label htmlFor='age'>Age</label>
              <Select
                name='age'
                className='select'
                isMulti
                options={ageOptions}
                onChange={onChangeMulti.age}
              />
            </li>
            <li className='list-group-item'>
              <label htmlFor='weight'>Weight</label>
              <Select
                name='weight'
                className='select'
                isMulti
                options={weightOptions}
                onChange={onChangeMulti.weight}
              />
            </li>
            <li className='list-group-item'>
              <label htmlFor='isAvailable'>Available</label>
              <Select
                name='isAvailable'
                className='select'
                value={selectedIsAvailableOption}
                options={filters.isAvailable}
                onChange={onChangeSingle.isAvailable}
              />
            </li>
          </ul>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}
