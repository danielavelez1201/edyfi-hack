import { useState, useEffect } from 'react'
import { signInWithGoogle } from '../firebase/clientApp'
import { useUser } from '../firebase/useUser'
import { useRouter } from 'next/router'
import Google from '../public/Google.png'
import Image from 'next/image'
import Link from 'next/link'
import { hashcode } from './api/helpers'
import classNames from 'classnames'
import ReactTooltip from 'react-tooltip'
import questionIcon from '../public/questionIcon.svg'

export default function NewCommunity() {
  const router = useRouter()
  const { user } = useUser()
  const [formData, setFormData] = useState({})
  // const [userLoggedIn, setUserLoggedIn] = useState(false)
  // const [user, setUser] = useState(null)
  const demo = router.query.demo

  function updateFormData(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const googleTextStyle = user ? 'text-center ml-5 text-cyan' : 'text-center ml-5'
  async function onSubmit(e) {
    e.preventDefault()
    if (user) {
      await fetch('api/createCommunity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', googleUser: user },
        body: JSON.stringify({ formData })
      }).then((res) => {
        if (res.ok) {
          router.push({
            pathname: '/home',
            query: { communityId: formData.communityId, token: hashcode(formData.communityToken), demo: demo }
          })
        } else {
          console.log('Error')
        }
      })
    }
  }

  return (
    <div className='h-screen flex items-center flex-col bg-gradient-to-r from-indigo-dark via-gray to-indigo-light'>
      {demo && (
        <div
          className={classNames(
            'transition-all items-start duration-700 w-max max-w-md bg-white rounded-lg border border-gray-50 drop-shadow py-5 px-5 flex flex-col',
            { 'mt-14': demo, visible: demo, invisible: !demo }
          )}
        >
          <div className='flex'>
            <h1 className='text-xl animate-bounce pr-2'>👋 </h1>
            <h1 className='text-xl font-light text-primary mt-1 mb-1 '>
              Let's create a sample community of your choosing, and connect your google account. Click create community.
            </h1>
          </div>
          <button className='ml-7 hover:underline'>
            <Link href='/home?communityId=demo-starter&token=81dc9bdb52d03dc28036dbd8313ed055&demo=true' passHref>
              <h3 className='text-md font-light text-primary mt-1 mb-1'>Prefer using a sample starter community?</h3>
            </Link>
          </button>
        </div>
      )}

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
          <div className='flex items-center'>
            <input
              className='mr-2 p-2 bg-gray-light rounded-md outline-none'
              type='checkbox'
              name='communityBumps'
              placeholder='Matching'
              onChange={updateFormData}
            />
            <p className='mr-1'>Targeted matching</p>
            <Image data-tip data-for='matchedBumps' src={questionIcon} />
            <ReactTooltip style={{ width: '100px' }} id='matchedBumps' type='dark' effect='solid'>
              <div style={{ width: '150px' }} className='whitespace-normal'>
                People get matched based on their needs, location, interests, industry, etc.
              </div>
            </ReactTooltip>
          </div>
          <br></br>
          <button
            className='focus:outline-none flex items-center  h-9 justify-left  rounded-xl p-5 border border-cyan'
            onClick={signInWithGoogle}
          >
            <Image alt='dont be evil' height={24} width={24} src={Google} />
            {user && <div className={googleTextStyle}>Google account connected!</div>}
            {!user && <div className={googleTextStyle}>Connect your Google account</div>}
          </button>
          <br></br>
          {user && (
            <button type="submit" className='bg-blue py-2 px-4 text-sm text-white rounded  focus:outline-none focus:border-green-dark hover:bg-blue-hover '>
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
