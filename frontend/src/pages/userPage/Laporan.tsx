import { useEffect, useState } from 'react';
import BuatLaporan from '../../components/userPage/BuatLaporan';
import ilustrasiEmpty from '../../assets/ilustrasiEmpty.svg';

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
    const token = localStorage.getItem('token');
    if (!token) return;

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setLoading(true);
    fetch('https://api.ecosteps.site/api/laporan/user', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setRiwayat(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [showPopup]);

  return (
    <div className="py-10">
      <h2 className="text-2xl font-bold mb-4">Laporan</h2>
      <div className="flex flex-row justify-between items-center mb-12">
        <div className="bg-[#25E82F]/9 flex px-10 py-3 rounded-xl gap-6">
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
          <img src={ilustrasiEmpty} alt="Laporan kosong" className="w-80 mb-6" />
          <div className="text-2xl font-bold mb-2">Laporan kosong</div>
          <div className="text-gray-500 text-lg text-center">Buat laporan pertamamu terlebih dahulu !</div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow">
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
                  <td className="px-4 py-3 max-w-[250px]">{laporan.deskripsi}</td>
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
      )}

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <BuatLaporan onClose={() => setShowPopup(false)} />
        </div>
      )}
    </div>
  );
}
