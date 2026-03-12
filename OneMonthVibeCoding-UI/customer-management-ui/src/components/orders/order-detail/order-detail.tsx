import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useOrderDetailById } from '../api/order-detail-by-id';
import { refundOrder } from '../api/refund-order';
import {
  buildOrderDetailTableRows,
  INITIAL_REFUND_MODAL_STATE,
  type RefundModalState,
} from './order-detail.state';
import { parseStrictPositiveInteger } from '../../shared/sql-input-validation';
import { ROUTES } from '../../../config/routes';

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const queryClient = useQueryClient();
  const { data: order, isLoading, isError, error } = useOrderDetailById(orderId || '');

  const [refundModalState, setRefundModalState] = useState<RefundModalState>(INITIAL_REFUND_MODAL_STATE);
  const parsedOrderId = (() => {
    try {
      return parseStrictPositiveInteger(orderId ?? '', 'Order ID');
    } catch {
      return null;
    }
  })();

  const { modalOpen, refundCost, inputError, submitError, isSubmitting } = refundModalState;

  const updateRefundModalState = (updates: Partial<RefundModalState>) => {
    setRefundModalState(previousState => ({
      ...previousState,
      ...updates,
    }));
  };

  const handleOpenModal = () => {
    setRefundModalState({
      ...INITIAL_REFUND_MODAL_STATE,
      modalOpen: true,
    });
  };

  const handleCloseModal = () => {
    setRefundModalState(INITIAL_REFUND_MODAL_STATE);
  };

  const handleSubmitRefund = async () => {
    if (!parsedOrderId) {
      updateRefundModalState({ inputError: 'Invalid order id.' });
      return;
    }

    const cost = Number(refundCost);
    if (!refundCost || isNaN(cost) || cost <= 0) {
      updateRefundModalState({ inputError: 'Please enter a number greater than 0.' });
      return;
    }

    updateRefundModalState({ inputError: '', submitError: '', isSubmitting: true });

    try {
      await refundOrder(parsedOrderId, { refundCost: cost, updateBy: 'system' });
      setRefundModalState(INITIAL_REFUND_MODAL_STATE);
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
    } catch (err: unknown) {
      updateRefundModalState({ submitError: err instanceof Error ? err.message : 'Failed to submit refund' });
    } finally {
      updateRefundModalState({ isSubmitting: false });
    }
  };

  if (isLoading) return <div>Loading order detail...</div>;
  if (isError) return <div>Error: {error?.message}</div>;
  if (!order) return <div>No order found.</div>;

  const tableRows = buildOrderDetailTableRows(order);

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Link to={ROUTES.ORDER_LIST}>Go back</Link>
      </div>
      <h2>Order Detail</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
        <tbody>
          {tableRows.map(row => (
            <tr key={row.label}>
              <td><b>{row.label}</b></td>
              <td>{row.value}</td>
            </tr>
          ))}
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
                onChange={e => updateRefundModalState({ refundCost: e.target.value })}
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
