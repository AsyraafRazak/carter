import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useAuth } from '../state/AuthContext.jsx';

export default function OAuthSuccessPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const token = params.get('token');
    if (!token) {
      navigate('/login?error=google', { replace: true });
      return;
    }

    localStorage.setItem('token', token);
    refreshUser().finally(() => navigate('/', { replace: true }));
  }, [params, navigate, refreshUser]);

  return <div className="screen-center"><ProgressSpinner /></div>;
}
