import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { pdfUrl } from '../api/client';
import { redeemApi } from '../api/resources';
import { useAuth } from '../state/AuthContext.jsx';
import { useCart } from '../state/CartContext.jsx';
import { voucherStatus } from '../utils/vouchers';

export default function CartPage() {
  const toast = useRef(null);
  const { user, refreshUser } = useAuth();
  const { cart, loadCart, updateQuantity, removeItem, loading } = useCart();
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadCart();
  }, []);

  const notEnoughPoints = cart.totalPoints > (user?.points || 0);

  async function checkout() {
    setResult(null);
    try {
      const data = await redeemApi.cart();
      setResult(data);
      await loadCart();
      await refreshUser();
      toast.current.show({ severity: 'success', summary: 'Checkout complete', detail: data.message });
    } catch (err) {
      toast.current.show({
        severity: 'error',
        summary: 'Checkout failed',
        detail: err.response?.data?.message || 'Please try again.'
      });
    }
  }

  return (
    <>
      <Toast ref={toast} />
      <section className="page-header">
        <p className="eyebrow">Cart</p>
        <h1>Review and redeem</h1>
      </section>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map((item) => (
            <article className="cart-item" key={item._id}>
              <img src={item.voucher.image} alt={item.voucher.title} />
              <div>
                <h3>{item.voucher.title}</h3>
                <p>{item.voucher.points} points each</p>
                <small>{voucherStatus(item.voucher).label}</small>
              </div>
              <InputNumber value={item.quantity} onValueChange={(e) => updateQuantity(item._id, e.value || 1)} min={1} showButtons />
              <strong>{item.voucher.points * item.quantity} pts</strong>
              <Button icon="pi pi-trash" severity="danger" text rounded aria-label="Remove" onClick={() => removeItem(item._id)} />
            </article>
          ))}
          {!cart.items.length && <div className="empty-state">Your cart is empty.</div>}
        </div>

        <aside className="summary-panel">
          <h2>Total</h2>
          <p className="total-points">{cart.totalPoints} pts</p>
          <p className="muted">Your balance: {user?.points || 0} pts</p>
          <Button label="Checkout and redeem" icon="pi pi-check" onClick={checkout} disabled={!cart.items.length || notEnoughPoints} loading={loading} />
          {notEnoughPoints && (
            <Message severity="warn" text="Not enough points for this cart. Reduce quantity or remove an item." />
          )}
          {result && (
            <Message severity="success" text={`Success. Remaining points: ${result.remainingPoints}`} />
          )}
          {result?.pdfUrl && (
            <a className="download-link" href={pdfUrl(result.pdfUrl)} target="_blank" rel="noreferrer">
              <i className="pi pi-file-pdf" /> Download voucher PDF
            </a>
          )}
        </aside>
      </div>
    </>
  );
}
