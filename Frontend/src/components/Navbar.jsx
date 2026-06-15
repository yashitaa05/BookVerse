import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, LayoutDashboard, LogIn, LogOut } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('voicedoc_token');

  const handleLogout = () => {
    localStorage.removeItem('voicedoc_token');
    localStorage.removeItem('voicedoc_user');
    navigate('/login');
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '70px',
      background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      boxShadow: '0 1px 12px rgba(99,102,241,0.07)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'var(--text-primary)' }}>
          <div className="btn-icon" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
            <BookOpen size={24} color="white" />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Book<span className="text-gradient">Verse</span></span>
        </Link>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/dashboard" className={`btn ${location.pathname === '/dashboard' ? 'btn-primary' : 'btn-secondary'}`}>
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          {token ? (
            <button type="button" className="btn btn-secondary" onClick={handleLogout}>
              <LogOut size={18} />
              Logout
            </button>
          ) : (
            <Link to="/login" className={`btn ${location.pathname === '/login' ? 'btn-primary' : 'btn-secondary'}`}>
              <LogIn size={18} />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
