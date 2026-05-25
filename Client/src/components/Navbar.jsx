import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/auth'); };

  const linkStyle = ({ isActive }) => ({
    ...s.link,
    color: isActive ? 'var(--terracotta)' : 'var(--brown-mid)',
    fontWeight: isActive ? '500' : '400',
    borderBottom: isActive ? '2px solid var(--terracotta)' : '2px solid transparent',
  });

  return (
    <nav style={s.nav}>
      <div style={s.inner}>
        <NavLink to="/" style={s.brand}>
          <span style={s.brandEmoji}>🍳</span>
          <span style={s.brandName}>RecipAI</span>
        </NavLink>

        <div style={s.links}>
          <NavLink to="/" end style={linkStyle}>Generate</NavLink>
          <NavLink to="/cookbook" style={linkStyle}>Cookbook</NavLink>
          <NavLink to="/mealplan" style={linkStyle}>Meal Plan</NavLink>
        </div>

        <div style={s.user}>
          <span style={s.userName}>Hi, {user?.name?.split(' ')[0]} 👋</span>
          <button style={s.logoutBtn} onClick={handleLogout}>Sign out</button>
        </div>
      </div>
    </nav>
  );
};

const s = {
  nav: {
    background: 'white', borderBottom: '1px solid var(--border)',
    position: 'sticky', top: 0, zIndex: 100,
    boxShadow: '0 1px 12px rgba(61,43,31,0.06)',
  },
  inner: {
    maxWidth: '1100px', margin: '0 auto', padding: '0 24px',
    height: '64px', display: 'flex', alignItems: 'center', gap: '32px',
  },
  brand: { display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' },
  brandEmoji: { fontSize: '22px' },
  brandName: { fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--terracotta)', fontWeight: 700 },
  links: { display: 'flex', gap: '4px', flex: 1, justifyContent: 'center' },
  link: { textDecoration: 'none', padding: '8px 16px', fontSize: '14px', transition: 'color 0.15s', borderRadius: '0' },
  user: { display: 'flex', alignItems: 'center', gap: '16px' },
  userName: { color: 'var(--muted)', fontSize: '13px' },
  logoutBtn: {
    background: 'var(--warm)', border: '1px solid var(--border)',
    borderRadius: '8px', padding: '6px 14px', fontSize: '13px',
    color: 'var(--brown-mid)', cursor: 'pointer',
  },
};

export default Navbar;