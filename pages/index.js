import 'tailwindcss/tailwind.css'
import router from 'next/router'
import { useState } from 'react'
import { hashcode } from './api/helpers'
import Link from 'next/link'

export default function Landing() {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState('')

  function updateFormData(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  async function onSubmit(e) {
    e.preventDefault()
    await fetch('api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formData })
    }).then((res) => {
      if (res.ok) {
        router.push({
          pathname: '/home',
          query: { communityId: formData.communityId, token: hashcode(formData.communityToken) }
        })
      } else {
        setError("Community doesn't exist or password is incorrect.")
      }
    })
  }

  return (
    <div className='h-screen flex bg-gradient-to-r from-indigo-dark via-gray to-indigo-light'>
      <div className='w-full max-w-md m-auto bg-white rounded-lg drop-shadow py-10 px-16'>
        <div className='flex flex-col items-center mb-4'>
          <h1 className='text-2xl font-medium text-primary mt-4 mb-1 text-center'>Welcome to Loop. </h1>
          <h3 className='text-gray text-sm'>Creating perennial communities.</h3>{' '}
        </div>

        <form onSubmit={onSubmit}>
          <input
            className='w-full p-2 bg-gray-light text-primary border-transparent rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'
            type='text'
            name='communityId'
            placeholder='Community Id'
            onChange={updateFormData}
          />
          <br></br>
          <input
            className='w-full p-2 bg-gray-light text-primary border-transparent rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'
            type='text'
            name='communityToken'
            placeholder='Token'
            onChange={updateFormData}
          />
          <br></br>
          <button className='bg-blue py-2 px-4 text-sm text-white rounded  focus:outline-none focus:border-green-dark hover:bg-blue-hover '>
            Log in to community
          </button>
          <br></br>
          <br></br>
          <h1 className='text-red'>{error}</h1>
        </form>
        <br></br>
        <h2>
          ➡️
          <Link href='/newCommunity' passHref>
            <a className='text-blue hover:underline ml-3'>Create a new community</a>
          </Link>
        </h2>
        <h2>
          ➡️
          <Link href='/adminLogin' passHref>
            <a className='text-blue hover:underline ml-3'>Log in as admin </a>
          </Link>
        </h2>
        <h2>
          ➡️
          <Link href='/userLogin' passHref>
            <a className='text-blue hover:underline ml-3'>Log in as user </a>
          </Link>
        </h2>
      </div>
    </div>
  )
}
