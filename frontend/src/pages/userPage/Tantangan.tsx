import { useEffect, useState } from 'react';
import { Camera, Trophy, Target } from 'lucide-react';

type Tantangan = {
  id: number;
  judul: string;
  deskripsi: string;
  poin: number;
  tingkat_kesulitan: string;
};

type Leader = {
  email: string;
  poin: number;
  username?: string;
};

export default function Tantangan() {
  const [tasks, setTasks] = useState<Tantangan[]>([]);
  const [completed, setCompleted] = useState<number[]>([]);
  const [totalPoin, setTotalPoin] = useState(0);
  const [leaderboard, setLeaderboard] = useState<Leader[]>([]);
  const [files, setFiles] = useState<Record<number, File | null>>({});
  const [previews, setPreviews] = useState<Record<number, string>>({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [uploadingId, setUploadingId] = useState<number | null>(null);

  const extractUsername = (email: string): string => {
    const username = email.split('@')[0];
    return username.replace(/[^a-zA-Z0-9]/g, '');
  };

  useEffect(() => {
    fetch('http://localhost:8081/api/tantangan/hari-ini')
      .then((res) => res.json())
      .then((data) => setTasks(Array.isArray(data) ? data : []))
      .catch(console.error);

    const token = localStorage.getItem('token');
    
    if (token) {
      fetch('http://localhost:8081/api/user/poin', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setTotalPoin(data.poin || 0))
        .catch(console.error);

      fetch('http://localhost:8081/api/tantangan/selesai-hari-ini', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setCompleted(Array.isArray(data) ? data : []))
        .catch(console.error);

      fetch('http://localhost:8081/api/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            const role = (data.role || '').toString().toLowerCase();
            const adminFlag = role === 'admin' || data.is_admin === true || data.isAdmin === true;
            setIsAdmin(Boolean(adminFlag));
          }
        })
        .catch(() => setIsAdmin(false));
    }

    fetch('http://localhost:8081/api/leaderboard')
      .then((res) => res.json())
      .then((data) => {
        const processedData = Array.isArray(data)
          ? data.map((user) => ({
              ...user,
              username: user.username || extractUsername(user.email),
            }))
          : [];
        setLeaderboard(processedData);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => {
        if (url) {
          try {
            URL.revokeObjectURL(url);
          } catch {}
        }
      });
    };
  }, [previews]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, id: number) {
    const file = e.target.files?.[0] ?? null;
    
    setFiles((prev) => ({ ...prev, [id]: file }));

    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Hanya file gambar yang diperbolehkan!');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB!');
        return;
      }

      const url = URL.createObjectURL(file);
      
      if (previews[id]) {
        try {
          URL.revokeObjectURL(previews[id]);
        } catch {}
      }
      
      setPreviews((p) => ({ ...p, [id]: url }));
    } else {
      if (previews[id]) {
        try {
          URL.revokeObjectURL(previews[id]);
        } catch {}
      }
      setPreviews((p) => ({ ...p, [id]: '' }));
    }
  }

  async function handleUpload(tantangan: Tantangan) {
    if (!isAdmin) {
      alert('Hanya admin yang dapat menandai tantangan selesai.');
      return;
    }

    if (completed.includes(tantangan.id)) {
      return;
    }

    const file = files[tantangan.id];
    if (!file) {
      alert('Silakan pilih foto terlebih dahulu!');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Anda harus login terlebih dahulu!');
      return;
    }

    setUploadingId(tantangan.id);

    const formData = new FormData();
    formData.append('tantangan_id', tantangan.id.toString());
    formData.append('poin', tantangan.poin.toString());
    formData.append('foto', file);

    try {
      const res = await fetch('http://localhost:8081/api/tantangan/selesai', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Upload gagal');
      }

      await res.json();
      
      setCompleted((prev) => [...prev, tantangan.id]);
      setTotalPoin((prev) => prev + tantangan.poin);

      if (previews[tantangan.id]) {
        try {
          URL.revokeObjectURL(previews[tantangan.id]);
        } catch {}
      }
      
      setFiles((prev) => ({ ...prev, [tantangan.id]: null }));
      setPreviews((p) => ({ ...p, [tantangan.id]: '' }));

      alert('Tantangan berhasil diselesaikan!');
    } catch (err) {
      console.error(err);
      alert('Gagal mengupload foto. Silakan coba lagi.');
    } finally {
      setUploadingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl font-bold text-gray-800">Tantangan Mingguan</h1>
          </div>
          <div className="text-2xl font-semibold text-green-600">
            Total Poin Anda: {totalPoin}
          </div>
          {!isAdmin && (
            <div className="mt-3 text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded p-3">
              ℹ️ Hanya admin yang dapat menandai tantangan selesai.
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Leaderboard Section */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-bold text-gray-800">Leaderboard Top 5</h2>
              </div>
              <div className="space-y-2">
                {leaderboard.slice(0, 5).map((user, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          idx === 0
                            ? 'bg-yellow-500'
                            : idx === 1
                            ? 'bg-gray-400'
                            : idx === 2
                            ? 'bg-orange-600'
                            : 'bg-gray-300'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span className="font-medium text-gray-700">{user.username}</span>
                    </div>
                    <span className="font-bold text-green-600">{user.poin}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tantangan Section */}
          <div className="md:col-span-2 space-y-4">
            {tasks.map((t, idx) => (
              <div
                key={t.id}
                className={`bg-white rounded-lg shadow-md p-6 transition ${
                  completed.includes(t.id) ? 'opacity-60 bg-green-50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={completed.includes(t.id)}
                    readOnly
                    className="w-5 h-5 mt-1 accent-green-600 rounded cursor-pointer"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {idx + 1}. {t.judul}
                    </h3>
                    <p className="text-gray-600 mb-3">{t.deskripsi}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                        Poin: {t.poin}
                      </span>
                      <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                        {t.tingkat_kesulitan}
                      </span>
                    </div>

                    {!completed.includes(t.id) && (
                      <div className="border-t pt-4">
                        <label className="block mb-2 font-medium text-gray-700">
                          <Camera className="w-4 h-4 inline mr-1" />
                          Upload Foto:
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, t.id)}
                          disabled={!isAdmin || completed.includes(t.id)}
                          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        
                        {previews[t.id] && (
                          <div className="mt-3">
                            <img
                              src={previews[t.id]}
                              alt="Preview"
                              className="max-w-xs rounded-lg shadow-md"
                            />
                          </div>
                        )}

                        {files[t.id] && (
                          <button
                            onClick={() => handleUpload(t)}
                            disabled={!isAdmin || uploadingId === t.id}
                            className="mt-3 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            {uploadingId === t.id ? 'Mengupload...' : 'Upload & Selesai'}
                          </button>
                        )}
                      </div>
                    )}

                    {completed.includes(t.id) && (
                      <div className="border-t pt-4">
                        <div className="flex items-center gap-2 text-green-600 font-medium">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Tantangan Selesai
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {tasks.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
                Tidak ada tantangan hari ini
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}