import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomers } from '../../customers/api/customer-list';
import { createOrder } from '../api/create-order';
import type { Customer } from '../../customers/domain/Customer';

const getDefaultDeliveryDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm for datetime-local
};

const CreateOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: customers, isLoading: customersLoading } = useCustomers();

  const [clientId, setClientId] = useState<string>('');
  const [totalCost, setTotalCost] = useState<string>('');
  const [deliveryDate, setDeliveryDate] = useState<string>(getDefaultDeliveryDate());
  const [canceled, setCanceled] = useState<boolean>(false);
  const [refund, setRefund] = useState<boolean>(false);
  const [refundCost, setRefundCost] = useState<string>('0');
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!clientId) newErrors.clientId = 'Please select a client.';
    const cost = Number(totalCost);
    if (!totalCost || isNaN(cost) || cost <= 0) newErrors.totalCost = 'Total cost must be greater than 0.';
    if (!deliveryDate) newErrors.deliveryDate = 'Delivery date is required.';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitError('');
    setIsSubmitting(true);
    try {
      await createOrder({
        clientId: Number(clientId),
        totalCost: Number(totalCost),
        createBy: 'system',
        createDate: new Date().toISOString(),
        deliveryDate: new Date(deliveryDate).toISOString(),
        canceled,
        refund,
        refundCost: Number(refundCost),
        updateBy: null,
        updateDate: null,
        isDeleted,
      });
      navigate('/orders');
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 24 }}>
      <h2>Create Order</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Client *</label>
          {customersLoading ? (
            <div>Loading clients...</div>
          ) : (
            <select
              value={clientId}
              onChange={e => setClientId(e.target.value)}
              style={{ display: 'block', width: '100%', padding: '8px', marginTop: 4 }}
            >
              <option value="">-- Select a client --</option>
              {(customers ?? []).map((c: Customer) => (
                <option key={c.clientId} value={c.clientId}>
                  {c.clientFirstName} {c.clientLastName}
                </option>
              ))}
            </select>
          )}
          {errors.clientId && <div style={{ color: 'red', fontSize: '0.875rem' }}>{errors.clientId}</div>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Total Cost *</label>
          <input
            type="number"
            min={1}
            value={totalCost}
            onChange={e => setTotalCost(e.target.value)}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: 4 }}
          />
          {errors.totalCost && <div style={{ color: 'red', fontSize: '0.875rem' }}>{errors.totalCost}</div>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Delivery Date *</label>
          <input
            type="datetime-local"
            value={deliveryDate}
            onChange={e => setDeliveryDate(e.target.value)}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: 4 }}
          />
          {errors.deliveryDate && <div style={{ color: 'red', fontSize: '0.875rem' }}>{errors.deliveryDate}</div>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            <input type="checkbox" checked={canceled} onChange={e => setCanceled(e.target.checked)} />
            {' '}Canceled
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            <input type="checkbox" checked={refund} onChange={e => setRefund(e.target.checked)} />
            {' '}Refund
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Refund Cost</label>
          <input
            type="number"
            min={0}
            value={refundCost}
            onChange={e => setRefundCost(e.target.value)}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: 4 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            <input type="checkbox" checked={isDeleted} onChange={e => setIsDeleted(e.target.checked)} />
            {' '}Is Deleted
          </label>
        </div>

        {submitError && <div style={{ color: 'red', marginBottom: 12, fontSize: '0.875rem' }}>{submitError}</div>}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{ marginTop: 16, padding: '10px 24px', fontSize: '16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {isSubmitting ? 'Creating...' : 'Create'}
        </button>
      </form>
    </div>
  );
};

export default CreateOrderPage;
