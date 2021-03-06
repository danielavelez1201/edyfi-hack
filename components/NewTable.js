/* eslint-disable react/jsx-key */
import React from 'react'
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce, useSortBy, usePagination } from 'react-table'
import {
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/solid'
import { Button, PageButton } from './shared/Button'
import { classNames } from './shared/Utils'
import { SortIcon, SortUpIcon, SortDownIcon } from './shared/Icon'
import { useUser } from '../firebase/useUser'

// Define a default UI for filtering
function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <label className='flex gap-x-2 items-baseline'>
      <span className='text-gray-700'>Search: </span>
      <input
        type='text'
        className='rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value)
          onChange(e.target.value)
        }}
        placeholder={`${count} records...`}
      />
    </label>
  )
}

// This is a custom filter UI for selecting
// a unique option from a list
export function SelectColumnFilter({ column: { filterValue, setFilter, preFilteredRows, id, render } }) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach((row) => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  // Render a multi-select box
  return (
    <label className='flex gap-x-2 items-baseline'>
      <span className='text-gray-700'>{render('Header')}: </span>
      <select
        className='rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
        name={id}
        id={id}
        value={filterValue}
        onChange={(e) => {
          setFilter(e.target.value || undefined)
        }}
      >
        <option value=''>All</option>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

export const HelpAsks = [
  { value: 'investors', text: 'Looking for investors', emoji: '????', color: 'bg-green-100' },
  { value: 'cofounders', text: 'Searching for co-founders', emoji: '????', color: 'bg-yellow-100' },
  { value: 'refer', text: 'Job hunting', emoji: '??????', color: 'bg-purple-100' },
  { value: 'hiring', text: 'Hiring', emoji: '????', color: 'bg-blue-100' }
]

export const HelpOffers = [
  { value: 'investors', text: 'Connect to investors', emoji: '????', color: 'bg-green-100' },
  { value: 'cofounders', text: 'Connect potential co-founders', emoji: '????', color: 'bg-yellow-100' },
  { value: 'refer', text: 'Refer to company', emoji: '???', color: 'bg-purple-100' },
  { value: 'hiring', text: 'Relay hiring message', emoji: '????', color: 'bg-blue-100' }
]

export const HelpLabelKey = () => {
  return (
    <div className='flex'>
      {HelpOffers.map((offer) => {
        return (
          <div
            className={classNames(
              'my-0.5 mx-0.5 px-3 py-1 w-max uppercase leading-wide font-bold text-xs rounded-full shadow-sm ',
              offer.color
            )}
          >
            {offer.emoji} = {offer.text}
          </div>
        )
      })}
    </div>
  )
}

export function OfferState({ value }) {
  return (
    <div className='flex flex-wrap'>
      {value &&
        value.map((value) => {
          const item = HelpOffers.filter((x) => x.value === value)[0]
          const body = 'Hi from Loop! Heard you could help out with ' + `"` + item.text + `"...`
          return (
            <a
              href={`mailto:` + 'dvelez@mit.edu' + `?subject=Loop ask&body=` + body}
              className={classNames(
                'my-0.5 mx-0.5 px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm hover:bg-gray-100',
                item.color
              )}
            >
              {item.emoji}
            </a>
          )
        })}
    </div>
  )
}

export function InterestsState({ value }) {
  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5)
  }

  return (
    <span className={'text-sm font-medium text-gray-500 no-underline'}>
      {shuffle(value)
        .slice(0, 3)
        .map((interest) => {
          return (
            <>
              <p
                className={classNames('my-0.5 leading-wide font-bold text-xs rounded-full shadow-sm hover:bg-gray-100')}
              >
                {interest}
              </p>
            </>
          )
        })}
    </span>
  )
}

export function AvatarCell({ value, column, row }) {
  return (
    <div className='flex items-center'>
      {/* <div className='flex-shrink-0 h-10 w-10'>
        <img className='h-10 w-10 rounded-full' src={row.original[column.imgAccessor]} alt='' />
      </div> */}
      <div className='ml-4'>
        <div className='text-sm font-medium text-gray-900'>
          {value + ' '}
          {row.original[column.lastnameAccessor]}
        </div>
        <div className='text-sm text-gray-500'>{row.original[column.emailAccessor]}</div>
        <div className='text-sm text-gray-500'>{row.original[column.phoneAccessor]}</div>
      </div>
    </div>
  )
}

