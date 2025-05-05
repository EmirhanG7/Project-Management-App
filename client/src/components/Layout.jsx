import {Outlet, useNavigate} from 'react-router-dom';
import Header from "@/components/Header.jsx";
import {useEffect, useState} from "react";
import {getMe, logout} from "@/api.js";

export default function Layout() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const {user} = await getMe();
      setUser(user);
    }
    getUser();
  }, [])



  const handleLogout = async () => {
    await logout()
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 ">
      <Header user={user} onLogout={handleLogout} />
      <main className="flex-1 p-6 md:px-12">
        <Outlet />
      </main>
    </div>
  );
}
