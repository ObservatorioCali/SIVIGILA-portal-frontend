import '../../styles/LoginForm.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAuth } from '../../contexts/AuthContext';

const SITE_KEY = '6LcWKI0rAAAAAPBa7C8vteFCHDQMSR0moyC0E-Sp';

export default function LoginForm() {
  const [codigo, setCodigo] = useState('');
  const [password, setPassword] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validar que el código sea numérico y tenga entre 6-12 dígitos
    if (!/^\d{6,12}$/.test(codigo)) {
      setError('El código debe tener entre 6 y 12 dígitos numéricos');
      setLoading(false);
      return;
    }

    try {
      await login({
        codigo,
        password,
        recaptchaToken,
      });

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <img src="/logo.png" alt="Logo SIVIGILA" />
        <h1>Bienvenidos al portal SIVIGILA CALI</h1>
        <label>Código de Usuario</label>
        <input
          type="text"
          value={codigo}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ''); // Solo números
            if (value.length <= 12) {
              setCodigo(value);
            }
          }}
          placeholder="Ej: 76001001 (cod_pre+cod_sub)"
          maxLength={12}
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
