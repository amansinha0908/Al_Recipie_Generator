import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      navigate('/'); // Navigate to home after login/register
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      {/* Decorative blobs */}
      <div style={s.blob1} />
      <div style={s.blob2} />

      <div style={s.card}>
        {/* Logo */}
        <div style={s.logoRow}>
          <span style={s.logoEmoji}>🍳</span>
          <div>
            <h1 style={s.logo}>RecipAI</h1>
            <p style={s.tagline}>Your AI-powered kitchen companion</p>
          </div>
        </div>

        <h2 style={s.heading}>{isLogin ? 'Welcome back' : 'Start cooking smarter'}</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} style={s.form}>
          {!isLogin && (
            <div style={s.field}>
              <label style={s.label}>Your name</label>
              <input
                style={s.input}
                placeholder="Julia Child"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required={!isLogin}
              />
            </div>
          )}

          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input
              style={s.input}
              type="email"
              placeholder="you@kitchen.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input
              style={s.input}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
            type="submit"
          >
            {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle link */}
        <p style={s.toggle}>
          {isLogin ? "New here?" : 'Already have an account?'}{' '}
          <span style={s.link} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Create account' : 'Sign in'}
          </span>
        </p>
      </div>
    </div>
  );
};

const s = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#FFF8F0',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'DM Sans', sans-serif",
  },
  blob1: {
    position: 'absolute',
    top: '-80px',
    right: '-80px',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(200,96,58,0.15), transparent 70%)',
    zIndex: 0,
  },
  blob2: {
    position: 'absolute',
    bottom: '-100px',
    left: '-100px',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(122,158,126,0.15), transparent 70%)',
    zIndex: 0,
  },
  card: {
    background: 'white',
    borderRadius: '24px',
    padding: '48px 44px',
    width: '100%',
    maxWidth: '420px',
    position: 'relative',
    zIndex: 1,
    boxShadow: '0 8px 40px rgba(61,43,31,0.12)',
    border: '1px solid #E0D6D1',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  logoRow: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' },
  logoEmoji: { fontSize: '40px' },
  logo: { fontSize: '26px', color: '#D87C6D', fontWeight: 700 },
  tagline: { color: '#7D7D7D', fontSize: '12px', marginTop: '2px' },
  heading: { fontSize: '22px', color: '#4B2E2E', marginBottom: '28px', fontWeight: 500 },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '500', color: '#4B2E2E' },
  input: {
    border: '1.5px solid #E0D6D1',
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '14px',
    color: '#4B2E2E',
    background: '#FFF8F0',
  },
  btn: {
    background: '#D87C6D',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '13px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '12px',
    transition: 'background 0.2s',
  },
  toggle: { textAlign: 'center', color: '#7D7D7D', marginTop: '24px', fontSize: '14px' },
  link: { color: '#D87C6D', cursor: 'pointer', fontWeight: '500' },
};

export default AuthPage;