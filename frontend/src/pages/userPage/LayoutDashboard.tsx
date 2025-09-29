import { useEffect, useState } from 'react';
import DashboardNavbar from '../../components/userPage/DashboardNavbar';
import { Outlet, useNavigate } from 'react-router-dom';
import ilustrasiLayout from '../../assets/ilustrasiLayout.svg';

export default function LayoutDashboard() {
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileDevice(window.innerWidth < 1024);
    };

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (isMobileDevice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 md:p-30 text-center">
        <img className="mb-4 md:mb-10" src={ilustrasiLayout} alt="ilustrasiLayout" />
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">Perangkat Tidak Didukung !</h1>
        <p className="text-[#737373] text-md md:text-lg mb-6">Web ini sementara belum mendukung ukuran layar dari device anda. Silakan akses menggunakan perangkat desktop atau laptop untuk pengalaman terbaik.</p>

        <button onClick={() => navigate('/')} className="mt-6 bg-[#25E82F] text-white px-6 md:px-8 py-2 rounded-xl font-medium">
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white h-screen flex overflow-hidden">
      <aside className="w-76 bg-white h-screen flex-shrink-0 shadow-lg">
        <div className="h-full flex flex-col overflow-hidden">
          <DashboardNavbar />
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto px-20 py-5">
        <Outlet />
      </main>
    </div>
  );
}
