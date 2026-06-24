import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Menu } from 'primereact/menu';
import { SelectButton } from 'primereact/selectbutton';
import { useAuth } from '../state/AuthContext.jsx';
import { useCart } from '../state/CartContext.jsx';

export default function AppLayout() {
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  // Semak bahasa semasa berdasarkan kelas yang diletakkan oleh Google pada tag <html> atau <body>
  const [bahasa, setBahasa] = useState(() => {
    const match = document.cookie.match(/(^| )googtrans=([^;]+)/);
    if (match) {
      const parts = match[2].split('/');
      return parts[parts.length - 1] === 'ms' ? 'ms' : 'en';
    }
    return 'en';
  });

  const opsiBahasa = [
    { label: 'EN', value: 'en' },
    { label: 'BM', value: 'ms' }
  ];

  useEffect(() => {
    // 1. Inisialisasi Google Translate Standard
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,ms',
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');
    };

    // 2. Suntik skrip Google Translate
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);
    }

    // 3. Suntik CSS tegar untuk sorok Google Banner & Popup secara mutlak
    const cssRahsia = `
      .goog-te-banner-frame, .goog-te-banner, .skiptranslate, #goog-gt-tt, .goog-te-balloon-frame {
        display: none !important;
        visibility: hidden !important;
      }
      body {
        top: 0 !important;
        position: static !important;
      }
      .goog-text-highlight {
        background: none !important;
        box-shadow: none !important;
      }
    `;
    const gayaSkrip = document.createElement('style');
    gayaSkrip.type = 'text/css';
    gayaSkrip.appendChild(document.createTextNode(cssRahsia));
    document.head.appendChild(gayaSkrip);
  }, []);

  // Fungsi menukar bahasa menggunakan simulasi klik pada elemen Google yang disorokkan
  const handleTukarBahasa = (e) => {
    if (!e.value) return;
    const targetLang = e.value;
    setBahasa(targetLang);

    // Cari elemen sulit dropdown Google Translate di dalam DOM
    const googleDropdown = document.querySelector('.goog-te-combo');
    if (googleDropdown) {
      googleDropdown.value = targetLang;
      // Cetus acara penukaran (change event) supaya skrip Google sedar perubahan tersebut
      googleDropdown.dispatchEvent(new Event('change'));
    } else {
      // Jika skrip Google belum sedia sepenuhnya, kita sandarkan pada tetapan cookie asal
      document.cookie = `googtrans=/en/${targetLang}; path=/`;
      document.cookie = `googtrans=/en/${targetLang}; domain=${window.location.hostname}; path=/`;
      window.location.reload();
    }
  };

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
      {/* Container Google yang diletakkan secara rahsia & disorokkan jauh daripada pandangan pengguna */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', visibility: 'hidden' }}>
        <div id="google_translate_element"></div>
      </div>

      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-mark">CB</span>
          <span>Carter Rewards</span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/">Vouchers</NavLink>
          <NavLink to="/cart">Cart {itemCount > 0 && <Badge value={itemCount} />}</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          <NavLink to="/terms">Terms</NavLink>
          {isAdmin && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className="user-chip">
          <span>{user?.username}</span>
          <span className="points">{user?.points} pts</span>
          <Button icon="pi pi-sign-out" rounded text aria-label="Log out" onClick={handleLogout} />
        </div>
      </header>
      <main className="page-shell">
        <Outlet />
      </main>
    </div>
  );
}