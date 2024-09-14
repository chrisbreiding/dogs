/// <reference types="vite-plugin-svgr/client" />

import React, { useCallback, useMemo } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Select, { OnChangeValue } from 'react-select'
import { SelectOption, SortingValue } from './types'
import RemoveIcon from '../assets/remove.svg?react'
import SortingIcon from '../assets/sorting.svg?react'

interface SortingOption {
  label: string
  value: SortingValue['key']
}

export interface SortingOptionUpdate {
  prevValue: SortingValue
  updatedValue: SortingValue
}

interface SortingOptionOptions {
  chosenDirection: SortingValue['direction']
  chosenOption: SortingOption
  onChange: (update: SortingOptionUpdate) => void
  onDelete: (key: SortingValue['key']) => void
  otherOptions: SortingOption[]
}

function SortingSetting ({
  chosenDirection,
  chosenOption,
  onChange,
  onDelete,
  otherOptions,
}: SortingOptionOptions) {
  const _onChangeKey = useCallback((newValue: OnChangeValue<SelectOption, false>) => {
    if (!newValue) return

    onChange({
      prevValue: {
        key: chosenOption.value,
        direction: chosenDirection,
      },
      updatedValue: {
        key: newValue.value as SortingValue['key'],
        direction: chosenDirection,
      },
    })
  }, [onChange])

  const _onChangeDirection = useCallback((newValue: OnChangeValue<SelectOption, false>) => {
    if (!newValue) return

    onChange({
      prevValue: {
        key: chosenOption.value,
        direction: chosenDirection,
      },
      updatedValue: {
        key: chosenOption.value,
        direction: newValue.value as SortingValue['direction'],
      },
    })
  }, [onChange])

  const _onDelete = useCallback(() => {
    onDelete(chosenOption.value)
  }, [onDelete])

  const directionOptions = [{
    label: 'Asc',
    value: 'asc',
  }, {
    label: 'Desc',
    value: 'desc',
  }]

  const options = [
    chosenOption,
    ...otherOptions,
  ]

  const directionValue = directionOptions.find(({ value }) => {
    return chosenDirection === value
  })

  return (
    <li className='list-group-item'>
      <Select
        className='select sorting-key'
        defaultValue={chosenOption}
        options={options}
        onChange={_onChangeKey}
      />
      <Select
        className='select sorting-direction'
        defaultValue={directionValue}
        options={directionOptions}
        onChange={_onChangeDirection}
      />
      <button className='btn btn-light' onClick={_onDelete}>
        <RemoveIcon />
      </button>
    </li>
  )
}

export interface SortingOptions {
  onAddOption: (value: SortingValue) => void
  onDeleteOption: (key: SortingValue['key']) => void
  onUpdateOption: (update: SortingOptionUpdate) => void
  sortingValues: SortingValue[]
}

export function Sorting ({ onAddOption, onDeleteOption, onUpdateOption, sortingValues }: SortingOptions) {
  const keyOptions = [
    { label: 'Age', value: 'age' },
    { label: 'Breed', value: 'breed' },
    { label: 'Favorite', value: 'isFavorite' },
    { label: 'Gender', value: 'gender' },
    { label: 'Intake Date', value: 'intakeDate' },
    { label: 'Name', value: 'name' },
    { label: 'New', value: 'isNew' },
    { label: 'Weight', value: 'weight' },
  ] as SortingOption[]

  const sortingKeys = sortingValues.map(({ key }) => key)
  const availableOptions = useMemo(() => {
    return keyOptions.filter((option) => {
      return !sortingKeys.includes(option.value)
    })
  }, [sortingValues])

  const addOption = useCallback(() => {
    if (!availableOptions.length) return

    onAddOption({
      key: availableOptions[0].value,
      direction: 'asc',
    })
  }, [availableOptions, onAddOption])

  return (
    <Accordion className='sorting'>
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <SortingIcon />
          Sorting
        </Accordion.Header>
        <Accordion.Body>
          <ul className='list-group list-group-flush'>
            {sortingValues.map((value) => {
              const chosenOption = keyOptions.find((option) => option.value === value.key)!

              return (
                <SortingSetting
                  key={value.key}
                  chosenDirection={value.direction}
                  chosenOption={chosenOption}
                  onChange={onUpdateOption}
                  onDelete={onDeleteOption}
                  otherOptions={availableOptions}
                />
              )
            })}
            {!!availableOptions.length && (
              <li className='list-group-item'>
                <button className='btn btn-light' onClick={addOption}>+ Add</button>
              </li>
            )}
          </ul>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}
