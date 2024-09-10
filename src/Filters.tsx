/// <reference types="vite-plugin-svgr/client" />

import React, { ChangeEvent, useMemo } from 'react'
import Select, { OnChangeValue } from 'react-select'
import Accordion from 'react-bootstrap/Accordion'
import { Filters as IFilters, FilterValues, SelectOption } from './types'
import FilterIcon from '../assets/filter.svg?react'

type FilterKey = keyof IFilters
type FilterValueKey = keyof FilterValues

export interface FiltersOptions {
  filters: IFilters
  filterValues: FilterValues
  onUpdateFilter: (key: FilterValueKey, value: string | string[] | boolean | undefined) => void
}

interface Option {
  label: string
  value: string
}

type CountedFilters = Pick<IFilters, 'age' | 'breed' | 'gender' | 'weight'>

const useMultiOptions = <T extends keyof CountedFilters>(filters: CountedFilters[T]) => {
  return useMemo(() => {
    return filters.map(({ count, value }) => ({
      label: `${value} (${count})`,
      value,
    }))
  }, [filters])
}

const useSingleOptions = <T extends keyof CountedFilters>(filters: CountedFilters[T]) => {
  return [
    { label: 'All', value: '' },
    ...useMultiOptions<T>(filters),
  ]
}

const multiSelectKeys = ['age', 'breed', 'weight'] as const
const singleSelectKeys = ['gender', 'isAvailable', 'isFavorite', 'isNew'] as const

type MultiSelectKey = keyof Pick<IFilters, typeof multiSelectKeys[number]>
type SingleSelectKey = keyof Pick<IFilters, typeof singleSelectKeys[number]>

const useMultiSelected = <T extends MultiSelectKey>(options: Option[], selectedValues: FilterValues[T]) => {
  return useMemo(() => {
    return !selectedValues || !selectedValues.length
      ? []
      : options.filter(({ value }) => selectedValues.includes(value))
  }, [selectedValues, options])
}

const useSingleSelected = <T extends SingleSelectKey>(options: Option[], selectedValue: FilterValues[T]) => {
  return useMemo(() => {
    return selectedValue === undefined
      ? options[0]
      : options.find(({ value }) => value === selectedValue)
  }, [selectedValue, options])
}

export function Filters ({
  filters,
  filterValues,
  onUpdateFilter,
}: FiltersOptions) {
  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    onUpdateFilter('name', e.target.value)
  }

  const onChange = useMemo(() => {
    return Object.keys(filters).reduce((memo, key) => {
      // @ts-ignore
      if (singleSelectKeys.includes(key)) {
        memo[key] = (newValue: OnChangeValue<SelectOption, false>) => {
          onUpdateFilter(key as FilterValueKey, newValue?.value)
        }
      } else {
        memo[key] = (newValue: OnChangeValue<SelectOption, true>) => {
          onUpdateFilter(key as FilterValueKey, newValue.length ? newValue.map(({ value }) => value) : undefined)
        }
      }
      return memo
    }, {} as { [key in FilterKey]: (newValue: OnChangeValue<SelectOption, boolean>) => void })
  }, [onUpdateFilter])

  const ageOptions = useMultiOptions<'age'>(filters.age)
  const breedOptions = useMultiOptions<'breed'>(filters.breed)
  const genderOptions = useSingleOptions<'gender'>(filters.gender)
  const weightOptions = useMultiOptions<'weight'>(filters.weight)

  const selectedAgeOptions = useMultiSelected<'age'>(ageOptions, filterValues.age)
  const selectedBreedOptions = useMultiSelected<'breed'>(breedOptions, filterValues.breed)
  const selectedGenderOption = useSingleSelected<'gender'>(genderOptions, filterValues.gender)
  const selectedIsAvailableOption = useSingleSelected<'isAvailable'>(filters.isAvailable, filterValues.isAvailable)
  const selectedIsFavoriteOption = useSingleSelected<'isFavorite'>(filters.isFavorite, filterValues.isFavorite)
  const selectedIsNewOption = useSingleSelected<'isNew'>(filters.isNew, filterValues.isNew)
  const selectedWeightOptions = useMultiSelected<'weight'>(weightOptions, filterValues.weight)

  return (
    <Accordion className='filters'>
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <FilterIcon /> Filters
        </Accordion.Header>
        <Accordion.Body>
          <ul className='list-group list-group-flush'>
            <li className='list-group-item'>
              <label htmlFor='dogName'>Name</label>
              <input
                name='dogName'
                type='text'
                value={filterValues.name || ''}
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
                onChange={onChange.isNew}
              />
            </li>
            <li className='list-group-item'>
              <label htmlFor='isFavorite'>Favorite</label>
              <Select
                name='isFavorite'
                className='select'
                value={selectedIsFavoriteOption}
                options={filters.isFavorite}
                onChange={onChange.isFavorite}
              />
            </li>
            <li className='list-group-item'>
              <label htmlFor='breed'>Breed</label>
              <Select
                name='breed'
                className='select'
                isMulti
                value={selectedBreedOptions}
                options={breedOptions}
                onChange={onChange.breed}
              />
            </li>
            <li className='list-group-item'>
              <label htmlFor='gender'>Gender</label>
              <Select
                name='gender'
                className='select'
                value={selectedGenderOption}
                options={genderOptions}
                onChange={onChange.gender}
              />
            </li>
            <li className='list-group-item'>
              <label htmlFor='age'>Age</label>
              <Select
                name='age'
                className='select'
                isMulti
                value={selectedAgeOptions}
                options={ageOptions}
                onChange={onChange.age}
              />
            </li>
            <li className='list-group-item'>
              <label htmlFor='weight'>Weight</label>
              <Select
                name='weight'
                className='select'
                isMulti
                value={selectedWeightOptions}
                options={weightOptions}
                onChange={onChange.weight}
              />
            </li>
            <li className='list-group-item'>
              <label htmlFor='isAvailable'>Available</label>
              <Select
                name='isAvailable'
                className='select'
                value={selectedIsAvailableOption}
                options={filters.isAvailable}
                onChange={onChange.isAvailable}
              />
            </li>
          </ul>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}
