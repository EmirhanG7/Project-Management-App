import { useState } from 'react';
import { register } from '../api';
import { useNavigate } from 'react-router-dom';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Link } from 'react-router-dom';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token } = await register(form);
      localStorage.setItem('token', token);
      navigate('/boards');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Kayıt Ol</h2>
      {error && <div className="text-red-500">{error}</div>}

      <Input
        type="text"
        placeholder="İsim"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
      />

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
        Kayıt Ol
      </Button>
      
      <Button variant="outline" asChild className="w-full justify-center text-sm">
        <Link to="/login">Zaten bir hesabın var mı? Giriş Yap</Link>
      </Button>
    </form>
  );
}
