import UsersMain from './components/users/users-main';

import { Routes, Route, Navigate } from 'react-router-dom';

import Menu from './components/shared/Menu';
import LoginPage from './components/auth/LoginPage';
import CustomersMain from './components/customers/customers-main';
import CreateCustomerPage from './components/customers/customer-creation/create-customer';
import CustomerDetail from './components/customers/customer-detail';
import OrdersMain from './components/orders/orders-main';
import OrderDetail from './components/orders/order-detail/order-detail';
import CreateOrderPage from './components/orders/order-creation/create-order';
import UserDetail from './components/users/user-detail';
import CreateUser from './components/users/create-user';
import { logout } from './components/auth/api';

function App() {
  const isLoggedIn = !!localStorage.getItem('authToken');
  const handleLogout = async () => {
    await logout(localStorage.getItem('authToken') || '');
    localStorage.removeItem('authToken');
    window.location.href = '/login';
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/customer" element={
            isLoggedIn ? <CustomersMain /> : <Navigate to="/login" replace />
          } />
          <Route path="/customer/create" element={
            isLoggedIn ? <CreateCustomerPage /> : <Navigate to="/login" replace />
          } />
          <Route path="/customer/:id" element={
            isLoggedIn ? <CustomerDetail /> : <Navigate to="/login" replace />
          } />
          <Route path="/users" element={
            isLoggedIn ? <UsersMain /> : <Navigate to="/login" replace />
          } />
          <Route path="/users/:userId" element={
            isLoggedIn ? <UserDetail /> : <Navigate to="/login" replace />
          } />
          <Route path="/users/create" element={
            isLoggedIn ? <CreateUser /> : <Navigate to="/login" replace />
          } />
          <Route path="/orders" element={
            isLoggedIn ? <OrdersMain /> : <Navigate to="/login" replace />
          } />
          <Route path="/orders/create" element={
            isLoggedIn ? <CreateOrderPage /> : <Navigate to="/login" replace />
          } />
          <Route path="/orders/:orderId" element={
            isLoggedIn ? <OrderDetail /> : <Navigate to="/login" replace />
          } />
          <Route path="/" element={<Navigate to="/customer" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
