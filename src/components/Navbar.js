import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav style={{ padding: '10px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <Link to="/" style={{ textDecoration: 'none', fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
          Shop
        </Link>
        <div>
          <Link to="/" style={{ margin: '0 10px', textDecoration: 'none', color: '#007bff' }}>Home</Link>
          {token ? (
            <>
              <Link to="/cart" style={{ margin: '0 10px', textDecoration: 'none', color: '#007bff' }}>Cart</Link>
              <Link to="/orders" style={{ margin: '0 10px', textDecoration: 'none', color: '#007bff' }}>Orders</Link>
              {user.role === 'admin' && (
                <Link to="/admin" style={{ margin: '0 10px', textDecoration: 'none', color: '#007bff' }}>Admin</Link>
              )}
              <button onClick={handleLogout} style={{ margin: '0 10px', padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ margin: '0 10px', textDecoration: 'none', color: '#007bff' }}>Login</Link>
              <Link to="/register" style={{ margin: '0 10px', textDecoration: 'none', color: '#007bff' }}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
