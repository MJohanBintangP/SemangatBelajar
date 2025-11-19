import { useEffect, useState } from 'react';
import BuatLaporan from '../../components/userPage/BuatLaporan';
import ilustrasiEmpty from '../../assets/ilustrasiEmpty.svg';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8081';

type Laporan = {
  id: number;
  judul: string;
  deskripsi: string;
  foto_url?: string;
  video_url?: string;
  lokasi?: string;
  status: string;
  created_at: string;
};

export default function Laporan() {
  const [showPopup, setShowPopup] = useState(false);
  const [riwayat, setRiwayat] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalLaporan, setTotalLaporan] = useState(0);
  const [statusTerbaru, setStatusTerbaru] = useState('-');

  useEffect(() => {
    const doFetchTotals = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token found; skipping laporan totals fetch');
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/laporan/user`, { headers: { Authorization: `Bearer ${token}` } });
        const txt = await res.text();
        let data: any = {};
        try {
          data = txt ? JSON.parse(txt) : [];
        } catch {
          data = {};
        }

        const arr = Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];
        setTotalLaporan(arr.length);
        setStatusTerbaru(arr.length > 0 ? arr[0].status : '-');
      } catch (err) {
        console.warn('Failed to fetch laporan totals', err);
      }
    };

    void doFetchTotals();
  }, []);

  useEffect(() => {
    const doFetchRiwayat = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setRiwayat([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/laporan/user`, { headers: { Authorization: `Bearer ${token}` } });
        const txt = await res.text();
        let data: any = [];
        try {
          data = txt ? JSON.parse(txt) : [];
        } catch {
          data = [];
        }

        const arr = Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];
        setRiwayat(arr);
      } catch (err) {
        console.warn('Failed to fetch riwayat laporan', err);
        setRiwayat([]);
      } finally {
        setLoading(false);
      }
    };

    void doFetchRiwayat();
  }, [showPopup]);

  return (
    <div className="py-10">
      <h2 className="text-2xl font-bold mb-4">Laporan</h2>
      <div className="flex flex-row justify-between items-center mb-12">
        <div className="bg-[#25E82F]/9 flex px-4 sm:px-10 py-3 rounded-xl gap-6">
          <div>
            Total Laporan: <span className="font-bold">{totalLaporan}</span>
          </div>
          <div>
            Status Terbaru: <span className="font-bold text-[#25E82F]">{statusTerbaru}</span>
          </div>
        </div>

        <button onClick={() => setShowPopup(true)} className="cursor-pointer bg-white text-black px-6 py-3 rounded-xl font-semibold shadow-md flex items-center">
          + Tambah Laporan
        </button>
      </div>
      <h1 className="mb-10 text-xl font-semibold">📌 Riwayat laporan</h1>
      {loading ? (
        <div className="text-gray-500">Memuat data...</div>
      ) : riwayat.length === 0 ? (
        <div className="flex flex-col items-center justify-center  rounded-lg py-16">
          <img src={ilustrasiEmpty} alt="Laporan kosong" className="w-80 max-w-full mb-6" />
          <div className="text-2xl font-bold mb-2">Laporan kosong</div>
          <div className="text-gray-500 text-lg text-center">Buat laporan pertamamu terlebih dahulu !</div>
        </div>
      ) : (
        <>
          {/* Mobile: stacked cards for small screens */}
          <div className="block lg:hidden space-y-4">
            {riwayat.map((laporan, idx) => (
              <div key={laporan.id} className="bg-white rounded-lg shadow p-4 border">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{laporan.judul}</div>
                    <div className="text-xs text-gray-600 mt-1 truncate">{laporan.deskripsi}</div>
                    <div className="text-xs text-gray-500 mt-2">Lokasi: {laporan.lokasi ?? '-'}</div>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <div className="text-xs text-gray-500">No: {idx + 1}</div>
                    <div className="text-sm font-semibold mt-2">{laporan.status}</div>
                    <div className="text-xs text-gray-500 mt-1">{new Date(laporan.created_at).toLocaleString()}</div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {laporan.foto_url && (
                    <a href={laporan.foto_url} target="_blank" rel="noopener noreferrer" className="text-[#005EFF] block text-xs">
                      Lihat foto
                    </a>
                  )}
                  {laporan.video_url && (
                    <a href={laporan.video_url} target="_blank" rel="noopener noreferrer" className="text-[#005EFF] block text-xs">
                      Lihat video
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop/table for large screens */}
          <div className="hidden lg:block overflow-x-auto rounded-2xl shadow responsive-table">
            <table className="min-w-full bg-white rounded-2xl">
              <thead>
              <tr>
                <th className="bg-[#25E82F] text-white px-4 py-2 text-left rounded-tl-2xl">No</th>
                <th className="bg-[#25E82F] text-white px-4 py-2 text-left">Judul</th>
                <th className="bg-[#25E82F] text-white px-4 py-2 text-left">Deskripsi</th>
                <th className="bg-[#25E82F] text-white px-4 py-2 text-left">Dokumentasi</th>
                <th className="bg-[#25E82F] text-white px-4 py-2 text-left">Lokasi</th>
                <th className="bg-[#25E82F] text-white px-4 py-2 text-left">Status</th>
                <th className="bg-[#25E82F] text-white px-4 py-2 text-left rounded-tr-2xl">Tanggal melapor</th>
              </tr>
            </thead>
            <tbody>
              {riwayat.map((laporan, idx) => (
                <tr key={laporan.id} className="">
                  <td className="px-4 py-3 font-medium">{idx + 1}</td>
                  <td className="px-4 py-3 font-semibold">{laporan.judul}</td>
                  <td className="px-4 py-3 max-w-full sm:max-w-[250px]">{laporan.deskripsi}</td>
                  <td className="px-4 py-3">
                    {laporan.foto_url && (
                      <a href={laporan.foto_url} target="_blank" rel="noopener noreferrer" className="text-[#005EFF] block">
                        Lihat foto
                      </a>
                    )}
                    {laporan.video_url && (
                      <a href={laporan.video_url} target="_blank" rel="noopener noreferrer" className="text-[#005EFF] block">
                        Lihat video
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#005EFF]">{laporan.lokasi ? <span>{laporan.lokasi.length > 10 ? laporan.lokasi.substring(0, 8) + '...' : laporan.lokasi}</span> : '-'}</td>
                  <td className="px-4 py-3 font-semibold">{laporan.status}</td>
                  <td className="px-4 py-3 text-sm text-black">{new Date(laporan.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          </>
      )}

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <BuatLaporan onClose={() => setShowPopup(false)} />
        </div>
      )}
    </div>
  );
}
