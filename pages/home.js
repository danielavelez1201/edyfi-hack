import SortableTable from '../components/SortableTable'
import { useState, useEffect } from 'react'
import { LogInstance } from 'twilio/lib/rest/serverless/v1/service/environment/log'
import { useRouter } from 'next/router'
import route from 'next/router'
import Image from 'next/image'
import { useLocalStorage } from 'react-use'
import { hashcode } from './api/helpers'
import SortBy from '../components/SortBy'
import 'regenerator-runtime/runtime'
import React from 'react'
import Button from '../components/shared/Button'
import Table, { AvatarCell, ReferState, SelectColumnFilter, ProjectList } from '../components/NewTable' // new
import { useUser } from '../firebase/useUser'

const Message = ({ variant, children }) => {
  // the alert is displayed by default
  const [alert, setAlert] = useState(true)

  useEffect(() => {
    // when the component is mounted, the alert is displayed for 3 seconds
    setTimeout(() => {
      setAlert(false)
    }, 3000)
  }, [])

  return <div className={`alert alert-${variant}`}>{children}</div>
}

export default function Home() {
  const router = useRouter()
  const { user } = useUser()
  const [userList, setUserList] = useState([])
  const [originalData, setOriginalData] = useState([])
  const [loading, setLoading] = useState(true)
  const [communityId, setCommunityId] = useLocalStorage('communityId', router.query.communityId)
  const [token, setToken] = useLocalStorage('token', router.query.token)
  const [copied, setCopied] = useState(false)

  console.log(communityId)
  const onboardLink = `keeploop.io/onboard/${communityId}`

  function checkAuth(dataToken) {
    console.log(hashcode(dataToken), token)
    if (hashcode(dataToken) !== token) {
      router.push({
        pathname: '/'
      })
    } else {
      return true
    }
  }

  async function sendBumps() {
    await fetch('api/textBumps').then((res) => res.json())
  }

  function copy(e) {
    //navigator.clipboard.writeText(onboardLink).then(() => alert('Copied'))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
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
        Header: 'Can refer',
        accessor: 'refer',
        Cell: ReferState
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
        Header: 'Asks',
        accessor: 'asks',
        filter: 'includes'
      },
      {
        Header: 'Last Updated',
        accessor: 'updated',
        filter: 'includes'
      }
    ],
    []
  )

  //const data = React.useMemo(() => getData(), [])

  useEffect(() => {
    setCommunityId(router.query.communityId)
    setToken(router.query.token)
    const fetchData = async () => {
      // await fetch('api/getCommunityInfo', { method: 'POST', headers: { communityId } })
      //   .then((res) => res.json())
      //   .then((result) => {
      //     console.log({ communityInfo: result })
      //   })
      await fetch('api/getData', { method: 'POST', headers: { communityId: communityId } })
        .then((res) => res.json())
        .then((result) => {
          console.log({ result })
          if (result.length === 0) {
            setLoading(false)
          } else {
            const auth = checkAuth(result[0].token)
            if (auth) {
              console.log({ afterFetch: true, userList })
              setUserList(result)
              setOriginalData(result)
              setLoading(false)
            }
          }
        })
    }
    fetchData()
  }, [])

  return (
    <div className='h-full py-14 flex bg-gradient-to-r from-indigo-dark via-gray to-indigo-light'>
      <div className='w-full m-auto mx-20 my-10 rounded-lg bg-gray-light drop-shadow py-10 px-16'>
        <div className='w-full h-full flex flex-col justify-center items-center'>
          <div className='mt-12 '>
            <h1 className='text-2xl font-bold text-gray text-center'>{communityId} </h1>
            <h1 className='text-3xl font-bold text-center mb-2'>Members</h1>
            {userList.length !== 0 && !loading && (
              <div onClick={copy} className='-ml-2 border-solid flex flex-grow bg-white rounded-lg text-cyan'>
                <div className='px-5 border-r-2 border-r-gray justify-center flex items-center '>
                  <Image src='/link.png' width='23px' height='20px' />
                </div>
                <div className='px-3 justify-center flex items-center'>{onboardLink}</div>
                <div className='px-2 py-2'>
                  <button
                    className={`${
                      copied ? 'bg-green hover:bg-green-light' : 'bg-blue-500 hover:bg-blue-700 '
                    } text-white font-bold py-2 px-4 rounded`}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
          </div>
          <br></br>
          <div className='flex items-center'>
            <button
              onClick={() => sendBumps()}
              className='bg-blue py-2 px-4 text-sm text-white rounded mr-2  focus:outline-none focus:border-green-dark hover:bg-blue-hover '
            >
              Send text to all members
            </button>
          </div>
          <br></br>
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
              <div onClick={copy} className='bg-gray-light rounded px-5 py-5'>
                <div className='flex items-center'>
                  <h1 className='text-blue font-bold mr-5'>{onboardLink}</h1>
                  <Image src='/copy.png' width='20px' height='25px' />
                  {copied && <Message />}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

//other code if needed:

// const [people, setPeople] = useState([
//   {
//     id: 0,
//     name: "John Doe",
//     email: "johndoe@gmail.com",
//     phone: "123-456-7890",
//     location: "New York",
//     work: "Google", // or open to work
//     role: "Engineer",
//     projects: [{name: 'nft',a: 'https://google.com'}, {name: "meta",a:'https://google.com'}], //current projects
//     refer: true, // or no
//     updated: "October 24",
//   },
//   {
//     id: 1,
//     name: "The Doe",
//     email: "thedoe@gmail.com",
//     phone: "123-456-7891",
//     location: "San Francisco",
//     work: "🔎", // or open to work
//     role: "",
//     projects: [{name: 'web3',a:'https://google.com'}], //current projects
//     refer: false, // or no
//     updated: "October 24",
//   },
//   {
//     id: 2,
//     name: "Big Doe",
//     email: "bigdoe@gmail.com",
//     phone: "123-456-7892",
//     location: "Miami",
//     work: "CompanyName", // or open to work
//     role: "Founder",
//     projects: [], //current projects
//     refer: true, // or no
//     updated: "October 24",
//   },
// ]);

// useEffect(() => {
//   const fetchData = async () => {
//     await fetch(
//       "https://randomapi.com/api/6de6abfedb24f889e0b5f675edc50deb?fmt=raw&sole"
//     )
//       .then((res) => res.json())
//       .then(
//         (result) => {
//           setIsLoaded(true);
//           setPeople(result);
//         },
//         (error) => {
//           setIsLoaded(true);
//           setError(error);
//         }
//       );
//   };
//   fetchData();
// }, []);
