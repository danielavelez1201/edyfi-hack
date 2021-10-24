import SortableTable from '../components/SortableTable'
import { useState, useEffect } from 'react'
import { LogInstance } from 'twilio/lib/rest/serverless/v1/service/environment/log'
import { useRouter } from 'next/router'
import user from '../firebase/clientApp'
import route from 'next/router'
import Image from 'next/image'
import { useLocalStorage } from 'react-use'
import { hashcode } from './api/helpers'

export default function Home() {
  const router = useRouter()
  const [userList, setUserList] = useState([])
  const [loading, setLoading] = useState(true)
  const [communityId, setCommunityId] = useLocalStorage('communityId', router.query.communityId)
  const [token, setToken] = useLocalStorage('token', router.query.token)

  console.log(communityId)
  const onboardLink = 'www.loop.com/onboard/' + communityId

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
    /* Get the text field */
    var copyText = document.getElementById('link')
    console.log(copyText)
    /* Select the text field */
    copyText.select()
    copyText.setSelectionRange(0, 99999) /* For mobile devices */
    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText.value)
    /* Alert the copied text */
    alert('Copied the text: ' + copyText.value)
  }

  useEffect(() => {
    setCommunityId(router.query.communityId)
    setToken(router.query.token)
    const fetchData = async () => {
      await fetch('api/getData', { method: 'POST', headers: { communityId: communityId } })
        .then((res) => res.json())
        .then((result) => {
          console.log(result)
          if (result.length === 0) {
            setLoading(false)
          } else {
            const auth = checkAuth(result[0].token)
            if (auth) {
              setUserList(result)
              setLoading(false)
            }
          }
        })
    }
    fetchData()
  }, [])

  return (
    <div className='h-full py-14 flex bg-gradient-to-r from-indigo-dark via-gray to-indigo-light'>
      <div className='w-full m-auto mx-20 my-10 bg-white rounded-lg drop-shadow py-10 px-16'>
        <div className='w-full h-full flex flex-col justify-center items-center'>
          <div className='mt-12 '>
            <h1 className='text-2xl font-bold text-gray'>{communityId} </h1>
            <h1 className='text-3xl font-bold text'>Members</h1>
            {userList.length !== 0 && !loading && (
              <div onClick={copy} className='bg-gray-light rounded px-5 py-5'>
                <Image src='/copy.png' width='20px' height='25px' />
                <input
                  type='text'
                  disabled={true}
                  id='link'
                  value={onboardLink}
                  placeholder={onboardLink}
                  className='text-blue w-full font-bold w-auto items-center justify-center'
                ></input>
              </div>
            )}
          </div>
          <br></br>
          <button
            onClick={() => sendBumps()}
            className='bg-blue py-2 px-4 text-sm text-white rounded  focus:outline-none focus:border-green-dark hover:bg-blue-hover '
          >
            Broadcast text bumps
          </button>
          {userList.length > 0 && <SortableTable people={userList} />}
          {userList.length === 0 && !loading && (
            <div>
              <h1 className='text-2l'>✨ Let's get some members added! Send your members the magic link:</h1>
              {loading && <h1>Just a sec...</h1>}
              <br></br>
              <div onClick={copy} className='bg-gray-light rounded px-5 py-5'>
                <Image src='/copy.png' width='33px' height='40px' />
                <input
                  type='text'
                  disabled={true}
                  id='link'
                  value={onboardLink}
                  placeholder={onboardLink}
                  className='text-blue w-full font-bold w-auto items-center justify-center'
                ></input>
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
