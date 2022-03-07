import Select from 'react-select'
import { useState, useEffect } from 'react'

export default function SortBy({ onChange }) {
  const options = [
    { value: 'name', label: 'Name' },
    { value: 'contact', label: 'Contact' },
    { value: 'location', label: 'Location' },
    { value: 'work', label: 'Work' },
    { value: 'role', label: 'Role' },
    { value: 'referral', label: 'Referral' },
    { value: 'lastUpdated', label: 'Updated' }
  ]
  const [obj, setObj] = useState({ value: 'contact', label: 'Contact' })

  return (
    <Select
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        menu: (provided) => ({ ...provided, zIndex: 9999 })
      }}
      defaultValue={options[1]}
      placeholder='Sort By'
      options={options}
      onChange={(e) => {
        onChange(e)
        setObj(e)
      }}
      value={obj}
    />
  )
}
