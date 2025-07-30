import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { acceptInvite } from '@/api'
import { Button } from '@/components/ui/button'
import {toast} from "sonner";

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
      toast.error(`Davet Token'ı Eksik.`)
      return
    }
    acceptInvite(token)
      .then(({ boardId, message }) => {
        setStatus('success')
        setMessage(message)
        toast.success(message)
        setTimeout(() => navigate(`/boards/${boardId}`), 2000)
      })
      .catch(err => {
        setStatus('error')
        setMessage(err.message)
        toast.error(err.message)
      })
  }, [token, navigate])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card shadow-lg rounded-lg border border-border p-6 text-center space-y-4">
        {status === 'pending' && <p className="text-muted-foreground">Davet işleniyor…</p>}
        {status === 'success' && (
          <p className="text-primary">{message}<br/>Kısa süre içinde yönlendirileceksiniz.</p>
        )}
        {status === 'error' && (
          <>
            <p className="text-destructive">{message}</p>
            <Button variant="outline" onClick={() => navigate('/boards')}>
              Panolarıma Git
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
