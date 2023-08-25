'use client'

import React, { useEffect, useState } from 'react'
import { PerPage, TopBarDark, TableRowLoading, ShowMore, Title } from '@/components'
import Filters from './Filters'
import { capitalizeWords, fullTextQuery } from '@/utils/text-helper'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { reqList } from '@/constants/TrackerConstants'

// Redux imports
import { useSelector, useDispatch } from 'react-redux'
import { updateList } from '@/GlobalRedux/Features/listSlice'
import { updateResultCounter } from '@/GlobalRedux/Features/resultsCounterSlice'
import uuid from 'react-uuid'
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'

interface RequirementTypes {
  isComplete: boolean
  label: string
}

const requirementsList: RequirementTypes[] = reqList

const RequirementsCheckbox = ({ userId, req, userRequirements }: { userId: string, req: RequirementTypes, userRequirements: RequirementTypes[] }) => {
  const [isChecked, setIsChecked] = useState(false)

  useEffect(() => {
    const userReq = userRequirements.filter((i: RequirementTypes) => {
      if (i.label === req.label && i.isComplete) {
        return true
      } else {
        return false
      }
    })

    setIsChecked(userReq.length > 0)
  }, [])

  return (
    <div key={uuid()} className='flex space-x-1 items-center'>
      {
        isChecked
          ? <CheckCircleIcon className='w-4 h-4 text-green-500'/>
          : <XMarkIcon className='w-4 h-4 text-red-500'/>
      }
      {
        req.label === 'Latest Report'
          ? <span>Copy of Report Card/Grades</span>
          : <span>{req.label}</span>
      }
    </div>
  )
}

