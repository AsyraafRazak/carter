import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Message } from 'primereact/message';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { pdfUrl } from '../api/client';
import { redeemApi, voucherApi } from '../api/resources';
import { useAuth } from '../state/AuthContext.jsx';
import { useCart } from '../state/CartContext.jsx';
import { voucherCategoryName, voucherStatus } from '../utils/vouchers';

export default function VoucherDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);
  const { user, refreshUser } = useAuth();
  const { addToCart } = useCart();
  const [voucher, setVoucher] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [redeemResult, setRedeemResult] = useState(null);

  useEffect(() => {
    voucherApi.get(id).then(setVoucher).catch(() => setError('Voucher not found.'));
  }, [id]);

  if (error) return <Message severity="error" text={error} />;
  if (!voucher) return <div className="empty-state">Loading voucher...</div>;
  const status = voucherStatus(voucher);
  const total = voucher.points * quantity;
  const notEnoughPoints = total > (user?.points || 0);

  async function handleAdd() {
    await addToCart(voucher._id, quantity);
    toast.current.show({ severity: 'success', summary: 'Added to cart', detail: voucher.title });
  }

  async function handleRedeem() {
    try {
      const result = await redeemApi.voucher(voucher._id, quantity);
      setRedeemResult(result);
      await refreshUser();
      toast.current.show({ severity: 'success', summary: 'Redeemed', detail: result.message });
    } catch (err) {
      toast.current.show({
        severity: 'error',
        summary: 'Redemption failed',
        detail: err.response?.data?.message || 'Please try again.'
      });
    }
  }

  return (
    <>
      <Toast ref={toast} />
      <section className="details-layout">
        <img className="details-image" src={voucher.image} alt={voucher.title} />
        <div className="details-panel">
          <p className="eyebrow">{voucherCategoryName(voucher)}</p>
          <h1>{voucher.title}</h1>
          <p>{voucher.description}</p>
          <div className="voucher-meta">
            <Tag value={`${voucher.points} pts each`} severity="info" />
            <Tag value={status.label} severity={status.severity} />
            <Tag value={`Expires ${new Date(voucher.expiryDate).toLocaleDateString()}`} severity="warning" />
          </div>
          <div className="quantity-row">
            <label>Quantity</label>
            <InputNumber value={quantity} onValueChange={(e) => setQuantity(e.value || 1)} min={1} showButtons />
          </div>
          <div className="card-actions">
            <Button label={`Redeem now (${total} pts)`} icon="pi pi-bolt" onClick={handleRedeem} disabled={!status.redeemable || notEnoughPoints} />
            <Button label="Add to cart" icon="pi pi-shopping-cart" outlined onClick={handleAdd} disabled={!status.redeemable} />
            <Button label="Back" icon="pi pi-arrow-left" text onClick={() => navigate('/')} />
          </div>
          {notEnoughPoints && (
            <Message severity="warn" text={`You need ${total} points, but only have ${user?.points || 0}.`} />
          )}
          <h3>Terms and Conditions</h3>
          <p>{voucher.terms || 'Standard Carter Bank terms apply.'}</p>
          {redeemResult && (
            <Message
              severity="success"
              text={`Redeemed. Remaining points: ${redeemResult.remainingPoints}. Download your PDF below.`}
            />
          )}
          {redeemResult?.pdfUrl && (
            <a className="download-link" href={pdfUrl(redeemResult.pdfUrl)} target="_blank" rel="noreferrer">
              <i className="pi pi-file-pdf" /> Download voucher PDF
            </a>
          )}
        </div>
      </section>
    </>
  );
}
