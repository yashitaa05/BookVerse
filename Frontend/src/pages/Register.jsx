import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { api } from '../api';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await api.register(form);
      localStorage.setItem('voicedoc_token', data.token);
      localStorage.setItem('voicedoc_user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (registerError) {
      setError(registerError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <form className="glass-panel auth-card" onSubmit={handleSubmit}>
        <h1>Register</h1>
        <p>Create an account to keep document history.</p>
        {error && <div className="error-box">{error}</div>}
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />
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
          <UserPlus size={18} />
          {loading ? 'Creating account...' : 'Register'}
        </button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
