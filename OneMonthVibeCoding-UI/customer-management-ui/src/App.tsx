
import { Routes, Route, Navigate } from 'react-router-dom';
import CustomersMain from './components/customers/customers-main';
import CustomerDetail from './components/customers/customer-detail';
import UsersMain from './components/users/users-main';
import OrdersMain from './components/orders/orders-main';
import Menu from './components/shared/Menu';
import './App.css';

function App() {
  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f7f7f7' }}>
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
      <div
        style={{
          width: '80%',
          padding: '32px',
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}
      >
        <Routes>
          <Route path="/customer" element={<CustomersMain />} />
          <Route path="/customer/:id" element={<CustomerDetail />} />
          <Route path="/users" element={<UsersMain />} />
          <Route path="/orders" element={<OrdersMain />} />
          <Route path="/" element={<Navigate to="/customer" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
