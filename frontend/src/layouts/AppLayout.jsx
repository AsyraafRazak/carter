import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { useAuth } from '../state/AuthContext.jsx';
import { useCart } from '../state/CartContext.jsx';

export default function AppLayout() {
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div>
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-mark">CB</span>
          <span>Carter Rewards</span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/">Vouchers</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          <NavLink to="/terms">Terms</NavLink>
          {isAdmin && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className="topbar-actions">
          <NavLink to="/cart" className="cart-nav-link" aria-label="Shopping Cart">
            <i className="pi pi-shopping-cart"></i>
            {itemCount > 0 && <Badge value={itemCount} severity="danger" />}
          </NavLink>
          <div className="user-chip">
            <span>{user?.username}</span>
            <span className="points">{user?.points} pts</span>
            <Button icon="pi pi-sign-out" rounded text aria-label="Log out" onClick={handleLogout} />
          </div>
        </div>
      </header>
      <main className="page-shell">
        <Outlet />
      </main>
    </div>
  );
}
