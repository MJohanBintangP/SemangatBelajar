import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Profile from '../../assets/profile.svg';
import logoNavbar from '../../assets/navbarLogo.svg';
import * as Phospor from '@phosphor-icons/react';
import NotePencil from '../../assets/NotePencil.svg';

export default function DashboardNavbar({ username, email }: { username?: string; email?: string } = {}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [usernameState, setUsernameState] = useState(username || '');
  const [emailState, setEmailState] = useState(email || '');

  // Fetch profile only if parent didn't provide username/email
  useEffect(() => {
    if (username || email) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:8081/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsernameState(data.username || '');
        setEmailState(data.email || '');
      })
      .catch(() => {
        setUsernameState('');
        setEmailState('');
      });
  }, [username, email]);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  }

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Logo & Profil */}
      <div className="shrink-0">
        <img src={logoNavbar} alt="logoNavbar" className="mb-6" loading="lazy" />
        <div className="flex gap-6 items-center justify-start pl-7 mb-6">
          <img src={Profile} alt="Profile" className="w-12 rounded-full" loading="lazy" />
          <div className="flex flex-col justify-center min-w-0">
            <div className="font-bold truncate">{usernameState || '...'}</div>
            <div className="text-xs text-[#9D9D9D] truncate">{emailState || '...'}</div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 flex flex-col gap-5 px-6 mb-4 dashboard-nav">
        <Link to="/Dashboard" className={`flex items-center gap-4 py-3 px-4 rounded-lg font-semibold text-green-700 ${isActive('/Dashboard') ? 'bg-green-100' : 'hover:bg-green-100'}`}>
          <Phospor.HouseSimpleIcon size={20} weight="bold" /> Dashboard
        </Link>
        <Link to="/Laporan" className={`flex items-center gap-4 py-3 px-4 rounded-lg font-semibold text-green-700 ${isActive('/Laporan') ? 'bg-green-100' : 'hover:bg-green-100'}`}>
          <Phospor.NotePencilIcon size={20} weight="bold" /> Laporan
        </Link>
        <Link to="/Tantangan" className={`flex items-center gap-4 py-3 px-4 rounded-lg font-semibold text-green-700 ${isActive('/Tantangan') ? 'bg-green-100' : 'hover:bg-green-100'}`}>
          <Phospor.CheckCircleIcon size={20} weight="bold" /> Tantangan
        </Link>
        <Link to="/Forum" className={`flex items-center gap-4 py-3 px-4 rounded-lg font-semibold text-green-700 ${isActive('/Forum') ? 'bg-green-100' : 'hover:bg-green-100'}`}>
          <Phospor.HandWavingIcon size={20} weight="bold" /> Forum
        </Link>
        <Link to="/Artikel" className={`flex items-center gap-4 py-3 px-4 rounded-lg font-semibold text-green-700 ${isActive('/Artikel') ? 'bg-green-100' : 'hover:bg-green-100'}`}>
          <Phospor.ArticleIcon size={20} weight="bold" /> Artikel
        </Link>
      </nav>

      {/* Report Box & Logout*/}
      <div className="shrink-0 px-6 mb-4">
        {/* Report Box */}
        <div className="bg-[#008207] text-white h-[100px] rounded-[15px] mb-12 relative overflow-hidden">
          <div className="flex gap-2 pl-6 items-center h-full relative">
            <div className="relative">
              <h3 className="max-w-[150px] font-medium text-xs mb-2">Buat laporanmu sekarang !</h3>
              <Link to="/Laporan">
                <button className="cursor-pointer text-xs text-[#009B08] bg-white rounded-md px-5 py-1 font-medium">lapor</button>
              </Link>
            </div>
            <img className="ml-auto absolute right-4 bottom-0 w-16 h-auto" src={NotePencil} alt="NotePencil" loading="lazy" />
          </div>
        </div>

        {/* Logout Button */}
        <button onClick={handleLogout} className="cursor-pointer w-full bg-[#EE0000] text-white py-2 rounded-xl font-semibold hover:bg-red-700">
          LogOut
        </button>
      </div>
    </div>
  );
}
