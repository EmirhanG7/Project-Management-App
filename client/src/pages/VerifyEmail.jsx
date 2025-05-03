import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { verifyEmail, resendVerification } from '@/api'

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
        setTimeout(() => navigate('/login'), 3000)
      })
      .catch(err => {
        setStatus('error')
        setMessage(err.message)
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
    <div className="max-w-md mx-auto mt-16 p-6 bg-white shadow-md rounded-lg text-center">
      {status === 'pending' && <p className="text-gray-600">Doğrulama işleniyor…</p>}

      {status === 'success' && (
        <>
          <h2 className="text-2xl font-bold text-green-600 mb-4">✅ Hesabınız onaylandı!</h2>
          <p className="text-gray-700 mb-2">{message}</p>
          <p className="text-gray-500">Giriş sayfasına yönlendiriliyorsunuz…</p>
        </>
      )}

      {status === 'error' && (
        <>
          <h2 className="text-2xl font-bold text-red-600 mb-4">❌ Doğrulama Hatası</h2>
          <p className="text-gray-700 mb-4">{message}</p>

          <button
            onClick={handleResend}
            disabled={!email}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
          >
            Yeniden Doğrulama Gönder
          </button>
          {resendStatus && (
            <p className={
              `mt-4 ${resendStatus.startsWith('Hata') ? 'text-red-600' : 'text-green-600'}`
            }>
              {resendStatus}
            </p>
          )}
        </>
      )}
    </div>
  )
}