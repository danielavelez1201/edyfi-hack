import firebase from 'firebase/app'
import { signInWithGoogle } from '../firebase/clientApp'
import { useRouter } from 'next/router'
import Google from '../img/Google.png'
import Image from 'next/image'

function GoogleAuth() {
  return (
    <>
      <button
        className='focus:outline-none flex items-center w-1/2 h-9 justify-center mx-auto rounded-xl border-black border border-gray-200'
        onClick={signInWithGoogle}
      >
        <Image height={24} width={24} src={Google} />
        <div className='text-center ml-3'>Sign up with Google</div>
      </button>
    </>
  )
}

export default GoogleAuth
