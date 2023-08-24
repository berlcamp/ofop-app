'use client'

import React, { useEffect, useState } from 'react'
import { PerPage, TopBarDark, TableRowLoading, ShowMore, Title } from '@/components'
import Filters from './Filters'
import { capitalizeWords, fullTextQuery } from '@/utils/text-helper'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Redux imports
import { useSelector, useDispatch } from 'react-redux'
import { updateList } from '@/GlobalRedux/Features/listSlice'
import { updateResultCounter } from '@/GlobalRedux/Features/resultsCounterSlice'
import uuid from 'react-uuid'

const Page: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<any[]>([])
  const [filterKeyword, setFilterKeyword] = useState<string>('')
  const [filterBarangay, setFilterBarangay] = useState<string>('')
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
        .select()

      // Full text search
      if (filterKeyword !== '') {
        const searchSplit = (filterKeyword).split(' ')
        // Search match
        searchSplit.forEach(item => {
          query = query.or(`firstname.ilike.%${item}%,middlename.ilike.%${item}%,lastname.ilike.%${item}%,fullname.ilike.%${item}%`)
        })
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
        .select()

      // Full text search
      if (filterKeyword !== '') {
        query = query.or(`firstname.ilike.%${filterKeyword}%,middlename.ilike.%${filterKeyword}%,lastname.ilike.%${filterKeyword}%,fullname.ilike.%${filterKeyword}%`)
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
  }, [filterKeyword, perPageCount, filterBarangay])

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
                          Barangay
                      </th>
                      <th className="hidden md:table-cell app__th">
                          Batch
                      </th>
                      <th className="hidden md:table-cell app__th">
                          Contact #
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
                        {/* Mobile View */}
                        <div>
                          <div className="md:hidden app__td">
                          Barangay: {item.barangay}
                          </div>
                        </div>
                        {/* End - Mobile View */}

                      </th>
                      <td
                        className="hidden md:table-cell app__td">
                        <div>{item.barangay}</div>
                      </td>
                      <td
                        className="hidden md:table-cell app__td space-y-1">
                        <div>{item.batch}</div>
                      </td>
                      <td
                        className="hidden md:table-cell app__td">
                        <div>{item.contact_number}</div>
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
