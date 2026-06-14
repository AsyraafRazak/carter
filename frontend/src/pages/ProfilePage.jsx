import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { authApi, redeemApi } from '../api/resources';
import { useAuth } from '../state/AuthContext.jsx';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    redeemApi.history().then(setHistory);
  }, []);

  async function saveProfile() {
    const data = await authApi.updateProfile({ username });
    setUser(data.user);
  }

  return (
    <section className="profile-grid">
      <div className="summary-panel">
        <p className="eyebrow">Profile</p>
        <h1>{user.username}</h1>
        <p>{user.email}</p>
        <Tag value={`${user.points} points`} severity="info" />
        <label className="form-stack mt-4">
          Edit username
          <InputText value={username} onChange={(e) => setUsername(e.target.value)} />
          <Button label="Save profile" icon="pi pi-save" onClick={saveProfile} />
        </label>
      </div>
      <div>
        <h2>Redemption history</h2>
        <div className="history-list">
          {history.map((row) => (
            <article key={row._id} className="history-item">
              <strong>{row.voucher?.title}</strong>
              <span>{row.couponCode}</span>
              <span>{new Date(row.timestamp).toLocaleString()}</span>
            </article>
          ))}
          {!history.length && <div className="empty-state">No redemptions yet.</div>}
        </div>
      </div>
    </section>
  );
}
