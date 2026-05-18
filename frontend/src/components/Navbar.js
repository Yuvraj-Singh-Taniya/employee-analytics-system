import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/', label: 'Dashboard' },
  { to: '/employees', label: 'Employees' },
  { to: '/add-employee', label: 'Add Employee' },
  { to: '/ai-recommend', label: 'AI Recommend' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoMark}>EA</span>
          <span style={styles.logoText}>Employee Analytics</span>
        </Link>
        {user && (
          <>
            <nav style={styles.nav}>
              {navLinks.map(({ to, label }) => {
                const active = location.pathname === to;
                return (
                  <Link key={to} to={to} style={{ ...styles.navLink, ...(active ? styles.navActive : {}) }}>
                    {label}
                  </Link>
                );
              })}
            </nav>
            <div style={styles.userArea}>
              <span style={styles.avatar}>{user.name?.charAt(0).toUpperCase()}</span>
              <span style={styles.userName}>{user.name}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>Log out</button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

const styles = {
  header: { background: '#fff', borderBottom: '1px solid #e4e2de', position: 'sticky', top: 0, zIndex: 100 },
  inner: { maxWidth: 1200, margin: '0 auto', padding: '0 28px', height: 56, display: 'flex', alignItems: 'center', gap: 32 },
  logo: { display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 },
  logoMark: { width: 30, height: 30, background: '#1a1916', color: '#fff', borderRadius: 7, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em' },
  logoText: { fontSize: 14, fontWeight: 600, color: '#1a1916' },
  nav: { display: 'flex', alignItems: 'center', gap: 2, flex: 1 },
  navLink: { padding: '5px 12px', borderRadius: 6, fontSize: 14, color: '#6b6860', fontWeight: 400, transition: 'all 0.12s' },
  navActive: { background: '#f0efec', color: '#1a1916', fontWeight: 500 },
  userArea: { display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto', flexShrink: 0 },
  avatar: { width: 28, height: 28, borderRadius: '50%', background: '#eff4ff', color: '#2563eb', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 },
  userName: { fontSize: 13, color: '#6b6860', fontWeight: 500 },
  logoutBtn: { background: 'none', border: '1px solid #e4e2de', color: '#6b6860', padding: '4px 12px', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer' },
};

export default Navbar;
