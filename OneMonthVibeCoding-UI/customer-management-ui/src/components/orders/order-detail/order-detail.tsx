import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useOrderDetailById } from '../api/order-detail-by-id';
import { refundOrder } from '../api/refund-order';

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const queryClient = useQueryClient();
  const { data: order, isLoading, isError, error } = useOrderDetailById(orderId || '');

  const [modalOpen, setModalOpen] = useState(false);
  const [refundCost, setRefundCost] = useState<string>('');
  const [inputError, setInputError] = useState<string>('');
  const [submitError, setSubmitError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = () => {
    setRefundCost('');
    setInputError('');
    setSubmitError('');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmitRefund = async () => {
    const cost = Number(refundCost);
    if (!refundCost || isNaN(cost) || cost <= 0) {
      setInputError('Please enter a number greater than 0.');
      return;
    }

    setInputError('');
    setSubmitError('');
    setIsSubmitting(true);

    try {
      await refundOrder(Number(orderId), { refundCost: cost, updateBy: 'system' });
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit refund');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div>Loading order detail...</div>;
  if (isError) return <div>Error: {error?.message}</div>;
  if (!order) return <div>No order found.</div>;

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Link to="/orders">Go back</Link>
      </div>
      <h2>Order Detail</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
        <tbody>
          <tr><td><b>OrderId</b></td><td>{order.orderId}</td></tr>
          <tr><td><b>Client Name</b></td><td>{order.client?.clientFirstName}</td></tr>
          <tr><td><b>Total Cost</b></td><td>{order.totalCost}</td></tr>
          <tr><td><b>Create By</b></td><td>{order.createBy}</td></tr>
          <tr><td><b>Create Date</b></td><td>{order.createDate}</td></tr>
          <tr><td><b>Delivery Date</b></td><td>{order.deliveryDate}</td></tr>
          <tr><td><b>Canceled</b></td><td>{order.canceled ? 'Yes' : 'No'}</td></tr>
          <tr><td><b>Refund</b></td><td>{order.refund ? 'Yes' : 'No'}</td></tr>
          <tr><td><b>Refund Cost</b></td><td>{order.refundCost}</td></tr>
          <tr><td><b>Update By</b></td><td>{order.updateBy}</td></tr>
          <tr><td><b>Update Date</b></td><td>{order.updateDate}</td></tr>
          <tr><td><b>Is Deleted</b></td><td>{order.isDeleted ? 'Yes' : 'No'}</td></tr>
        </tbody>
      </table>

      <div style={{ marginTop: '24px' }}>
        <button
          onClick={handleOpenModal}
          style={{ padding: '8px 16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
        >
          Refund
        </button>
      </div>

      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: '32px', minWidth: 320, boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginTop: 0 }}>Submit Refund</h3>
            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="refundCost" style={{ display: 'block', marginBottom: '8px' }}>Refund Amount</label>
              <input
                id="refundCost"
                type="number"
                min={1}
                value={refundCost}
                onChange={e => setRefundCost(e.target.value)}
                placeholder="Enter amount (> 0)"
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: 4 }}
              />
              {inputError && <div style={{ color: 'red', marginTop: '6px', fontSize: '0.875rem' }}>{inputError}</div>}
            </div>
            {submitError && <div style={{ color: 'red', marginBottom: '12px', fontSize: '0.875rem' }}>{submitError}</div>}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCloseModal}
                disabled={isSubmitting}
                style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: 4, cursor: 'pointer', background: '#fff' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRefund}
                disabled={isSubmitting}
                style={{ padding: '8px 16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
