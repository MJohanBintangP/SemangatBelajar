import { useEffect, useState } from 'react';
import ilustrasiEmpty from '../../assets/ilustrasiEmpty.svg';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8081';

type ForumPost = {
  id: number;
  user: string;
  judul: string;
  isi: string;
  created_at: string;
  comments: ForumComment[];
};

type ForumComment = {
  id: number;
  user: string;
  isi: string;
  created_at: string;
};

export default function Forum() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [commentIsi, setCommentIsi] = useState<{ [key: number]: string }>({});
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchForum();
  }, []);

  function fetchForum() {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/forum`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setPosts([]);
        setLoading(false);
      });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!judul.trim() || !isi.trim()) {
      setError('Judul dan isi forum wajib diisi.');
      return;
    }
    try {
      if (!token) {
        setError('Anda harus login untuk membuat forum.');
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/forum`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ judul, isi }),
      });

      const txt = await res.text();
      let data: any = {};
      try {
        data = txt ? JSON.parse(txt) : {};
      } catch {
        data = { message: txt };
      }

      if (!res.ok) {
        setError(data?.message || 'Gagal membuat forum.');
        return;
      }
      setJudul('');
      setIsi('');
      setShowModal(false);
      setSuccess('Forum berhasil dibuat!');
      fetchForum();
    } catch {
      setError('Gagal koneksi ke server.');
    }
  }

  async function handleComment(postId: number) {
    if (!commentIsi[postId] || !commentIsi[postId].trim()) return;
    if (!token) {
      setError('Anda harus login untuk mengomentari.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/forum/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isi: commentIsi[postId] }),
      });

      if (!res.ok) {
        const txt = await res.text();
        try {
          const d = txt ? JSON.parse(txt) : {};
          setError(d?.message || 'Gagal mengirim komentar.');
        } catch {
          setError(txt || 'Gagal mengirim komentar.');
        }
        return;
      }
    } catch (err) {
      setError('Gagal koneksi ke server.');
      return;
    }
    setCommentIsi((prev) => ({ ...prev, [postId]: '' }));
    fetchForum();
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('id-ID')} ${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
  }

  return (
    <div className="py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Forum</h1>
        <button className="cursor-pointer bg-white text-black px-3 sm:px-6 py-3 rounded-xl font-semibold shadow-md flex items-center" onClick={() => setShowModal(true)}>
          <span>+ Buat forum baru</span>
        </button>
      </div>

      {/* Success message */}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{success}</div>}

      {/* Tambah Forum */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Buat Forum Baru</h3>
            {error && <div className="mb-2 text-red-600">{error}</div>}
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Judul forum" className="w-full mb-3 p-3 border border-gray-200 rounded-lg" value={judul} onChange={(e) => setJudul(e.target.value)} required />
              <textarea placeholder="Isi forum" className="w-full mb-8 p-3 border border-gray-200 rounded-lg min-h-[120px]" value={isi} onChange={(e) => setIsi(e.target.value)} required />
              <div className="flex gap-3 justify-end mb-2">
                <button type="button" className="cursor-pointer px-3 sm:px-6 py-2 border border-gray-200 rounded-lg" onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button type="submit" className="bg-[#25E82F] cursor-pointer font-medium text-white px-4 py-2 rounded-lg">
                  Buat Forum
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Memuat data...</div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg py-16">
            <img src={ilustrasiEmpty} alt="Forum kosong" className="w-80 max-w-full mb-6" />
            <div className="text-2xl font-bold mb-2">Forum kosong</div>
            <div className="text-gray-500 text-lg text-center">Buat forum pertamamu terlebih dahulu!</div>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white p-8 rounded-2xl drop-shadow-lg ">
              <h2 className="text-lg font-semibold mb-2">"{post.judul}"</h2>
              <p className="text-gray-700 mb-2">{post.isi}</p>
              <p className="text-sm text-gray-500 mb-4">
                oleh: <span className="font-medium">{post.user}</span> | {formatDate(post.created_at)}
              </p>

              <div className="mt-4">
                <h3 className="font-medium mb-2">Komentar terbaru:</h3>
                {(post.comments ?? []).length === 0 ? (
                  <p className="text-gray-400 text-sm mb-3">Belum ada komentar.</p>
                ) : (
                  <div className="space-y-2 mb-3">
                    {(post.comments ?? []).map((comment) => (
                      <div key={comment.id} className="text-sm">
                        <span className="font-medium">@{comment.user}:</span> {comment.isi}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex mt-2 gap-6">
                  <input type="text" placeholder="Tulis komentar..." className="flex-1 shadow-md rounded-lg p-2" value={commentIsi[post.id] || ''} onChange={(e) => setCommentIsi((prev) => ({ ...prev, [post.id]: e.target.value }))} />
                  <button className="bg-[#25E82F] cursor-pointer text-white px-3 sm:px-6 py-2 rounded-lg" onClick={() => handleComment(post.id)} disabled={!commentIsi[post.id]}>
                    Kirim
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
