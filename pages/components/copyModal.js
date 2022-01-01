import Image from 'next/image'
import { useState } from 'react'

export function CopyModal(props) {
  const [copied, setCopied] = useState(false)

  function copy(e) {
    setCopied(true)
    navigator.clipboard.writeText(props.onboardLink)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div onClick={copy} className='border-solid w-max flex bg-white rounded-lg text-cyan'>
      <div className='px-5 border-r-2 border-r-gray justify-center flex items-center '>
        <Image src='/link.png' width='23px' height='20px' />
      </div>
      <div className='px-3 justify-center flex items-center'>{props.onboardLink}</div>
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
  )
}
