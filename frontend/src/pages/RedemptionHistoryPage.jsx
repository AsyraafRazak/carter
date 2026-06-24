import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { redeemApi } from '../api/resources';
import { pdfUrl } from '../api/client';

export default function RedemptionHistoryPage() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    redeemApi.history().then(setHistory);
  }, []);

  return (
    <section style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <Button
          icon="pi pi-arrow-left"
          text
          onClick={() => navigate('/profile')}
          aria-label="Back to profile"
        />
        <h1 style={{ margin: 0 }}>Redemption History</h1>
      </div>

      <div className="history-list">
        {history.map((row) => (
          <article key={row._id} className="history-item">
            <strong>{row.voucher?.title}</strong>
            <span>{row.couponCode}</span>
            <span>{new Date(row.timestamp).toLocaleString()}</span>
            {row.orderId ? (
              <a
                className="download-link"
                href={pdfUrl(`/api/redeem/orders/${row.orderId}/pdf`)}
                target="_blank"
                rel="noreferrer"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
              >
                <i className="pi pi-file-pdf" /> PDF
              </a>
            ) : (
              <span className="muted">N/A</span>
            )}
          </article>
        ))}
        {!history.length && <div className="empty-state">No redemptions yet.</div>}
      </div>
    </section>
  );
}
