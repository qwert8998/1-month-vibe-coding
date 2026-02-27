import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCustomer } from '../api/create-customer'; // To be created
import type { Customer } from '../domain/Customer';

const initialCustomer: Partial<Customer> = {
  clientFirstName: '',
  clientLastName: '',
  prefferName: '',
  dateofBirth: '',
  isDeleted: false,
};

const CreateCustomerPage: React.FC = () => {
  const [customer, setCustomer] = useState(initialCustomer);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!customer.clientFirstName) newErrors.clientFirstName = 'First name is required';
    if (!customer.clientLastName) newErrors.clientLastName = 'Last name is required';
    if (!customer.dateofBirth) newErrors.dateofBirth = 'Date of birth is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const now = new Date().toISOString();
    const newCustomer: Customer = {
      clientId: 0, // Will be ignored by backend
      clientFirstName: customer.clientFirstName || '',
      clientLastName: customer.clientLastName || '',
      prefferName: customer.prefferName || '',
      dateofBirth: customer.dateofBirth || '',
      createBy: 'system',
      createDate: now,
      updateBy: 'system',
      updateDate: now,
      isDeleted: customer.isDeleted ?? false,
    };
    try {
      await createCustomer(newCustomer);
      navigate('/customer');
    } catch (err) {
      setErrors({ submit: 'Failed to create customer' });
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 24 }}>
      <h2>Create Customer</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name *</label>
          <input name="clientFirstName" value={customer.clientFirstName || ''} onChange={handleChange} />
          {errors.clientFirstName && <div style={{ color: 'red' }}>{errors.clientFirstName}</div>}
        </div>
        <div>
          <label>Last Name *</label>
          <input name="clientLastName" value={customer.clientLastName || ''} onChange={handleChange} />
          {errors.clientLastName && <div style={{ color: 'red' }}>{errors.clientLastName}</div>}
        </div>
        <div>
          <label>Preferred Name</label>
          <input name="prefferName" value={customer.prefferName || ''} onChange={handleChange} />
        </div>
        <div>
          <label>Date of Birth *</label>
          <input name="dateofBirth" type="date" value={customer.dateofBirth || ''} onChange={handleChange} />
          {errors.dateofBirth && <div style={{ color: 'red' }}>{errors.dateofBirth}</div>}
        </div>
        <div>
          <label>
            <input
              name="isDeleted"
              type="checkbox"
              checked={customer.isDeleted ?? false}
              onChange={handleChange}
            />
            Is Deleted
          </label>
        </div>
        {errors.submit && <div style={{ color: 'red' }}>{errors.submit}</div>}
        <button type="submit" style={{ marginTop: 16, padding: '10px 24px', fontSize: '16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Create</button>
      </form>
    </div>
  );
};

export default CreateCustomerPage;
