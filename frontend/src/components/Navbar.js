import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ background: '#333', color: '#fff', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px' }}>
          Employee Analytics
        </Link>
      </div>
      {user && (
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#ccc', textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/employees" style={{ color: '#ccc', textDecoration: 'none' }}>Employees</Link>
          <Link to="/add-employee" style={{ color: '#ccc', textDecoration: 'none' }}>Add Employee</Link>
          <Link to="/ai-recommend" style={{ color: '#ccc', textDecoration: 'none' }}>AI Recommend</Link>
          <span style={{ color: '#aaa' }}>| {user.name}</span>
          <button onClick={handleLogout} style={{ background: '#555', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
