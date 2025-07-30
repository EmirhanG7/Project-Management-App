import { useState, useEffect } from 'react'
import { updateProfile, changePassword } from '@/api'
import { Input } from '@/components/ui/input'
import {useSelector} from "react-redux";
import SubmitButton from "@/components/SubmitButton.jsx";
import {toast} from "sonner";

export default function AccountSettings() {

  const [name, setName] = useState('')
  const [currentPwd, setCurrentPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')

  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingPassword, setLoadingPassword] = useState(false)

  const user = useSelector(state => state.auth.user)

  useEffect(() => {
    setName(user.name)
  }, []);


  const handleProfile = async e => {
    e.preventDefault()
    if (name === "") {
      toast.error("İsim Boş Olamaz.")
      return
    }
    setLoadingProfile(true)
    try {
      const { user } = await updateProfile({ name })
      toast.success(`İsim ${user.name} Olarak Güncellendi.`)
      setName(user.name)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoadingProfile(false)
    }
  }

  const handlePassword = async e => {
    e.preventDefault()
    setLoadingPassword(true)
    if (newPwd !== confirmPwd) {
      toast.error("Şifreler Eşleşmiyor.")
      setLoadingPassword(false)
      return
    }
    try {
      const { message } = await changePassword({ currentPassword: currentPwd, newPassword: newPwd })
      toast.info(message)
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoadingPassword(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-8 mt-10">
        <h2 className="text-2xl font-bold text-foreground">Hesap Ayarları</h2>

        <form className="space-y-2 bg-card p-6 rounded-lg border border-border">
          <label className="font-medium text-card-foreground">Adınız</label>
          <Input
            className="bg-background border-border text-foreground"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <SubmitButton submit={handleProfile} title='Güncelle' loading={loadingProfile} />
        </form>

        <form className="space-y-2">
          <label className="font-medium text-card-foreground">Mevcut Şifre</label>
          <Input
            className="bg-background border-border text-foreground"
            type="password"
            value={currentPwd}
            onChange={e => setCurrentPwd(e.target.value)}
          />
          <label className="font-medium text-card-foreground">Yeni Şifre</label>
          <Input
            className="bg-background border-border text-foreground"
            type="password"
            value={newPwd}
            onChange={e => setNewPwd(e.target.value)}
          />
          <label className="font-medium text-card-foreground">Yeni Şifre (tekrar)</label>
          <Input
            className="bg-background border-border text-foreground"
            type="password"
            value={confirmPwd}
            onChange={e => setConfirmPwd(e.target.value)}
          />
          <SubmitButton submit={handlePassword} title='Şifreyi Değiştir' loading={loadingPassword} />
        </form>
      </div>
    </div>
  )
}
