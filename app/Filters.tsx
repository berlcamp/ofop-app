import React, { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon, MagnifyingGlassIcon, TagIcon } from '@heroicons/react/20/solid'
import { CustomButton } from '@/components'
import { barangays } from '@/constants/TrackerConstants'
import uuid from 'react-uuid'

interface FilterTypes {
  setFilterKeyword: (keyword: string) => void
  setFilterBarangay: (brgy: string) => void
  setFilterRequirements: (brgy: string) => void
}

const Filters = ({ setFilterKeyword, setFilterBarangay, setFilterRequirements }: FilterTypes) => {
  const [keyword, setKeyword] = useState<string>('')
  const [barangay, setBarangay] = useState<string>('')
  const [requirements, setRequirements] = useState<string>('')

  const handleApply = () => {
    if (keyword.trim() === '' && barangay.trim() === '' && requirements.trim() === '') return

    // pass filter values to parent
    setFilterKeyword(keyword)
    setFilterBarangay(barangay)
    setFilterRequirements(requirements)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (keyword.trim() === '' && barangay.trim() === '' && requirements.trim() === '') return

    // pass filter values to parent
    setFilterKeyword(keyword)
    setFilterBarangay(barangay)
    setFilterRequirements(requirements)
  }

  // clear all filters
  const handleClear = () => {
    setFilterKeyword('')
    setKeyword('')
    setFilterBarangay('')
    setBarangay('')
    setFilterRequirements('')
    setRequirements('')
  }

  return (
    <div className=''>
      <div className='items-center space-x-2'>
        <form onSubmit={handleSubmit} className='items-center space-y-2'>
          <div className='app__filter_container inline-flex'>
            <MagnifyingGlassIcon className="w-4 h-4 mr-1"/>
            <input
              placeholder='Search Name'
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              className="app__filter_input"/>
          </div>
          <div className='app__filter_container inline-flex'>
            <MagnifyingGlassIcon className="w-4 h-4 mr-1"/>
            <span className='text-sm text-gray-500'>Barangay</span>
            <select
              value={barangay}
              onChange={e => setBarangay(e.target.value)}
              className="app__filter_input">
                <option></option>
                {
                  barangays.map((bar) => (
                    <option key={uuid()}>{bar}</option>
                  ))
                }
            </select>
          </div>
          {/* <div className='app__filter_container inline-flex'>
            <span className='text-sm text-gray-500'>Requirements</span>
            <select
              value={requirements}
              onChange={e => setRequirements(e.target.value)}
              className="app__filter_input">
                <option></option>
                <option>Complete</option>
                <option>Incomplete</option>
            </select>
          </div> */}
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
