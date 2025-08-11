import { useAuth } from '../../contexts/AuthContext.jsx';
import '../../styles/Navbar.css';

export default function Navbar() {
  const { logout } = useAuth();
  const handleLogout = () => { logout(); window.location.href = '/'; };
  return (
    <header className="navbar">
      <div className="navbar-left"><img src="/logo.png" alt="Logo" className="logo" /></div>
      <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
    </header>
  );
}
