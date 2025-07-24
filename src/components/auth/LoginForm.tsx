import '../../styles/LoginForm.css';
import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';

const SITE_KEY = '6LcWKI0rAAAAAPBa7C8vteFCHDQMSR0moyC0E-Sp';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        username,
        password,
        recaptchaToken,
      });

      localStorage.setItem('token', response.data.token);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <img src="/logo.png" alt="Logo SIVIGILA" />
        <h1>Bienvenidos al portal SIVIGILA CALI</h1>
        <label>Usuario</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Clave</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="recaptcha-container">
          <ReCAPTCHA
            sitekey={SITE_KEY}
            onChange={(token) => setRecaptchaToken(token || '')}
          />
        </div>
        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading || !recaptchaToken}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
