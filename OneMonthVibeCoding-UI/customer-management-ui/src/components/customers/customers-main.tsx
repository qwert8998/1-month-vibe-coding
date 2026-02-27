import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { deleteCustomer, useCustomers } from './api';
import type { Customer } from './domain/Customer';

const CustomersMain: React.FC = () => {
  const { data: customers, isLoading, isError, error, refetch } = useCustomers();
  const [deleteError, setDeleteError] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const handleDelete = async (clientId: number) => {
    setDeleteError(null);
    setIsDeleting(true);
    try {
      const deleted = await deleteCustomer(clientId);
      if (deleted) {
        await refetch();
      } else {
        setDeleteError('Failed to delete customer');
      }
    } catch {
      setDeleteError('Failed to delete customer');
    } finally {
      setIsDeleting(false);
    }
  };

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
              <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ddd' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer: Customer) => (
              <tr key={customer.clientId}>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                  <Link to={`/customer/${customer.clientId}`} style={{ color: customer.isDeleted ? 'red' : undefined }}>
                    {customer.clientFirstName}
                  </Link>
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'right' }}>
                  <button
                    onClick={() => handleDelete(customer.clientId)}
                    disabled={isDeleting}
                    style={{
                      padding: '6px 12px',
                      background: '#d32f2f',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: isDeleting ? 'not-allowed' : 'pointer',
                      opacity: isDeleting ? 0.7 : 1,
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {deleteError && <div style={{ color: 'red', marginTop: '8px' }}>{deleteError}</div>}
        <div style={{ marginTop: '32px', textAlign: 'right' }}>
          <Link to="/customer/create">
            <button style={{ padding: '10px 24px', fontSize: '16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Create User
            </button>
          </Link>
        </div>
    </div>
  );
};

export default CustomersMain;
