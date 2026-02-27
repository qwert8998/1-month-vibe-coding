import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrderList } from './api/order-list';
import type { Order } from './domain/Order';

const OrdersMain: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useOrderList();

  if (isLoading) return <div>Loading orders...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  const orders: Order[] = Array.isArray(data) ? data : [];

  return (
    <div>
      <h2>Orders</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>OrderId</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Client Name</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Total Cost</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Canceled</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Refund</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Refund Cost</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                <Link to={`/orders/${order.orderId}`}>{order.orderId}</Link>
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {`${order.client?.clientFirstName || ''} ${order.client?.clientLastName || ''}`.trim() || '-'}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{order.totalCost}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{order.canceled ? 'Yes' : 'No'}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{order.refund ? 'Yes' : 'No'}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{order.refundCost}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && <div style={{ marginTop: '16px' }}>No orders found.</div>}
      <div style={{ marginTop: '24px', textAlign: 'right' }}>
        <button
          onClick={() => navigate('/orders/create')}
          style={{ padding: '8px 16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
        >
          Create Order
        </button>
      </div>
    </div>
  );
};

export default OrdersMain;
