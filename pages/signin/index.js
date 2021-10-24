import { useState, useEffect } from 'react'
import Link from 'next/link'
import GoogleAuth from '../../components/GoogleAuth'
import route from 'next/router'
import { getAuth } from 'firebase/auth'

export default function SignUp() {
  const [user, setUser] = useState(null)

  const auth = getAuth()

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user)
    })
  }, [])

  if (user) route.push('/')
  return (
    <>
      {console.log(user)}
      <div className='flex justify-center mt-14 mb-6 h-20 items-center'>
        <div className='bg-gray-300 h-px w-1/6'></div>
        <h1 className='text-center text-4xl mx-4'>Loop</h1>
        <div className='bg-gray-300 h-px w-1/6'></div>
      </div>
      <p className='text-center mb-14'> Stay in the loop. Forever.</p>
      <div className='bg-white mx-auto w-1/3 rounded-lg py-6 custom_shadow'>
        <GoogleAuth />
      </div>
    </>
  )
}
