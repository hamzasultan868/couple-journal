'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { getUserById, createOrUpdateUser } from '../supabase/auth'
import { getCoupleById } from '../supabase/couples'
import { useStore } from '../store'

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { user, setUser, setCouple, setIsLoading } = useStore()

  useEffect(() => {
    async function handleSession() {
      if (status === 'loading') {
        setIsLoading(true)
        return
      }

      if (session?.user) {
        // Create or update user in Supabase
        const userData = await createOrUpdateUser({
          id: session.user.id || session.user.email!, // Use email as fallback ID
          email: session.user.email || null,
          displayName: session.user.name || null,
          photoURL: session.user.image || null,
        })
        
        // Get existing user data from Supabase to check for coupleId
        const existingUser = await getUserById(userData.id)
        if (existingUser) {
          setUser(existingUser)
          
          if (existingUser.coupleId) {
            const coupleData = await getCoupleById(existingUser.coupleId)
            setCouple(coupleData)
          }
        } else {
          setUser(userData)
        }
      } else {
        setUser(null)
        setCouple(null)
      }
      setIsLoading(false)
    }

    handleSession()
  }, [session, status, setUser, setCouple, setIsLoading])

  return { user, isLoading: status === 'loading' || useStore.getState().isLoading }
}
