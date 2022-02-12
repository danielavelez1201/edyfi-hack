import { useRouter } from 'next/router'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useUser } from '../firebase/useUser'
import axios from 'axios'
import { signInWithGoogle } from '../firebase/clientApp'
import Google from '../public/Google.png'

export default function UserLogin() {
  const router = useRouter()
  const [phoneNum, setPhoneNum] = useState('')
  const [error, setError] = useState('')
  const { user } = useUser()

  const googleTextStyle = user ? 'text-center ml-5 text-cyan' : 'text-center ml-5'

  async function login() {
    await axios
      .post('/api/userLogin', {
        headers: { googleUser: user, phoneNum: phoneNum }
      })
      .then((res) => {
        setError('')
        if (res.status === 200) {
          router.push({
            pathname: '/home',
            query: { bypassAuth: true }
          })
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.msg === 'needs to make account') {
          setError("Account doesn't exist. Make one with a community onboarding link!")
        } else if (error.response && error.response.data) {
          setError(error.response.data)
        }
      })
  }

  return (
    <div className='h-screen flex bg-gradient-to-r from-indigo-dark via-gray to-indigo-light'>
      <div className='w-full max-w-md m-auto bg-white rounded-lg drop-shadow py-10 px-16'>
        <h1 className='text-xl font-medium mt-4 text-center'>Log in to view all your communities.</h1>
        <br></br>
        <input
          label='Phone'
          name='phone'
          type='text'
          placeholder='Phone'
          onChange={(e) => {
            setError('')
            setPhoneNum(e.target.value)
          }}
          className='w-full p-2 bg-gray-light text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'
        ></input>
        <button
          className='focus:outline-none flex items-center h-9 justify-left rounded-xl p-5 border border-cyan'
          onClick={signInWithGoogle}
          type='button'
        >
          <Image alt="don't be evil" height={24} width={24} src={Google} />
          {user && <div className={googleTextStyle}>Google account connected!</div>}
          {!user && <div className={googleTextStyle}>Connect your Google account</div>}
        </button>
        {!user && (
          <>
            <br></br>
            <h className='text-sm'>Sign in with Google to sync and protect your info across all your communities.</h>
          </>
        )}
        <h1 className='text-red'>{error}</h1>
        <button
          className='bg-blue py-2 px-4 text-white rounded-full font-medium mt-4  focus:outline-none focus:border-green-dark hover:bg-blue-hover '
          onClick={async () => {
            await login({})
          }}
          type='button'
        >
          Log in
        </button>
        <br></br>
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
