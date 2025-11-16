import { useEffect, useState } from 'react';
import DashboardNavbar from '../../components/userPage/DashboardNavbar';
import { Outlet } from 'react-router-dom';
import { useUser } from '../../contexts/userContextImpl';

export default function LayoutDashboard() {
  const [showUnsupported, setShowUnsupported] = useState(false);
  const [profile, setProfile] = useState<{ username?: string; email?: string }>({});
  const { user: ctxUser } = useUser();

  useEffect(() => {
    const checkScreenSize = () => {
      setShowUnsupported(window.innerWidth < 1024);
    };

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (ctxUser) setProfile({ username: ctxUser.username, email: ctxUser.email });
  }, [ctxUser]);

  return (
    <div className="bg-white min-h-screen flex overflow-hidden">
      {/* Sidebar for large screens */}
      <aside className="hidden lg:flex w-64 bg-white min-h-screen shrink-0 shadow-lg">
        <div className="h-full flex flex-col overflow-hidden">
          <DashboardNavbar username={profile.username} email={profile.email} />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-20 py-5">
        {/* Top navbar for small screens */}
        <div className="lg:hidden mb-4">
          <div className="bg-white rounded-lg shadow p-3">
            <DashboardNavbar username={profile.username} email={profile.email} />
          </div>
        </div>

        {/* Non-blocking unsupported-banner for small screens */}
        {showUnsupported && (
          <div className="mb-4 p-6 rounded-lg bg-yellow-50 border border-yellow-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-lg">Perangkat kecil terdeteksi</h2>
                <p className="text-sm text-gray-700">Aplikasi ini dioptimalkan untuk tampilan desktop. Anda tetap bisa menggunakan fitur, namun beberapa tata letak mungkin tidak ideal di perangkat kecil.</p>
              </div>
              <div className="shrink-0">
                <button onClick={() => setShowUnsupported(false)} className="text-sm text-gray-600 hover:underline">Tutup</button>
              </div>
            </div>
          </div>
        )}

        <Outlet />
      </main>
    </div>
  );
}
