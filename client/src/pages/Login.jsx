import { useState } from 'react';
import { login } from '../api';
import { useNavigate } from 'react-router-dom';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token } = await login(form);
      localStorage.setItem('token', token);
      navigate('/boards');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Giriş Yap</h2>
      {error && <div className="text-red-500">{error}</div>}

      <Input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
      />

      <Input
        type="password"
        placeholder="Şifre"
        value={form.password}
        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
      />

      <Button type="submit" className="w-full">
        Giriş Yap
      </Button>
    </form>
    <Button variant="link" asChild className="w-full justify-center text-sm">
        <Link to="/register">Hesabın yok mu? Kayıt ol</Link>
      </Button>
    </>
    
  );
}
