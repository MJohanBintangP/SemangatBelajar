import { useEffect, useState } from 'react';
import DashboardNavbar from '../../components/userPage/DashboardNavbar';
import { Outlet, useNavigate } from 'react-router-dom';

export default function LayoutDashboard() {
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  }

  useEffect(() => {
    const checkScreenSize = () => setIsMobileDevice(window.innerWidth < 1024);

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (isMobileDevice) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <header className="mobile-header">
          <div className="flex items-center gap-3">
            <button aria-label="Buka menu" onClick={() => setIsNavOpen(true)} className="p-2 rounded-md bg-[#f3f3f3]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6H20M4 12H20M4 18H20" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          <div>
            <button onClick={handleLogout} className="text-sm text-[#EE0000]">LogOut</button>
          </div>
        </header>

        <main className="flex-1 p-4">
          <Outlet />
        </main>

        {isNavOpen && (
          <div className="mobile-nav-overlay">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Menu</h2>
              <button aria-label="Tutup menu" onClick={() => setIsNavOpen(false)} className="p-2 rounded-md bg-[#f3f3f3]">Tutup</button>
            </div>
            <div>
              <DashboardNavbar />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex overflow-hidden">
      {/* Sidebar for large screens */}
      <aside className="hidden lg:flex w-64 bg-white min-h-screen shrink-0 shadow-lg">
        <div className="h-full flex flex-col overflow-hidden">
          <DashboardNavbar />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-20 py-5">
        <Outlet />
      </main>
    </div>
  );
}
