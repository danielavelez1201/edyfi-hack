import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useLocalStorage, useLocation } from 'react-use'
import { hashcode } from './api/helpers'
import 'regenerator-runtime/runtime'
import React from 'react'
import Table, { AvatarCell, OfferState, SelectColumnFilter, ProjectList } from '../components/NewTable' // new
import { useUser } from '../firebase/useUser'
import { CopyModal } from '../components/copyModal'
import { CommunityBoard } from '../components/communityBoard'
import Link from 'next/link'
import { SMSDemo } from '../components/smsDemo'

const fakeUser = {
  firstName: 'Daniela',
  lastName: 'Velez',
  email: 'dvelez@mit.edu',
  location: 'Boston',
  work: 'Figma',
  role: 'SWE',
  projects: ['Loop'],
  offers: ['investors', 'refer', 'hiring', 'cofounders']
}

export default function Home() {
  const router = useRouter()
  const { user } = useUser()
  const [userList, setUserList] = useState([])
  const [originalData, setOriginalData] = useState([])
  const [loading, setLoading] = useState(true)
  const [communityId, setCommunityId] = useLocalStorage('communityId', router.query.communityId)
  const [token, setToken] = useLocalStorage('token', router.query.token)
  const [communities, setCommunities] = useState([])
  const [communityBoardContent, setCommunityBoardContent] = useState({ text: '', links: [], events: [] })
  const [editingCommunityBoard, setEditingCommunityBoard] = useState(false)

  const communityBoardProps = {
    content: communityBoardContent,
    setContent: setCommunityBoardContent,
    editing: editingCommunityBoard,
    setEditing: setEditingCommunityBoard,
    communityId: communityId
  }

  let location = useLocation()

  const onboardLink = `keeploop.io/onboard/${communityId}`

  async function sendBumps() {
    await fetch('api/textBump').then((res) => res.json())
  }

  async function sendRandBumps() {
    await fetch('api/randomBumps').then((res) => res.json())
  }

  function switchCommunity(community) {
    setCommunityId(community)
    setToken('')
    window.localStorage.setItem('communityId', JSON.stringify(community))
    router.push({
      pathname: '/home',
      query: { communityId: community, bypassAuth: true }
    })
  }

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'firstName',
        lastnameAccessor: 'lastName',
        Cell: AvatarCell,
        //imgAccessor: 'imgUrl',
        emailAccessor: 'email',
        phoneAccessor: 'phone'
      },
      {
        Header: 'Location',
        accessor: 'location'
      },
      {
        Header: 'Projects',
        accessor: 'projects',
        Cell: ProjectList
      },
      {
        Header: 'Role',
        accessor: 'role',
        Filter: SelectColumnFilter, // new
        filter: 'includes'
      },
      {
        Header: 'Last Updated',
        accessor: 'updated',
        filter: 'includes'
      },
      {
        Header: 'Can help with...',
        accessor: 'offers',
        Cell: OfferState
      }
    ],
    []
  )

  useEffect(() => {
    function checkAuth(dataToken) {
      // If user is logged in with google, community token isn't needed
      if (router.query.bypassAuth) {
        return true
      }
      if (hashcode(dataToken) !== token) {
        console.log('hash', hashcode(dataToken), 'original', token)
        console.log('WRONG TOKEN')
        //router.push({
        //pathname: '/'
        //})
      } else {
        return true
      }
    }

    setCommunityId(router.query.communityId)
    setToken(router.query.token)

    const fetchData = async () => {
      console.log('user', user)
      // setUserList([fakeUser])
      // setOriginalData([fakeUser])
      setLoading(false)
      await fetch('api/getData', { method: 'POST', headers: { communityId: communityId, googleUser: user } })
        .then((res) => res.json())
        .then((result) => {
          if (result.length === 0) {
            setLoading(true)
          } else {
            console.log('API RESULT', result)
            console.log('token', result.communityToken)
            const auth = checkAuth(result.communityToken)
            if (auth) {
              setUserList(result.users)
              setOriginalData(result.users)
              //setCommunities(result.communities)
              setLoading(false)
            }
          }
        })
    }
    fetchData()
  }, [
    communityId,
    location,
    router.query.bypassAuth,
    router.query.communityId,
    router.query.token,
    setCommunityId,
    setToken,
    token,
    user
  ])

  return (
    <div>
      <div className='h-fit min-h-screen justify-center items-center w-full min-w-min py-14 bg-gradient-to-r from-indigo-dark via-gray to-indigo-light'>
        {router.query.demo === 'true' && (
          <div className='ml-10 mt-10 w-max max-w-8xl m-auto bg-white rounded-lg drop-shadow py-5 px-5'>
            <div className='flex'>
              <h1 className='text-xl animate-bounce pr-2'>👋 </h1>
              <h1 className='text-xl font-light text-primary mt-1 mb-1 '>Here's your new community!</h1>
            </div>
            <div>
              <h3 className='text-md font-light text-primary mt-1 mb-1'>
                Try editing the community board to add important info, events, and links!
              </h3>
              <SMSDemo communityId={communityId}></SMSDemo>
              <div className='flex'>
                <h3 className='text-md font-light text-primary mt-1 mb-1'>After you're done, let's try</h3>
                <button className='ml-1 hover:underline'>
                  <Link href='/onboard/demo' passHref>
                    <h3 className='text-md font-bold text-primary mt-1 mb-1'>joining another community as a member!</h3>
                  </Link>
                </button>
              </div>
            </div>
          </div>
        )}
        {router.query.communityId === 'demo' && (
          <div className='bg-white top-5 h-fit ml-10 mt-10 max-w-4xl m-auto rounded-lg drop-shadow py-5 px-5'>
            <div className='flex'>
              <h1 className='text-xl animate-bounce pr-2'>👋 </h1>
              <h1 className='text-xl font-light text-primary mt-1 mb-1 '>You've joined community demo!</h1>
            </div>
            <h3 className='text-md font-light text-primary mt-1 mb-1'>
              Browse through the community directory. Try clicking on the "can help with..." emojis to start an email
              for that. Thanks for checking out our demo!
            </h3>
            <button className='ml-1 hover:underline'>
              <Link href='/' passHref>
                <h3 className='text-md font-bold text-primary mt-1 mb-1'>Back to homepage</h3>
              </Link>
            </button>
          </div>
        )}
        <div className='mx-20 my-10'>
          <div className='w-fit m-auto rounded-lg bg-gray-light drop-shadow py-10 px-16'>
            <div className='flex justify-between border-b-2 border-gray-300 py-3'>
              <h1 className='text-3xl font-bold mb-2'>{communityId}</h1>
              {userList.length !== 0 && !loading && <CopyModal onboardLink={onboardLink}></CopyModal>}
            </div>
            <div className='w-full h-full flex flex-col justify-center items-center'>
              <div className='mt-12 '></div>
              <CommunityBoard data={communityBoardProps}></CommunityBoard>
              {/* <div className='flex items-center'>
                {userList.length !== 0 && (
                  <button
                    onClick={() => sendBumps()}
                    className='bg-blue py-2 px-4 text-sm text-white rounded mr-2  focus:outline-none focus:border-green-dark hover:bg-blue-hover '
                  >
                    Send text to all members
                  </button>
                )}
              </div> */}
              <div className='flex items-center'>
                {userList.length !== 0 && (
                  <button
                    onClick={() => sendRandBumps()}
                    className='bg-blue py-2 px-4 text-sm text-white rounded mr-2  focus:outline-none focus:border-green-dark hover:bg-blue-hover '
                  >
                    Send matching text
                  </button>
                )}
              </div>
              {userList.length > 0 && (
                <main className='max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-4'>
                  <div className=''></div>
                  <div className='mt-6'>{userList.length > 0 && <Table columns={columns} data={userList} />}</div>
                </main>
              )}
              {userList.length === 0 && !loading && (
                <div>
                  <h1 className='text-lg font-bold my-2 mt-10'>
                    ✨ Let's get some members added! Send your members the magic link:
                  </h1>
                  {loading && <h1>Just a sec...</h1>}
                  <br></br>
                  <CopyModal onboardLink={onboardLink}></CopyModal>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
