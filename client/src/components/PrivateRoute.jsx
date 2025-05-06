import { useState, useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getMe } from '../api'
import {useDispatch, useSelector} from "react-redux";
import {setUser} from "@/store/authSlice.js";

export default function PrivateRoute({ redirectPath = '/login' }) {
  // const [status, setStatus] = useState('pending')
  const location = useLocation()
  const dispatch = useDispatch()

  const user = useSelector((state) => state.auth.user);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    getMe()
      .then((res) => {
        dispatch(setUser(res.user));
        setCheckingAuth(false);
      })
      .catch(() => {
        setCheckingAuth(false);
      });
  }, [dispatch]);

  if (checkingAuth) {
    return <div>Loading...</div>; // Asenkron işlem tamamlanana kadar yükleme ekranı göster
  }


  if (user === null) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />
  }

  return <Outlet />
}
