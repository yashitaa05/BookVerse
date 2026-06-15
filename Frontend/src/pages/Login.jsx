import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { api } from '../api';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await api.login(form);
      localStorage.setItem('voicedoc_token', data.token);
      localStorage.setItem('voicedoc_user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <form className="glass-panel auth-card" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <p>Access your VoiceDoc TTS dashboard.</p>
        {error && <div className="error-box">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
        />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          <LogIn size={18} />
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p>
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