const Page: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<any[]>([])
  const [filterKeyword, setFilterKeyword] = useState<string>('')
  const [filterBarangay, setFilterBarangay] = useState<string>('')
  const [filterRequirements, setFilterRequirements] = useState<string>('')
  const [perPageCount, setPerPageCount] = useState<number>(10)

  const supabase = createClientComponentClient()

  // Redux staff
  const globallist = useSelector((state: any) => state.list.value)
  const resultsCounter = useSelector((state: any) => state.results.value)
  const dispatch = useDispatch()

    const fetchData = async () => {
    setLoading(true)

    try {
      let query = supabase
        .from('ofop_scholars')
        .select('*', { count: 'exact' })

      // Full text search
      if (filterKeyword !== '') {
        const searchSplit = (filterKeyword).split(' ')
        // Search match
        searchSplit.forEach(item => {
          query = query.or(`firstname.ilike.%${item}%,middlename.ilike.%${item}%,lastname.ilike.%${item}%,fullname.ilike.%${item}%`)
        })
      }

      // Filter barangay
      if (filterBarangay !== '') {
        query = query.eq('barangay', filterBarangay)
      }

      // Per Page from context
      const from = 0
      const to = from + (perPageCount - 1)

      // Per Page from context
      query = query.range(from, to)

      // Order By
      query = query.order('id', { ascending: false })

      const { data, error, count } = await query

      if (error) {
        throw new Error(error.message)
      }

      // update the list in redux
      dispatch(updateList(data))

      // Updating showing text in redux
      dispatch(updateResultCounter({ showing: data.length, results: count ? count : 0 }))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Append data to existing list whenever 'show more' button is clicked
  const handleShowMore = async () => {
    setLoading(true)

    try {
      let query = supabase
        .from('ofop_scholars')
        .select('*', { count: 'exact' })

      // Full text search
      if (filterKeyword !== '') {
        const searchSplit = (filterKeyword).split(' ')
        // Search match
        searchSplit.forEach(item => {
          query = query.or(`firstname.ilike.%${item}%,middlename.ilike.%${item}%,lastname.ilike.%${item}%,fullname.ilike.%${item}%`)
        })
      }

      // Filter barangay
      if (filterBarangay !== '') {
        query = query.eq('barangay', filterBarangay)
      }

      // Per Page from context
      const from = list.length
      const to = from + (perPageCount - 1)

      // Per Page from context
      query = query.range(from, to)

      // Order By
      query = query.order('id', { ascending: false })

      const { data, error, count } = await query

      if (error) {
        throw new Error(error.message)
      }

      // update the list in redux
      const newList = [...list, ...data]
      dispatch(updateList(newList))

      // Updating showing text in redux
      dispatch(updateResultCounter({ showing: newList.length, results: count ? count : 0 }))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Update list whenever list in redux updates
  useEffect(() => {
    setList(globallist)
  }, [globallist])

  // Featch data
  useEffect(() => {
    setList([])
    void fetchData()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKeyword, perPageCount, filterBarangay, filterRequirements])

  const isDataEmpty = !Array.isArray(list) || list.length < 1 || !list

  return (
    <>
    <TopBarDark/>
    <div className="app__main">
      <div>
          <div className='app__title'>
            <Title title='Scholars'/>
          </div>

          {/* Filters */}
          <div className='app__filters'>
            <Filters
              setFilterKeyword={setFilterKeyword}
              setFilterBarangay={setFilterBarangay}
              setFilterRequirements={setFilterRequirements}
            />
          </div>

          {/* Per Page */}
          <PerPage
            showingCount={resultsCounter.showing}
            resultsCount={resultsCounter.results}
            perPageCount={perPageCount}
            setPerPageCount={setPerPageCount}/>

          {/* Main Content */}
          <div>
          <table className="app__table">
              <thead className="app__thead">
                  <tr>
                      <th className="hidden md:table-cell app__th pl-4"></th>
                      <th className="hidden md:table-cell app__th">
                          Student Name
                      </th>
                      <th className="hidden md:table-cell app__th">
                          Completed Requirements
                      </th>
                      <th className="hidden md:table-cell app__th">
                          Remarks
                      </th>
                  </tr>
              </thead>
              <tbody>
                {
                  !isDataEmpty && list.map((item: any) => (
                    <tr
                      key={uuid()}
                      className="app__tr">
                      <td
                        className="w-6 pl-4 app__td">
                      </td>
                      <th
                        className="app__th_firstcol">
                        <div>
                          {
                            (item.fullname && item.fullname !== '')
                              ? capitalizeWords(item.fullname)
                              : capitalizeWords(item.firstname + ' ' + item.middlename + ' ' + item.lastname)
                          }
                        </div>
                        <div className='font-light'>No. {item.number}</div>
                        <div className='font-light'>{item.contact_number}</div>
                        <div className='font-light'>{item.school}</div>
                        <div className='font-light'>{item.course}  {item.year}</div>
                        <div className='font-light'>{item.barangay}</div>
                        {/* Mobile View */}
                        <div>
                          <div className="md:hidden app__td">
                            <div>Requirements:</div>
                            <div className='items-center mt-1'>
                              {
                                requirementsList.map((req: RequirementTypes) => (
                                  <div key={uuid()} className='flex flex-col space-y-0'>
                                    <RequirementsCheckbox
                                      req={req}
                                      userId={item.id}
                                      userRequirements={item.requirements || []}
                                      />
                                  </div>
                                ))
                              }
                            </div>
                            <div className='mt-2'>
                            Remarks: <span className='font-light'>{item.remarks || ''}</span>
                            </div>
                          </div>
                        </div>
                        {/* End - Mobile View */}

                      </th>
                      <td
                        className="hidden md:table-cell app__td">
                        <div className='items-center'>
                          {
                            requirementsList.map((req: RequirementTypes) => (
                              <div key={uuid()} className='flex flex-col space-y-0'>
                                <RequirementsCheckbox
                                  req={req}
                                  userId={item.id}
                                  userRequirements={item.requirements || []}
                                  />
                              </div>
                            ))
                          }
                        </div>
                      </td>
                      <td
                        className="hidden md:table-cell app__td">
                        <div>
                          {item.remarks || ''}
                        </div>
                      </td>
                    </tr>
                  ))
                }
                { loading && <TableRowLoading cols={5} rows={2}/> }
              </tbody>
            </table>
            {
              (!loading && isDataEmpty) &&
                <div className='app__norecordsfound'>No records found.</div>
            }
          </div>

          {/* Show More */}
          {
            (resultsCounter.results > resultsCounter.showing && !loading) &&
              <ShowMore
                handleShowMore={handleShowMore}/>
          }
      </div>
    </div>
  </>
  )
}
export default Page
