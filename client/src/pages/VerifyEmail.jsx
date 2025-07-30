import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { verifyEmail, resendVerification } from '@/api'
import {toast} from "sonner";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const [status, setStatus] = useState('pending')
  const [message, setMessage] = useState('')
  const [resendStatus, setResendStatus] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Doğrulama tokenı bulunamadı.')
      return
    }
    verifyEmail(token)
      .then(data => {
        setStatus('success')
        setMessage(data.message)
        toast.success(data.message)
        setTimeout(() => navigate('/login'), 3000)
      })
      .catch(err => {
        setStatus('error')
        setMessage(err.message)
        toast.error(err.message)
      })
  }, [token, navigate])

  const handleResend = () => {
    if (!email) {
      setResendStatus('E-posta bilgisi eksik.')
      return
    }
    resendVerification(email)
      .then(() => setResendStatus('Yeni doğrulama maili gönderildi.'))
      .catch(err => setResendStatus(`Hata: ${err.message}`))
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card shadow-lg rounded-lg border border-border p-6 text-center">
        {status === 'pending' && <p className="text-muted-foreground">Doğrulama işleniyor…</p>}

        {status === 'success' && (
          <>
            <h2 className="text-2xl font-bold text-primary mb-4">✅ Hesabınız onaylandı!</h2>
            <p className="text-card-foreground mb-2">{message}</p>
            <p className="text-muted-foreground">Giriş sayfasına yönlendiriliyorsunuz…</p>
          </>
        )}

        {status === 'error' && (
          <>
            <h2 className="text-2xl font-bold text-red-600 mb-4">❌ Doğrulama Hatası</h2>
            <p className="text-card-foreground mb-4">{message}</p>

            <button
              onClick={handleResend}
              disabled={!email}
              className="w-full text-card-foreground"
            >
              Yeniden Doğrulama Gönder
            </button>
            {resendStatus && (
              <p className={
                `mt-4 ${resendStatus.startsWith('Hata') ? 'text-red-600' : 'text-primary'}`
              }>
                {resendStatus}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}