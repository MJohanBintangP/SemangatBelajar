import { useEffect, useState } from 'react';
import QuickActions from '../../components/userPage/QuickActions';
import RiwayatLaporan from '../../components/userPage/RiwayatLaporan';
import TantanganAktif from '../../components/userPage/TantanganAktif';
import ArtikelGrid from './Artikel';

export default function Dashboard() {
  const [username, setUsername] = useState('');
  const [tantanganSelesai, setTantanganSelesai] = useState(0);
  const [totalPoin, setTotalPoin] = useState(0);
  const [totalLaporan, setTotalLaporan] = useState(0);
  const [statusTerbaru, setStatusTerbaru] = useState('-');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('https://api.ecosteps.site/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsername(data.username || '');
      })
      .catch(() => setUsername(''));

    fetch('https://api.ecosteps.site/api/tantangan/selesai-hari-ini', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTantanganSelesai(Array.isArray(data) ? data.length : 0));

    fetch('https://api.ecosteps.site/api/user/poin', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTotalPoin(data.poin || 0));

    fetch('https://api.ecosteps.site/api/laporan/user', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTotalLaporan(data.length);
          setStatusTerbaru(data.length > 0 ? data[0].status : '-');
        }
      });
  }, []);

  return (
    <div className="flex flex-col py-10">
      <main className="flex-1 mx-auto w-full">
        {/* Header */}
        <div className="rounded-xl mb-8">
          <div className="text-2xl font-bold mb-4">Halo, {username ? username : '...'} 👋</div>
          <div className="bg-[#25E82F]/9 w-fit px-12 py-3 rounded-lg flex justify-center flex-wrap gap-6 text-base">
            <div>
              Tantangan Diselesaikan Hari Ini: <span className="font-bold">{tantanganSelesai}</span>
            </div>
            <div>
              Poin: <span className="font-bold">{totalPoin}</span>
            </div>
            <div>
              Total Laporan: <span className="font-bold">{totalLaporan}</span>
            </div>
            <div>
              Status Terbaru: <span className="font-bold text-[#25E82F]">{statusTerbaru}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <QuickActions />
        </div>

        {/* Box: Riwayat Laporan & Tantangan Aktif */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1">
            <RiwayatLaporan />
          </div>
          <div className="flex-1">
            <TantanganAktif />
          </div>
        </div>

        {/* Artikel */}
        <div>
          <h2 className="text-2xl font-semibold mb-8">Artikel</h2>
          <ArtikelGrid limit={4} isDashboard={true} />
        </div>
      </main>
    </div>
  );
}
