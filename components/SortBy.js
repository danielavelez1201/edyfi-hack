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
    { value: 'updated', label: 'Updated' }
  ]
  const [obj, setObj] = useState('')

  return (
    <Select defaultValue={options[1]} placeholder='Sort By' options={options} onChange={onChange} value={obj.value} />
  )
}
