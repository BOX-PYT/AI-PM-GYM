import { useState, useEffect } from 'react'
import { getOrCreateUser } from '../lib/userId'

export function useUser() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getOrCreateUser()
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { user, loading, error, setUser }
}
