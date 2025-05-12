import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { acceptInvite } from '@/api'
import { Button } from '@/components/ui/button'

export default function AcceptInvite() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const token = params.get('token')

  const [status, setStatus] = useState('pending')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Davet tokenı eksik.')
      return
    }
    acceptInvite(token)
      .then(({ boardId, message }) => {
        setStatus('success')
        setMessage(message)
        setTimeout(() => navigate(`/boards/${boardId}`), 2000)
      })
      .catch(err => {
        setStatus('error')
        setMessage(err.message)
      })
  }, [token, navigate])

  return (
    <div className="max-w-md mx-auto mt-24 text-center space-y-4">
      {status === 'pending' && <p>Davet işleniyor…</p>}
      {status === 'success' && (
        <p className="text-green-600">{message}<br/>Kısa süre içinde yönlendirileceksiniz.</p>
      )}
      {status === 'error' && (
        <>
          <p className="text-red-500">{message}</p>
          <Button variant="outline" onClick={() => navigate('/boards')}>
            Panolarıma Git
          </Button>
        </>
      )}
    </div>
  )
}
