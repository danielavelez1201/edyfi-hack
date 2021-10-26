import { useState, useEffect } from 'react'
import { signInWithGoogle, user } from '../firebase/clientApp'
import { useRouter } from 'next/router'
import Google from '../img/Google.png'
import Image from 'next/image'
import Link from 'next/link'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { hashcode } from './api/helpers'

export default function NewCommunity() {
  const router = useRouter()
  const [formData, setFormData] = useState({})
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  function updateFormData(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  useEffect(() => {
    const auth = getAuth()
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser !== undefined) {
        setUserLoggedIn(true)
        setUser(currentUser)
      } else {
        console.log('not logged in')
      }
    })
  }, [])

  const googleTextStyle = userLoggedIn ? 'text-center ml-5 text-cyan' : 'text-center ml-5'
  async function onSubmit(e) {
    if (userLoggedIn) {
      e.preventDefault()
      await fetch('api/createCommunity', {
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
          console.log('Error')
        }
      })
    }
  }

  return (
    <div className='h-screen flex bg-gradient-to-r from-indigo-dark via-gray to-indigo-light'>
      <div className='w-full max-w-md m-auto bg-white rounded-lg drop-shadow py-10 px-16'>
        <h1 className='text-xl font-medium mt-4 text-left'>Let's create your new community :)</h1>
        <br></br>
        <h1>
          Your <strong>community id </strong> serves as a unique name for your community, and your
          <strong> token</strong> is for just your members to be able to sign in.
        </h1>
        <br></br>
        <form onSubmit={onSubmit}>
          <input
            className='w-full p-2 bg-gray-light text-primary  rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'
            type='text'
            name='communityId'
            placeholder='Community Id'
            onChange={updateFormData}
          />
          <br></br>
          <input
            className='w-full p-2 bg-gray-light text-primary  rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'
            type='text'
            name='communityToken'
            placeholder='Token'
            onChange={updateFormData}
          />
          <br></br>
          <button
            className='focus:outline-none flex items-center  h-9 justify-left  rounded-xl p-5 border-black border border-cyan'
            onClick={signInWithGoogle}
          >
            <Image height={24} width={24} src={Google} />
            {userLoggedIn && <div className={googleTextStyle}>Google account connected!</div>}
            {!userLoggedIn && <div className={googleTextStyle}>Connect your Google account</div>}
          </button>
          <br></br>
          {userLoggedIn && (
            <button className='bg-blue py-2 px-4 text-sm text-white rounded  focus:outline-none focus:border-green-dark hover:bg-blue-hover '>
              Create community
            </button>
          )}

          <br></br>
        </form>
        <br></br>
        <h2>
          <Link href='/' passHref>
            <a className='text-blue'>Back to login</a>
          </Link>
        </h2>
      </div>
    </div>
  )
}
