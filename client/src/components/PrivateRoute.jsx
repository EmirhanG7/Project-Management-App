import { useState, useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getMe } from '../api'

export default function PrivateRoute({ redirectPath = '/login' }) {
  const [status, setStatus] = useState('pending')
  const location = useLocation()

  useEffect(() => {
    getMe()
      .then(() => setStatus('authenticated'))
      .catch(() => setStatus('unauthenticated'))
  }, [])


  if (status === 'unauthenticated') {
    return <Navigate to={redirectPath} state={{ from: location }} replace />
  }

  return <Outlet />
}
