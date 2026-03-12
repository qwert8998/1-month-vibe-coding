import UsersMain from './components/users/users-main';
import type { ReactElement } from 'react';

import { Routes, Route, Navigate } from 'react-router-dom';

import Menu from './components/shared/Menu';
import LoginPage from './components/auth/LoginPage';
import CustomersMain from './components/customers/customers-main';
import CreateCustomerPage from './components/customers/customer-creation/create-customer';
import CustomerDetail from './components/customers/customer-detail';
import OrdersMain from './components/orders/orders-main';
import OrderDetail from './components/orders/order-detail/order-detail';
import CreateOrderPage from './components/orders/order-creation/create-order';
import UserDetail from './components/users/user-detail/user-detail';
import CreateUser from './components/users/user-creation/create-user';
import { logout } from './components/auth/api';
import { ROUTES } from './config/routes';

type GuardProps = {
  isLoggedIn: boolean;
  children: ReactElement;
};

function RequireAuth({ isLoggedIn, children }: GuardProps) {
  return isLoggedIn ? children : <Navigate to={ROUTES.LOGIN} replace />;
}

function PublicOnly({ isLoggedIn, children }: GuardProps) {
  return isLoggedIn ? <Navigate to={ROUTES.CUSTOMER_LIST} replace /> : children;
}

function App() {
  const isLoggedIn = !!localStorage.getItem('authToken');
  const handleLogout = async () => {
    await logout(localStorage.getItem('authToken') || '');
    localStorage.removeItem('authToken');
    window.location.href = ROUTES.LOGIN;
  };
  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f7f7f7', position: 'relative' }}>
      {isLoggedIn && (
        <div style={{ position: 'absolute', top: 16, right: 32, zIndex: 10 }}>
          <button onClick={handleLogout} style={{ padding: '8px 16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Logout</button>
        </div>
      )}
      {isLoggedIn && (
        <div
          style={{
            width: '20%',
            minWidth: 200,
            maxWidth: 350,
            background: '#fff',
            borderRight: '1px solid #e0e0e0',
            padding: '24px 16px',
            boxSizing: 'border-box',
          }}
        >
          <Menu />
        </div>
      )}
      <div
        style={{
          width: isLoggedIn ? '80%' : '100%',
          padding: '32px',
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}
      >
        <Routes>
          <Route
            path={ROUTES.LOGIN}
            element={
              <PublicOnly isLoggedIn={isLoggedIn}>
                <LoginPage />
              </PublicOnly>
            }
          />
          <Route path={ROUTES.CUSTOMER_LIST} element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <CustomersMain />
            </RequireAuth>
          } />
          <Route path={ROUTES.CUSTOMER_CREATE} element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <CreateCustomerPage />
            </RequireAuth>
          } />
          <Route path={ROUTES.CUSTOMER_DETAIL_PATTERN} element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <CustomerDetail />
            </RequireAuth>
          } />
          <Route path={ROUTES.USER_LIST} element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <UsersMain />
            </RequireAuth>
          } />
          <Route path={ROUTES.USER_DETAIL_PATTERN} element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <UserDetail />
            </RequireAuth>
          } />
          <Route path={ROUTES.USER_CREATE} element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <CreateUser />
            </RequireAuth>
          } />
          <Route path={ROUTES.ORDER_LIST} element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <OrdersMain />
            </RequireAuth>
          } />
          <Route path={ROUTES.ORDER_CREATE} element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <CreateOrderPage />
            </RequireAuth>
          } />
          <Route path={ROUTES.ORDER_DETAIL_PATTERN} element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <OrderDetail />
            </RequireAuth>
          } />
          <Route path="/" element={<Navigate to={isLoggedIn ? ROUTES.CUSTOMER_LIST : ROUTES.LOGIN} replace />} />
          <Route path="*" element={<Navigate to={isLoggedIn ? ROUTES.CUSTOMER_LIST : ROUTES.LOGIN} replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
