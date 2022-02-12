import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { removeUserCookie, setUserCookie, getUserFromCookie } from './userCookies'
import { mapUserData } from './mapUserData'

import { getAuth } from 'firebase/auth'
import { firebaseApp } from './clientApp'

const useUser = () => {
  const [user, setUser] = useState()
  const router = useRouter()

  firebaseApp.name

  const logout = async () => {
    return getAuth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        router.push('/')
      })
      .catch((e) => {
        console.error(e)
      })
  }

  useEffect(() => {
    // Firebase updates the id token every hour, this
    // makes sure the react state and the cookie are
    // both kept up to date
    const cancelAuthListener = getAuth(firebaseApp).onIdTokenChanged((user) => {
      if (user) {
        const userData = mapUserData(user)
        setUserCookie(userData)
        setUser(userData)
      } else {
        removeUserCookie()
        setUser()
      }
    })

    const userFromCookie = getUserFromCookie()
    if (!userFromCookie) {
      //   router.push('/')
      return
    }
    setUser(userFromCookie)

    return () => {
      cancelAuthListener()
    }
  }, [])

  return { user, logout }
}

export { useUser }
