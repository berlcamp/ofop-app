import React, { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon, MagnifyingGlassIcon, TagIcon } from '@heroicons/react/20/solid'
import { CustomButton } from '@/components'
import uuid from 'react-uuid'

interface FilterTypes {
  setFilterKeyword: (keyword: string) => void
  setFilterBarangay: (brgy: string) => void
}

const barangays = [
  '50TH',
  'AGUADA'
]

const Filters = ({ setFilterKeyword, setFilterBarangay }: FilterTypes) => {
  const [keyword, setKeyword] = useState<string>('')
  const [barangay, setBarangay] = useState<string>('')

  const handleApply = () => {
    if (keyword.trim() === '' && barangay.trim() === '') return

    // pass filter values to parent
    setFilterKeyword(keyword)
    setFilterBarangay(barangay)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (keyword.trim() === '' && barangay.trim() === '') return

    // pass filter values to parent
    setFilterKeyword(keyword)
    setFilterBarangay(barangay)
  }

  // clear all filters
  const handleClear = () => {
    setFilterKeyword('')
    setKeyword('')
    setFilterBarangay('')
    setBarangay('')
  }

  return (
    <div className=''>
      <div className='items-center space-x-2 space-y-1'>
        <form onSubmit={handleSubmit} className='items-center inline-flex'>
          <div className='app__filter_container'>
            <MagnifyingGlassIcon className="w-4 h-4 mr-1"/>
            <input
              placeholder='Search'
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              className="app__filter_input"/>
          </div>
          <div className='app__filter_container'>
            <MagnifyingGlassIcon className="w-4 h-4 mr-1"/>
            <select
              value={barangay}
              onChange={e => setBarangay(e.target.value)}
              className="app__filter_input">
                {
                  barangays.map((bar) => (
                    <option key={uuid()}>{bar}</option>
                  ))
                }
            </select>
          </div>
        </form>
      </div>
      <div className='flex items-center space-x-2 mt-4'>
        <CustomButton
              containerStyles='app__btn_green'
              title='Apply Filter'
              btnType='button'
              handleClick={handleApply}
            />
          <CustomButton
              containerStyles='app__btn_gray'
              title='Clear Filter'
              btnType='button'
              handleClick={handleClear}
            />
      </div>
    </div>
  )
}

export default Filters
