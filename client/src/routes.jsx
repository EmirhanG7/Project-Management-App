import Layout from "./components/Layout.jsx";
import PrivateRoute from './components/PrivateRoute.jsx';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import BoardsPage from './pages/Boards';
import BoardPage from './pages/Board';
import VerifyEmail from "./pages/VerifyEmail";
import AccountSettings from "./pages/AccountSettings";
import AcceptInvite from "./pages/AcceptInvite";
import { Navigate } from 'react-router-dom';

const routes = [
  {
    element: <Layout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/verify-email', element: <VerifyEmail /> },
      {
        path: '/',
        element: <PrivateRoute />,
        children: [
          { index: true, element: <Navigate to="boards" /> },
          { path: 'boards', element: <BoardsPage /> },
          { path: 'boards/:boardId', element: <BoardPage /> },
          { path: 'settings', element: <AccountSettings /> },
          { path: 'accept-invite', element: <AcceptInvite />}
        ],
      },
    ],
  },
];

export default routes;
