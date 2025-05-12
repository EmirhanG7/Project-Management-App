import { useState, useEffect } from 'react'
import { updateProfile, changePassword } from '@/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import {useSelector} from "react-redux";
import SubmitButton from "@/components/SubmitButton.jsx";

export default function AccountSettings() {

  const [name, setName] = useState('')
  const [currentPwd, setCurrentPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')

  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingPassword, setLoadingPassword] = useState(false)

  const [msgProfile, setMsgProfile] = useState('')
  const [errProfile, setErrProfile] = useState('')
  const [msgPwd, setMsgPwd] = useState('')
  const [errPwd, setErrPwd] = useState('')

  const user = useSelector(state => state.auth.user)

  useEffect(() => {
    setName(user.name)
  }, []);


  const handleProfile = async e => {
    e.preventDefault()
    setErrProfile(''); setMsgProfile('')
    setLoadingProfile(true)
    try {
      const { user } = await updateProfile({ name })
      setMsgProfile('İsim güncellendi.')
      setName(user.name)
    } catch (err) {
      setErrProfile(err.message)
    } finally {
      setLoadingProfile(false)
    }
  }

  const handlePassword = async e => {
    e.preventDefault()
    setErrPwd(''); setMsgPwd('')
    setLoadingPassword(true)
    if (newPwd !== confirmPwd) {
      setErrPwd('Şifreler eşleşmiyor.')
      setLoadingPassword(false)
      return
    }
    try {
      const { message } = await changePassword({ currentPassword: currentPwd, newPassword: newPwd })
      setMsgPwd(message)
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
    } catch (err) {
      setErrPwd(err.message)
    } finally {
      setLoadingPassword(false)
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-8 mt-10">
      <h2 className="text-2xl font-bold">Hesap Ayarları</h2>

      {/* 1) İsim Güncelle */}
      <form className="space-y-2">
        <label className="font-medium">Adınız</label>
        <Input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        {errProfile && <p className="text-red-600">{errProfile}</p>}
        {msgProfile && <p className="text-green-600">{msgProfile}</p>}
        <SubmitButton submit={handleProfile} title='Güncelle' loading={loadingProfile} />
      </form>

      {/* 2) Şifre Değiştir */}
      <form className="space-y-2">
        <label className="font-medium">Mevcut Şifre</label>
        <Input
          type="password"
          value={currentPwd}
          onChange={e => setCurrentPwd(e.target.value)}
        />
        <label className="font-medium">Yeni Şifre</label>
        <Input
          type="password"
          value={newPwd}
          onChange={e => setNewPwd(e.target.value)}
        />
        <label className="font-medium">Yeni Şifre (tekrar)</label>
        <Input
          type="password"
          value={confirmPwd}
          onChange={e => setConfirmPwd(e.target.value)}
        />
        {errPwd && <p className="text-red-600">{errPwd}</p>}
        {msgPwd && <p className="text-green-600">{msgPwd}</p>}
        <SubmitButton submit={handlePassword} title='Şifreyi Değiştir' loading={loadingPassword} />
      </form>
    </div>
  )
}
