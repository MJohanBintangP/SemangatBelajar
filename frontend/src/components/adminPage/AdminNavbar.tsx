import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUser } from '../../contexts/userContextImpl';
import Profile from '../../assets/profile.svg';
import logoNavbar from '../../assets/navbarLogo.svg';
import * as Phospor from '@phosphor-icons/react';

type AdminNavbarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  username?: string;
  email?: string;
};

export default function AdminNavbar({ activeTab, setActiveTab, username, email }: AdminNavbarProps) {
  const navigate = useNavigate();
  const [usernameState, setUsernameState] = useState(username || '');
  const [emailState, setEmailState] = useState(email || '');
  const { user } = useUser();

  useEffect(() => {
    if (username || email) return;
    if (user) {
      setUsernameState(user.username || '');
      setEmailState(user.email || '');
    }
  }, [username, email, user]);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo & Profil */}
      <div className="shrink-0">
        <img src={logoNavbar} alt="logoNavbar" className="mb-6" loading="lazy" />
        <div className="flex gap-6 items-center justify-start pl-7 mb-6">
          <img src={Profile} alt="Profile" className="w-12 rounded-full" loading="lazy" />
          <div className="flex flex-col justify-center min-w-0">
            <div className="font-bold truncate">{usernameState || '...'}</div>
            <div className="text-xs text-[#9D9D9D] truncate">{emailState || '...'}</div>
            <div className="text-xs font-medium text-green-600">Administrator</div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto flex flex-col gap-6 px-6 mb-4">
        <button onClick={() => setActiveTab('laporan')} className={`cursor-pointer flex items-center gap-4 py-3 px-4 rounded-lg font-semibold text-green-700 ${activeTab === 'laporan' ? 'bg-green-100' : 'hover:bg-green-100'}`}>
          <Phospor.NotePencilIcon size={20} weight="bold" /> Data Laporan
        </button>

        <button onClick={() => setActiveTab('users')} className={`cursor-pointer flex items-center gap-4 py-3 px-4 rounded-lg font-semibold text-green-700 ${activeTab === 'users' ? 'bg-green-100' : 'hover:bg-green-100'}`}>
          <Phospor.UsersIcon size={20} weight="bold" /> Data User
        </button>

        <button onClick={() => setActiveTab('forums')} className={`cursor-pointer flex items-center gap-4 py-3 px-4 rounded-lg font-semibold text-green-700 ${activeTab === 'forums' ? 'bg-green-100' : 'hover:bg-green-100'}`}>
          <Phospor.ChatCircleTextIcon size={20} weight="bold" /> Data Forum
        </button>
      </nav>

      {/* Logout Button */}
      <div className="shrink-0 px-6 mb-4">
        <button onClick={handleLogout} className="cursor-pointer w-full bg-[#EE0000] text-white py-2 rounded-xl font-semibold hover:bg-red-700">
          LogOut
        </button>
      </div>
    </div>
  );
}
