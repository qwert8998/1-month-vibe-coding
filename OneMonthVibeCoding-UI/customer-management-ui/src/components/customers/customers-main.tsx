import React from 'react';
import { Link } from 'react-router-dom';
import { useCustomers } from './api';
import type { Customer } from './api/customer-list';

const CustomersMain: React.FC = () => {
  const { data: customers, isLoading, isError, error } = useCustomers();

  return (
    <div>
      <h2>Customer Details</h2>
      {isLoading && <div>Loading customers...</div>}
      {isError && <div style={{ color: 'red' }}>Error: {error?.message}</div>}
      {!isLoading && !isError && customers && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Preferred Name</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer: Customer) => (
              <tr key={customer.id}>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                  <Link to={`/customer/${customer.id}`}>{customer.name}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomersMain;