export function WorkCell({ value, column, row }) {
  return (
    <div className='flex text-xs text-gray-500 flex flex-col'>
      {row.original[column.industryAccessor]}
      <div className='flex text-sm'>
        <div className='font-medium mr-0.5'>{value}</div>
        at
        <div className='font-medium  ml-0.5'>{row.original[column.workAccessor]}</div>
      </div>
    </div>
  )
}

export function UpdatedCell({ value }) {
  const date = new Date(value)
  return <div>{date.toLocaleString().split(',')[0]}</div>
}

export function ProjectList({ value }) {
  return (
    <span className={'text-sm font-medium text-gray-500 no-underline'}>
      {value.map((value) => {
        return (
          <>
            <a className={'hover:underline'} rel='noreferrer' target='_blank' href={value}>
              {value}
            </a>
            <br></br>
          </>
        )
      })}
    </span>
  )
}

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,

    state,
    preGlobalFilteredRows,
    setGlobalFilter
  } = useTable(
    {
      columns,
      data
    },
    useFilters, // useFilters!
    useGlobalFilter,
    useSortBy,
    usePagination // new
  )
  const { user } = useUser()

  // Render the UI for your table
  return (
    <>
      <div className='sm:flex sm:gap-x-2'>
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        {headerGroups.map((headerGroup) =>
          headerGroup.headers.map((column) =>
            column.Filter ? (
              <div className='mt-2 sm:mt-0' key={column.id}>
                {column.render('Filter')}
              </div>
            ) : null
          )
        )}
      </div>
      <br></br>
      <HelpLabelKey></HelpLabelKey>
      {/* table */}
      <div className='mt-4 overflow-x-auto shadow  border-b border-gray-200 sm:rounded-lg'>
        <table {...getTableProps()} className=' border-collapse table-auto divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  // Add the sorting props to control sorting. For this example
                  // we can add them into the header props
                  <th
                    scope='col'
                    className='group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    <div className='flex items-center justify-between'>
                      {column.render('Header')}
                      {/* Add a sort direction indicator */}
                      <span>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <SortDownIcon className='w-4 h-4 text-gray-400' />
                          ) : (
                            <SortUpIcon className='w-4 h-4 text-gray-400' />
                          )
                        ) : (
                          <SortIcon className='w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100' />
                        )}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()} className='bg-white divide-y divide-gray-200'>
            {page.map((row, i) => {
              // new
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()} className='px-6 py-4 whitespace-nowrap' role='cell'>
                        {cell.column.Cell.name === 'defaultRenderer' ? (
                          <div className='text-sm text-gray-500'>{cell.render('Cell')}</div>
                        ) : (
                          cell.render('Cell')
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className='py-3 flex items-center justify-between'>
        <div className='flex-1 flex justify-between sm:hidden'>
          <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
            Previous
          </Button>
          <Button onClick={() => nextPage()} disabled={!canNextPage}>
            Next
          </Button>
        </div>
        <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
          <div className='flex gap-x-2 items-baseline'>
            <span className='text-sm text-gray-700'>
              Page <span className='font-medium'>{state.pageIndex + 1}</span> of{' '}
              <span className='font-medium'>{pageOptions.length}</span>
            </span>
            <label>
              <span className='sr-only'>Items Per Page</span>
              <select
                className='form-select mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                value={state.pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                }}
              >
                {[5, 10, 20].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <nav className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px' aria-label='Pagination'>
              <PageButton className='rounded-l-md' onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                <span className='sr-only'>First</span>
                <ChevronDoubleLeftIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </PageButton>
              <PageButton onClick={() => previousPage()} disabled={!canPreviousPage}>
                <span className='sr-only'>Previous</span>
                <ChevronLeftIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </PageButton>
              <PageButton onClick={() => nextPage()} disabled={!canNextPage}>
                <span className='sr-only'>Next</span>
                <ChevronRightIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </PageButton>
              <PageButton className='rounded-r-md' onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                <span className='sr-only'>Last</span>
                <ChevronDoubleRightIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </PageButton>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}

export default Table
