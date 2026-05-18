import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try { await login(email, password); navigate('/'); }
    catch (err) { setError(err.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logoMark}>EA</div>
        <h1 style={s.title}>Welcome back</h1>
        <p style={s.sub}>Sign in to your account</p>
        {error && <div style={s.alert}>{error}</div>}
        <form onSubmit={handleSubmit} style={s.form}>
          <Field label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required />
          <Field label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          <button type="submit" disabled={loading} style={s.btn}>{loading ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <p style={s.footer}>No account? <Link to="/signup" style={s.link}>Create one</Link></p>
      </div>
    </div>
  );
};

const Field = ({ label, ...props }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={s.label}>{label}</label>
    <input style={s.input} {...props} />
  </div>
);

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { background: '#fff', border: '1px solid #e4e2de', borderRadius: 14, padding: '40px 36px', width: '100%', maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' },
  logoMark: { width: 40, height: 40, background: '#1a1916', color: '#fff', borderRadius: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 600, color: '#1a1916', marginBottom: 4 },
  sub: { fontSize: 14, color: '#6b6860', marginBottom: 28 },
  alert: { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 7, padding: '10px 14px', fontSize: 13, marginBottom: 20 },
  form: {},
  label: { display: 'block', fontSize: 13, fontWeight: 500, color: '#1a1916', marginBottom: 5 },
  input: { width: '100%', border: '1px solid #e4e2de', borderRadius: 7, padding: '9px 12px', fontSize: 14, color: '#1a1916', outline: 'none', background: '#fafaf9', transition: 'border-color 0.15s' },
  btn: { width: '100%', background: '#1a1916', color: '#fff', border: 'none', borderRadius: 8, padding: '11px', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 8, letterSpacing: '-0.01em' },
  footer: { textAlign: 'center', fontSize: 13, color: '#6b6860', marginTop: 24 },
  link: { color: '#2563eb', fontWeight: 500 },
};

export default Login;
