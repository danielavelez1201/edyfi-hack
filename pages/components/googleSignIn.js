import Image from 'next/image'
import { signInWithGoogle } from '../../firebase/clientApp'
import { useUser } from '../../firebase/useUser'
import Google from '../../img/Google.png'

export function GoogleSignIn() {
  const { user } = useUser()

  const googleTextStyle = user ? 'text-center ml-5 text-cyan' : 'text-center ml-5'

  return (
    <div>
      <button
        className='focus:outline-none flex items-center h-9 justify-left rounded-xl p-5 border-black border border-cyan'
        onClick={signInWithGoogle}
      >
        <Image alt="don't be evil" height={24} width={24} src={Google} />
        {user && <div className={googleTextStyle}>Google account connected!</div>}
        {!user && <div className={googleTextStyle}>Connect your Google account</div>}
      </button>
      <br></br>
      {user && (
        <button className='bg-blue py-2 px-4 text-sm text-white rounded  focus:outline-none focus:border-green-dark hover:bg-blue-hover '>
          Log in
        </button>
      )}
    </div>
  )
}
