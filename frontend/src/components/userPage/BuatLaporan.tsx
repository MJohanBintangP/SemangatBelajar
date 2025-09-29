import { useState } from 'react';

export default function BuatLaporan({ onClose }: { onClose?: () => void }) {
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [pesan, setPesan] = useState('');

  function getLocation() {
    if (!navigator.geolocation) {
      setPesan('Geolocation tidak didukung browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLokasi(`${pos.coords.latitude},${pos.coords.longitude}`),
      () => setPesan('Gagal mengambil lokasi.')
    );
  }

  function handleCancel() {
    if (onClose) {
      onClose();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPesan('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:8081/api/laporan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          judul,
          deskripsi,
          foto_url: fotoUrl,
          video_url: videoUrl,
          lokasi,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPesan(data.message || 'Gagal mengirim laporan');
        return;
      }
      setPesan('Laporan berhasil dikirim!');
      setJudul('');
      setDeskripsi('');
      setFotoUrl('');
      setVideoUrl('');
      setLokasi('');
      if (onClose) onClose();
    } catch {
      setPesan('Gagal koneksi ke server');
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-6">Tambah laporan</h2>

        {pesan && <div className="mb-4 text-red-600">{pesan}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input className="w-full p-3 border border-gray-200 rounded-lg bg-white" value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="Judul" required />
          </div>

          <div>
            <textarea className="w-full p-3 border border-gray-200 rounded-lg bg-white min-h-[120px]" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} placeholder="Deskripsi" required />
          </div>

          <div>
            <input className="w-full p-3 border border-gray-200 rounded-lg bg-white" value={fotoUrl} onChange={(e) => setFotoUrl(e.target.value)} placeholder="Url foto" />
          </div>

          <div>
            <input className="w-full p-3 border border-gray-200 rounded-lg bg-white" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Url video" />
          </div>

          <div className="flex gap-2 mb-12">
            <input className="flex-1 p-3 border border-gray-200 rounded-lg bg-white" value={lokasi} readOnly placeholder="Koordinat" />
            <button type="button" onClick={getLocation} className="px-4 py-2 bg-[#25E82F] text-white rounded-lg font-medium">
              Ambil lokasi
            </button>
          </div>

          <div className="flex gap-3 justify-end mb-0">
            <button type="button" onClick={handleCancel} className="cursor-pointer px-6 py-2 border border-gray-200 rounded-lg">
              Batal
            </button>
            <button type="submit" className="cursor-pointer bg-[#25E82F] text-white px-4 py-2 rounded-lg font-medium">
              Tambah laporan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
