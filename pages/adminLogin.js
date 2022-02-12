import { useRouter } from 'next/router'
import { useState } from 'react'
import Link from 'next/link'
import { hashcode } from './api/helpers'
import { GoogleSignIn } from '../components/googleSignIn'
import { useUser } from '../firebase/useUser'

export default function AdminLogin() {
  const router = useRouter()
  const [formData, setFormData] = useState({})
  const [error, setError] = useState('')
  const user = useUser()

  function updateFormData(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (user) {
      await fetch('api/adminLogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', userId: user.uid },
        body: JSON.stringify({ formData })
      }).then((res) => {
        if (res.ok) {
          router.push({
            pathname: '/home',
            query: { communityId: formData.communityId, token: hashcode(formData.communityToken) }
          })
        } else {
          setError("Community doesn't exist or token is incorrect.")
        }
      })
    }
  }

  return (
    <div className='h-screen flex bg-gradient-to-r from-indigo-dark via-gray to-indigo-light'>
      <div className='w-full max-w-md m-auto bg-white rounded-lg drop-shadow py-10 px-16'>
        <h1 className='text-xl font-medium mt-4 text-center'>Log in to manage your community.</h1>
        <br></br>
        <form onSubmit={onSubmit}>
          <input
            className='w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'
            type='text'
            name='communityId'
            placeholder='Community Id'
            onChange={updateFormData}
          />
          <br></br>
          <input
            className='w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'
            type='text'
            name='communityToken'
            placeholder='Community Token'
            onChange={updateFormData}
          />
          <br></br>
          <GoogleSignIn></GoogleSignIn>
          <br></br>
          <br></br>
          <h1 className='text-red'>{error}</h1>
        </form>
        <br></br>
        <h2>
          <Link href='/' passHref>
            <a className='text-blue hover:underline'>Back to member login</a>
          </Link>
        </h2>
      </div>
    </div>
  )
}
