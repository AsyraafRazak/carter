import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { authApi, redeemApi } from '../api/resources';
import { useAuth } from '../state/AuthContext.jsx';
import { pdfUrl } from '../api/client';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const toast = useRef(null);
  const [username, setUsername] = useState(user?.username || '');
  const [password, setPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [history, setHistory] = useState([]);
  const [showAllHistory, setShowAllHistory] = useState(false);

  useEffect(() => {
    redeemApi.history().then(setHistory);
  }, []);

  async function saveProfile() {
    try {
      const payload = { username };
      if (password) {
        payload.password = password;
      }
      const data = await authApi.updateProfile(payload);
      setUser(data.user);
      setIsEditing(false);
      setPassword('');
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Profile updated successfully.'
      });
    } catch (err) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: err.response?.data?.message || 'Failed to update profile.'
      });
    }
  }

  const displayedHistory = showAllHistory ? history : history.slice(0, 4);

  return (
    <>
      <Toast ref={toast} />
      <section className="profile-grid">
        <div className="summary-panel">
          <p className="eyebrow">Profile</p>
          {!isEditing ? (
            <>
              <h1>{user.username}</h1>
              <p>{user.email}</p>
              <div style={{ marginBottom: '1.25rem' }}>
                <Tag value={`${user.points} points`} severity="info" />
              </div>
              <Button
                label="Edit profile"
                icon="pi pi-user-edit"
                onClick={() => {
                  setUsername(user.username || '');
                  setPassword('');
                  setIsEditing(true);
                }}
              />
            </>
          ) : (
            <div className="form-stack">
              <h3>Edit Profile</h3>
              <label className="form-stack">
                Username
                <InputText value={username} onChange={(e) => setUsername(e.target.value)} />
              </label>
              <label className="form-stack">
                New Password
                <InputText
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                />
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <Button label="Save" icon="pi pi-save" onClick={saveProfile} />
                <Button
                  label="Cancel"
                  icon="pi pi-times"
                  severity="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setUsername(user.username || '');
                    setPassword('');
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <div>
          <h2>Redemption history</h2>
          <div className="history-list">
            {displayedHistory.map((row) => (
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

          {history.length > 4 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <Button
                label={showAllHistory ? 'See Less' : 'See More'}
                icon={showAllHistory ? 'pi pi-chevron-up' : 'pi pi-chevron-down'}
                onClick={() => setShowAllHistory(!showAllHistory)}
                text
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
