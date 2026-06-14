import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { voucherCategoryName, voucherStatus } from '../utils/vouchers';

export default function VoucherCard({ voucher, onAdd }) {
  const status = voucherStatus(voucher);
  const footer = (
    <div className="card-actions">
      <Link to={`/vouchers/${voucher._id}`}>
        <Button label="View" icon="pi pi-eye" outlined />
      </Link>
      <Button label="Add" icon="pi pi-shopping-cart" onClick={() => onAdd(voucher)} disabled={!status.redeemable} />
    </div>
  );

  const header = (
    <img
      className="voucher-image"
      src={voucher.image}
      alt={voucher.title}
      loading="lazy"
    />
  );

  return (
    <Card className="voucher-card" title={voucher.title} subTitle={voucherCategoryName(voucher)} footer={footer} header={header}>
      <p>{voucher.description}</p>
      <div className="voucher-meta">
        <Tag value={`${voucher.points} pts`} severity="info" />
        <Tag value={status.label} severity={status.severity} />
      </div>
    </Card>
  );
}
