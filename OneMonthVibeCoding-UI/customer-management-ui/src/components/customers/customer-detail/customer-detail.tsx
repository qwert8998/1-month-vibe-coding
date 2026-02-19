import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCustomerDetail } from '../api';

const CustomerDetail: React.FC = () => {
  // For now, always use id=1 as per requirements
  const { id } = useParams<{ id: string }>();
  // const id = '1';
  const { data: customer, isLoading, isError, error } = useCustomerDetail(id || '1');

  return (
    <div>
      <h2>Customer Detail</h2>
      {isLoading && <div>Loading customer...</div>}
      {isError && <div style={{ color: 'red' }}>Error: {error?.message}</div>}
      {!isLoading && !isError && customer && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
          <tbody>
            <tr><td><b>ID</b></td><td>{customer.clientId}</td></tr>
            <tr><td><b>First Name</b></td><td>{customer.clientFirstName}</td></tr>
            <tr><td><b>Last Name</b></td><td>{customer.clientLastName}</td></tr>
            <tr><td><b>Preferred Name</b></td><td>{customer.prefferName}</td></tr>
            <tr><td><b>Date of Birth</b></td><td>{customer.dateofBirth}</td></tr>
            <tr><td><b>Created By</b></td><td>{customer.createBy}</td></tr>
            <tr><td><b>Create Date</b></td><td>{customer.createDate}</td></tr>
            <tr><td><b>Updated By</b></td><td>{customer.updateBy}</td></tr>
            <tr><td><b>Update Date</b></td><td>{customer.updateDate}</td></tr>
          </tbody>
        </table>
      )}
      <div style={{ marginTop: '16px' }}>
        <Link to="/customer">Back to Customer List</Link>
      </div>
    </div>
  );
};

export default CustomerDetail;
