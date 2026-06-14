import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';
import { API_BASE } from '../api/client';
import { authApi } from '../api/resources';
import { useAuth } from '../state/AuthContext.jsx';

export default function LoginPage() {
  const { user, login, signup } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(false);

  useEffect(() => {
    authApi.config()
      .then((data) => setGoogleEnabled(data.googleOAuthEnabled))
      .catch(() => setGoogleEnabled(false));
  }, []);

  if (user) return <Navigate to="/" replace />;

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password });
      } else {
        await signup(form);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="login-screen">
      <section className="login-hero">
        <p className="eyebrow">Carter Bank Loyalty</p>
        <h1>Redeem points for rewards that keep customers coming back.</h1>
        <p>Browse vouchers, spend points, and download a coupon PDF with unique codes and QR verification.</p>
      </section>

      <Card className="login-card">
        <div className="segmented">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Login</button>
          <button className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>Sign up</button>
        </div>

        <form onSubmit={submit} className="form-stack">
          {error && <Message severity="error" text={error} />}
          <label>
            Email
            <InputText value={form.email} onChange={(e) => update('email', e.target.value)} required />
          </label>
          {mode === 'signup' && (
            <label>
              Username
              <InputText value={form.username} onChange={(e) => update('username', e.target.value)} required />
            </label>
          )}
          <label>
            Password
            <Password value={form.password} onChange={(e) => update('password', e.target.value)} feedback={mode === 'signup'} toggleMask required />
          </label>
          <Button type="submit" label={mode === 'login' ? 'Login' : 'Create account'} icon="pi pi-lock" loading={busy} />
          {googleEnabled ? (
            <a className="google-button" href={`${API_BASE}/auth/google`}>
              <i className="pi pi-google" /> Continue with Google
            </a>
          ) : (
            <Message severity="info" text="Google login is ready in code. Add Google credentials in backend .env to enable it." />
          )}
          <p className="demo-note">Demo accounts after seeding: user@carter.test / admin@carter.test, password: password123</p>
        </form>
      </Card>
    </main>
  );
}
