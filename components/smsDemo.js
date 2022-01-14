import { useState } from 'react'
import Image from 'next/image'

export function SMSDemo(props) {
  const [showingUpdateDemo, setShowingUpdateDemo] = useState(false)
  const [showingNudgeDemo, setShowingNudgeDemo] = useState(false)
  const [updateDemoStage, setUpdateDemoStage] = useState(0)
  const [nudgeDemoStage, setNudgeDemoStage] = useState(0)

  function startUpdateDemo() {
    setUpdateDemoStage(0)
    if (showingNudgeDemo) {
      return
    }
    setShowingUpdateDemo(true)
    setTimeout(() => {
      setUpdateDemoStage(1)
      setTimeout(() => {
        setUpdateDemoStage(2)
        setTimeout(() => {
          setUpdateDemoStage(3)
          setTimeout(() => {
            setUpdateDemoStage(4)
            setTimeout(() => {
              setUpdateDemoStage(5)
              setTimeout(() => {
                setUpdateDemoStage(6)
              }, 500)
            }, 3000)
          }, 1000)
        }, 5000)
      }, 500)
    }, 1000)

    setUpdateDemoStage(0)
    setShowingUpdateDemo(false)
  }

  function startNudgeDemo() {
    setNudgeDemoStage(0)
    if (showingUpdateDemo) {
      return
    }
    setShowingNudgeDemo(true)

    setTimeout(() => {
      setNudgeDemoStage(1)
      setTimeout(() => {
        setNudgeDemoStage(2)
        setTimeout(() => {
          setNudgeDemoStage(3)
          setTimeout(() => {
            setNudgeDemoStage(4)
            setTimeout(() => {
              setNudgeDemoStage(5)
              setTimeout(() => {
                setNudgeDemoStage(6)
              }, 500)
            }, 3000)
          }, 1000)
        }, 5000)
      }, 500)
    }, 1000)

    setNudgeDemoStage(0)
    setShowingNudgeDemo(0)
  }
  return (
    <div className='my-2 ml-7'>
      <ul>
        <li className='list-disc'>
          <div className='flex'>
            <h3 className='text-md font-light text-primary mt-1 mb-1 mr-1'>
              We know getting people to update their info is a hassle. So we do it for you.
            </h3>
            <button onClick={() => startUpdateDemo()}>
              <h3 className='text-md font-bold text-primary mt-1 mb-1 hover:underline'>Watch how</h3>
            </button>
          </div>
          {updateDemoStage === 1 && (
            <div className='flex'>
              <div className='mr-2 py-2'>
                <Image width='30' height='30' src='/telegram.png' alt='telegram'></Image>
              </div>
              <div>
                <div className='bg-gray-200 text-sm max-w-sm p-3 rounded-xl'>...</div>
              </div>
            </div>
          )}
          {updateDemoStage >= 2 && (
            <div className='flex'>
              <div className='mr-2 py-2'>
                <Image width='30' height='30' src='/telegram.png' alt='telegram'></Image>
              </div>
              <div className='bg-gray-200 text-sm max-w-sm p-3 rounded-xl'>
                Hey, Anne! Your current {props.communityId} info is: 1) Anne Hernandez, 2) anne@gmail.com, in 3) Boston,
                4) SWE at 5) Robinhood, working on projects 6) 'Techbound', and available to offer help with 7)
                fundraising, finding co-founders, and referrals. Wanna update any field?
              </div>
            </div>
          )}
          {updateDemoStage === 3 && <div className='ml-20 mt-2 bg-blue-200 text-sm max-w-sm p-3 rounded-xl'>...</div>}
          {updateDemoStage >= 4 && (
            <div className='ml-20 mt-2 bg-blue-200 text-sm max-w-sm p-3 rounded-xl'>
              3, SF, 6, Passport (https://typedream.site/passport)
            </div>
          )}
          {updateDemoStage === 5 && (
            <div className='flex'>
              <div className='mr-2 py-2'>
                <Image width='30' height='30' src='/telegram.png' alt='telegram'></Image>
              </div>
              <div>
                <div className=' mt-2 bg-gray-200 text-sm max-w-sm p-3 rounded-xl'>...</div>
              </div>
            </div>
          )}
          {updateDemoStage >= 6 && (
            <div className='flex'>
              <div className='mr-2 py-2'>
                <Image width='30' height='30' src='/telegram.png' alt='telegram'></Image>
              </div>
              <div className=' mt-2 bg-gray-200 text-sm max-w-sm p-3 rounded-xl'>
                Done! Go check out the {props.communityId} board: <a className='underline'>https://keeploop.io/</a>
              </div>
            </div>
          )}
        </li>
        <li className='list-disc'>
          <div className='flex'>
            <h3 className='text-md font-light text-primary mt-1 mb-1 mr-1'>
              And, we know how important it is to foster spontaneous interaction among members!
            </h3>
            <button onClick={() => startNudgeDemo()}>
              <h3 className='text-md font-bold text-primary mt-1 mb-1 hover:underline'>
                Check out our community nudges.
              </h3>
            </button>
          </div>
          {nudgeDemoStage === 1 && (
            <div className='flex'>
              <div className='mr-2 py-2'>
                <Image width='30' height='30' src='/sms.png' alt='telegram'></Image>
              </div>
              <div>
                <div className='bg-gray-200 text-sm max-w-sm p-3 rounded-xl'>...</div>
              </div>
            </div>
          )}
          {nudgeDemoStage >= 2 && (
            <div className='flex'>
              <div className='mr-2 py-2'>
                <Image width='30' height='30' src='/sms.png' alt='telegram'></Image>
              </div>
              <div className='bg-gray-200 text-sm max-w-sm p-3 rounded-xl'>
                {props.communityId} weekly nugget: Anne is working on a project called Passport, check it out!
                <a className='underline'> https://typedream.site/passport.</a> And, looks like you and Will are both in
                NYC.
              </div>
            </div>
          )}
          {nudgeDemoStage === 3 && <div className='ml-20 mt-2 bg-blue-200 text-sm max-w-sm p-3 rounded-xl'>...</div>}
          {nudgeDemoStage >= 4 && (
            <div className='ml-20 mt-2 bg-blue-200 text-sm max-w-sm p-3 rounded-xl'>What's Will's number?</div>
          )}
          {nudgeDemoStage === 5 && (
            <div className='flex'>
              <div className='mr-2 py-2'>
                <Image width='30' height='30' src='/sms.png' alt='telegram'></Image>
              </div>
              <div>
                <div className=' mt-2 bg-gray-200 text-sm max-w-sm p-3 rounded-xl'>...</div>
              </div>
            </div>
          )}
          {nudgeDemoStage >= 6 && (
            <div className='flex'>
              <div className='mr-2 py-2'>
                <Image width='30' height='30' src='/sms.png' alt='telegram'></Image>
              </div>
              <div className=' mt-2 bg-gray-200 text-sm max-w-sm p-3 rounded-xl'>
                Here ya go: <a className='underline'>938-490-2299</a>
              </div>
            </div>
          )}
        </li>
      </ul>
    </div>
  )
}
