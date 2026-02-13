import React from 'react';

// Mock customer data
const customers = [
  { id: 1, name: 'Alice Johnson', email: 'alice.johnson@example.com', phone: '555-1234' },
  { id: 2, name: 'Bob Smith', email: 'bob.smith@example.com', phone: '555-5678' },
  { id: 3, name: 'Charlie Brown', email: 'charlie.brown@example.com', phone: '555-8765' },
];

const CustomersMain: React.FC = () => {
  return (
    <div>
      <h2>Customer Details</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Name</th>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Email</th>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Phone</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{customer.name}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{customer.email}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{customer.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomersMain;
