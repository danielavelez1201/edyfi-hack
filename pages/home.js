import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useLocalStorage, useLocation } from 'react-use'
import { hashcode } from './api/helpers'
import 'regenerator-runtime/runtime'
import React from 'react'
import Table, { AvatarCell, OfferState, SelectColumnFilter, ProjectList } from '../components/NewTable' // new
import { useUser } from '../firebase/useUser'
import { CopyModal } from './components/copyModal'
import { Navbar } from './components/navbar'
import { classNames } from '../components/shared/Utils'
import { HelpLabelKey } from '../components/NewTable'
import { CommunityBoard } from './components/communityBoard'

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
  const [communityBoardContent, setCommunityBoardContent] = useState({ text: '', links: [] })
  const [editingCommunityBoard, setEditingCommunityBoard] = useState(false)

  const communityBoardProps = {
    content: communityBoardContent,
    setContent: setCommunityBoardContent,
    editing: editingCommunityBoard,
    setEditing: setEditingCommunityBoard
  }

  let location = useLocation()

  const onboardLink = `keeploop.io/onboard/${communityId}`

  async function sendBumps() {
    await fetch('api/textBumps').then((res) => res.json())
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
        router.push({
          pathname: '/'
        })
      } else {
        return true
      }
    }

    setCommunityId(router.query.communityId)
    setToken(router.query.token)

    const fetchData = async () => {
      console.log('user', user)
      setUserList([fakeUser])
      setOriginalData([fakeUser])
      setLoading(false)
      // await fetch('api/getData', { method: 'POST', headers: { communityId: communityId, googleUser: user } })
      //   .then((res) => res.json())
      //   .then((result) => {
      //     if (result.length === 0) {
      //       setLoading(true)
      //     } else {
      //       const auth = checkAuth(result.token)
      //       if (auth) {
      //         setUserList(result.users)
      //         setOriginalData(result.users)
      //         //setCommunities(result.communities)
      //         setLoading(false)
      //       }
      //     }
      //   })
    }
    fetchData()
  }, [location])

  return (
    <div>
      <div className='h-screen justify-center items-center w-screen py-14 flex bg-gradient-to-r from-indigo-dark via-gray to-indigo-light'>
        <div className='mx-20 my-10'>
          <div className='w-full m-auto rounded-lg bg-gray-light drop-shadow py-10 px-16'>
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
              {userList.length > 0 && (
                <main className='max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-4'>
                  <div className=''></div>
                  <div className='mt-6'>{userList.length > 0 && <Table columns={columns} data={userList} />}</div>
                </main>
              )}
              {userList.length === 0 && !loading && (
                <div>
                  <h1 className='text-2l'>✨ Let's get some members added! Send your members the magic link:</h1>
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
