import { useRef } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Menu } from 'primereact/menu';
import { useAuth } from '../state/AuthContext.jsx';
import { useCart } from '../state/CartContext.jsx';

export default function AppLayout() {
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const menuItems = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => {
        navigate('/profile');
      }
    },
    {
      label: 'Log Out',
      icon: 'pi pi-sign-out',
      command: handleLogout
    }
  ];

  return (
    <div>
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-mark">CB</span>
          <span>Carter Rewards</span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/">Vouchers</NavLink>
          <NavLink to="/terms">Terms</NavLink>
          {isAdmin && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className="topbar-actions">
          <NavLink to="/cart" className="cart-nav-link" aria-label="Shopping Cart">
            <i className="pi pi-shopping-cart"></i>
            {itemCount > 0 && <Badge value={itemCount} severity="danger" />}
          </NavLink>
          <div className="user-chip">
            <span className="points">{user?.points} pts</span>
            <Menu model={menuItems} popup ref={userMenuRef} id="user_menu" />
            <Button
              label={user?.username}
              icon="pi pi-chevron-down"
              iconPos="right"
              onClick={(e) => userMenuRef.current.toggle(e)}
              aria-controls="user_menu"
              aria-haspopup
              text
              severity="secondary"
              className="p-button-sm"
              style={{ fontWeight: 'bold' }}
            />
          </div>
        </div>
      </header>
      <main className="page-shell">
        <Outlet />
      </main>
    </div>
  );
}
