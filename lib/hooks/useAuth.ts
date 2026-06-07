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
  const { user, setUser, setCouple, isLoading: storeIsLoading } = useStore()
  const { setIsLoading } = useStore()

  useEffect(() => {
    async function handleSession() {
      try {
        console.log('[useAuth] Session status:', status)
        
        if (status === 'loading') {
          console.log('[useAuth] Session is loading')
          setIsLoading(true)
          return
        }

        if (session?.user) {
          console.log('[useAuth] User session found, user email:', session.user.email)
          
          try {
            // Create or update user in Supabase
            const userData = await createOrUpdateUser({
              id: session.user.id || session.user.email!,
              email: session.user.email || null,
              displayName: session.user.name || null,
              photoURL: session.user.image || null,
            })
            
            console.log('[useAuth] User data created/updated in Supabase:', userData.id)
            
            // Get existing user data from Supabase to check for coupleId
            const existingUser = await getUserById(userData.id)
            if (existingUser) {
              console.log('[useAuth] Existing user found with couple_id:', existingUser.coupleId)
              setUser(existingUser)
              
              if (existingUser.coupleId) {
                const coupleData = await getCoupleById(existingUser.coupleId)
                setCouple(coupleData)
                console.log('[useAuth] Couple data loaded:', coupleData?.id)
              }
            } else {
              console.log('[useAuth] New user, setting user data from upsert')
              setUser(userData)
            }
          } catch (dbError) {
            console.error('[useAuth] Database error:', dbError)
            // Still set the user from session even if DB operations fail
            setUser({
              id: session.user.id || session.user.email!,
              email: session.user.email || null,
              displayName: session.user.name || null,
              photoURL: session.user.image || null,
              coupleId: null,
            })
          }
        } else {
          console.log('[useAuth] No user session, clearing user and couple')
          setUser(null)
          setCouple(null)
        }
      } catch (error) {
        console.error('[useAuth] Unexpected error:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    handleSession()
  }, [session, status, setUser, setCouple, setIsLoading])

  return { user, isLoading: status === 'loading' || storeIsLoading }
}
