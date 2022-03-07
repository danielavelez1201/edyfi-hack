import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import { useState, useEffect } from 'react'

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0])
  useEffect(() => {
    const updateSize = () => {
      setSize([window.innerWidth, window.innerHeight])
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [])
  return size
}

function MyApp({ Component, pageProps }) {
  const [width, height] = useWindowSize()

  return width > 850 ? (
    <Component {...pageProps} />
  ) : (
    <div className='w-full h-screen font-bold flex justify-center items-center'>
      We are not mobile responsive yet {':('}
    </div>
  )
}

export default MyApp
