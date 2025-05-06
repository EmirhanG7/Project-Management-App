import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { login, resendVerification } from '../api';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";
import {Label} from "@/components/ui/label.js";
import {Checkbox} from "@/components/ui/checkbox.js";
import {useDispatch} from "react-redux";
import {setUser} from "@/store/authSlice.js";

export default function LoginPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: state?.email || '', password: '', remember: false });
  const [error, setError] = useState('');
  const [info, setInfo] = useState(state?.info || '');
  const [loading, setLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResendMsg('');
    try {
      setLoading(true);
      const { user } = await login(form);
      dispatch(setUser(user))
      // localStorage.setItem('token', token);
      setLoading(false);
      navigate('/boards');
    } catch (err) {
      setLoading(false);
      setError(err.message);
      if (err.message.includes('doğrulayın')) {
        setInfo(err.message);
      }
    }
  };

  const handleResend = async () => {
    if (!form.email) return;
    setResendMsg('');
    try {
      await resendVerification(form.email);
      setResendMsg('Yeni onay maili gönderildi. Gelen kutunuzu kontrol edin.');
    } catch (err) {
      setResendMsg(`Hata: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Giriş Yap</h2>

      {info && (
        <div className="bg-blue-100 text-blue-800 p-3 rounded">
          {info}
        </div>
      )}

      {error && !info && (
        <div className="text-red-500">{error}</div>
      )}

      <Input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
      />
      <Input
        type="password"
        placeholder="Şifre"
        value={form.password}
        onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
      />
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={form.remember}
          onCheckedChange={(value) => setForm(f => ({ ...f, remember: value === true }))}
          id="terms" />
        <Label htmlFor="terms">Beni Hatırla</Label>
      </div>

      {loading
        ? <Button className='w-full' disabled><Loader2 className="animate-spin" /></Button>
        : <Button type="submit" className="w-full">Giriş Yap</Button>
      }

      {info && info.includes('doğrulayın') && (
        <div className="text-center mt-2 space-y-2">
          <Button
            onClick={handleResend}
            variant="outline"
            className="w-full"
          >
            Yeniden Onay Maili Gönder
          </Button>
          {resendMsg && (
            <p className={`mt-2 text-sm ${resendMsg.startsWith('Hata') ? 'text-red-600' : 'text-green-600'}`}>
              {resendMsg}
            </p>
          )}
        </div>
      )}

      <Button variant="outline" asChild className="w-full justify-center text-sm">
        <Link to="/register">Hesabın yok mu? Kayıt ol</Link>
      </Button>
    </form>
  );
}
