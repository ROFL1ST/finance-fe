import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import AccountListPage from '../pages/accounts/AccountListPage';
import AccountFormPage from '../pages/accounts/AccountFormPage';
import TransactionListPage from '../pages/transactions/TransactionListPage';
import TransactionFormPage from '../pages/transactions/TransactionFormPage';
import SummaryPage from '../pages/summary/SummaryPage';
import AppLayout from '../components/layout/AppLayout';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <SummaryPage /> },
          { path: '/accounts', element: <AccountListPage /> },
          { path: '/accounts/create', element: <AccountFormPage /> },
          { path: '/accounts/:id/edit', element: <AccountFormPage /> },
          { path: '/transactions', element: <TransactionListPage /> },
          { path: '/transactions/create', element: <TransactionFormPage /> },
        ],
      },
    ],
  },
]);
