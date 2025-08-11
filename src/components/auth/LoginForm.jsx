import '../../styles/LoginForm.css';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAuth } from '../../contexts/AuthContext.jsx';

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LcWKI0rAAAAAPBa7C8vteFCHDQMSR0moyC0E-Sp';
const RECAPTCHA_ENABLED = import.meta.env.VITE_RECAPTCHA_ENABLED !== 'false';

export default function LoginForm() {
  const [codigo, setCodigo] = useState('');
  const [password, setPassword] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (RECAPTCHA_ENABLED && recaptchaRef.current) recaptchaRef.current.reset();
    setRecaptchaToken('');
  }, []);

  const clearError = () => { if (error) setError(''); };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    if (!/^[a-zA-Z0-9]{6,15}$/.test(codigo)) { setError('El código debe tener entre 6 y 15 caracteres (letras y números)'); setLoading(false); return; }
    try {
      await login({ codigo, password, recaptchaToken: RECAPTCHA_ENABLED ? recaptchaToken : 'development-bypass' });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      if (RECAPTCHA_ENABLED && recaptchaRef.current) { recaptchaRef.current.reset(); setRecaptchaToken(''); }
    } finally { setLoading(false); }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <img src="/logo.png" alt="Logo SIVIGILA" />
        <h1>Bienvenidos al portal SIVIGILA CALI</h1>
        <label>Código de Usuario</label>
        <input type="text" value={codigo} onChange={(e) => { const value = e.target.value.replace(/[^a-zA-Z0-9]/g, ''); if (value.length <= 15) setCodigo(value); clearError(); }} placeholder="Ej: admin000001 o 76001001" maxLength={15} autoComplete="username" required />
        <label>Clave</label>
        <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); clearError(); }} autoComplete="current-password" required />
        <div className="recaptcha-container">
          {RECAPTCHA_ENABLED ? (
            <ReCAPTCHA ref={recaptchaRef} sitekey={SITE_KEY} onChange={(token) => { setRecaptchaToken(token || ''); clearError(); }} onExpired={() => { setRecaptchaToken(''); setError('El reCAPTCHA ha expirado. Por favor, complétalo nuevamente.'); }} onError={() => { setRecaptchaToken(''); setError('Error al cargar reCAPTCHA. Por favor, recarga la página.'); }} />
          ) : (
            <div className="recaptcha-disabled"><p style={{ fontSize: '14px', color: '#666', textAlign: 'center' }}>reCAPTCHA deshabilitado para desarrollo</p></div>
          )}
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading || (RECAPTCHA_ENABLED && !recaptchaToken)}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
        {RECAPTCHA_ENABLED && !recaptchaToken && (<p className="recaptcha-warning">Por favor, completa el reCAPTCHA para continuar</p>)}
      </form>
    </div>
  );
}
