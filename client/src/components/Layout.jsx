import { Outlet } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { logout } from '../api.js'

export default function Layout() {
    
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout()
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 ">
      <header className="flex justify-between items-center px-6 md:px-12 py-4 bg-white shadow">
          <Link to="/" className="text-xl font-bold">
            Project Management App
          </Link>
        
          <Button variant="outline" onClick={handleLogout}>
            Çıkış Yap
          </Button>
      </header>
      <main className="flex-1 p-6 md:px-12">
        <Outlet />
      </main>
    </div>
  );
}
