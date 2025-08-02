import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Navbar.css';

export default function Navbar() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Forzar navegación completa para resetear el estado
    window.location.href = '/';
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <img src="/logo.png" alt="Logo" className="logo" />
      </div>
      <button className="logout-btn" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </header>
  );
}