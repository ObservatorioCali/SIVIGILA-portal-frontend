import { useNavigate } from 'react-router-dom';
import '../../styles/Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
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