import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/adminPage/AdminNavbar';

type Laporan = {
  id: number;
  user_id: number;
  judul: string;
  deskripsi: string;
  foto_url: string;
  video_url: string;
  lokasi: string;
  status: string;
  created_at: string;
};

type User = {
  id: number;
  email: string;
  username: string;
  role: string;
  poin: number;
};

type Forum = {
  id: number;
  judul: string;
  user: string;
  created_at: string;
};

export default function AdminDashboard() {
    // Fungsi hapus user
    async function handleDeleteUser(id: number) {
      setPesan('');
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/user/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      const data = await parseResponse(res);
      if (!res.ok) {
        const msg = typeof data === 'object' && data !== null && typeof (data as { message?: unknown }).message === 'string' ? (data as { message: string }).message : typeof data === 'string' ? data : 'Gagal hapus user';
        setPesan(msg);
        return;
      }
      setPesan('User berhasil dihapus');
      fetchAllData();
    }

    // Fungsi hapus forum
    async function deleteForum(id: number) {
      setPesan('');
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/forum/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      const data = await parseResponse(res);
      if (!res.ok) {
        const msg = typeof data === 'object' && data !== null && typeof (data as { message?: unknown }).message === 'string' ? (data as { message: string }).message : typeof data === 'string' ? data : 'Gagal hapus forum';
        setPesan(msg);
        return;
      }
      setPesan('Forum berhasil dihapus');
      fetchAllData();
    }

    // Fungsi hapus laporan
    async function deleteLaporan(id: number) {
      setPesan('');
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/laporan/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      const data = await parseResponse(res);
      if (!res.ok) {
        const msg = typeof data === 'object' && data !== null && typeof (data as { message?: unknown }).message === 'string' ? (data as { message: string }).message : typeof data === 'string' ? data : 'Gagal hapus laporan';
        setPesan(msg);
        return;
      }
      setPesan('Laporan berhasil dihapus');
      fetchAllData();
    }
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [forums, setForums] = useState<Forum[]>([]);
  const [pesan, setPesan] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('laporan');
  const [role, setRole] = useState<string>('');
  
  const [editUsername, setEditUsername] = useState('');
  const [editRole, setEditRole] = useState('user');
  const [showMiniTab, setShowMiniTab] = useState<number | null>(null);
  const [openedForum, setOpenedForum] = useState<Forum | null>(null);
  const [forumMessages, setForumMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [showDeleteUserOverlay, setShowDeleteUserOverlay] = useState<{ id: number, username: string } | null>(null);
  const [showDeleteForumOverlay, setShowDeleteForumOverlay] = useState<{ id: number, judul: string } | null>(null);
  const [showDeleteLaporanOverlay, setShowDeleteLaporanOverlay] = useState<{ id: number, judul: string } | null>(null);
  // Robust response parser: try res.json(), fallback to text when JSON parsing fails
  async function parseResponse(res: Response): Promise<unknown> {
    try {
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        try {
          return await res.json();
        } catch {
          // If res.json() fails (malformed JSON), try reading text and parsing manually
          const txt = await res.text();
          try {
            return JSON.parse(txt);
          } catch {
            return txt;
          }
        }
      }
      // Not JSON according to header -> try text, and attempt JSON.parse anyway
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    } catch {
      try {
        return await res.text();
      } catch {
        return null;
      }
    }
  }

  useEffect(() => {
    fetchAllData();
    const storedRole = localStorage.getItem('role');
    setRole(storedRole || '');
    // eslint-disable-next-line
  }, []);

  async function fetchAllData() {
    setLoading(true);
    setPesan('');
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const resLaporan = await fetch(`${API_BASE_URL}/api/laporan/all`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      if (resLaporan.status === 401) {
        navigate('/login');
        return;
      }
      const dataLaporan = await parseResponse(resLaporan);
      setLaporan(Array.isArray(dataLaporan) ? dataLaporan : []);

      const resUser = await fetch(`${API_BASE_URL}/api/user/all?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      const dataUser = await parseResponse(resUser);
      setUsers(Array.isArray(dataUser) ? dataUser : []);

      const resForum = await fetch(`${API_BASE_URL}/api/forum?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      const dataForum = await parseResponse(resForum);
      setForums(Array.isArray(dataForum) ? dataForum : []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setPesan('Gagal mengambil data dari server');
    }
    setLoading(false);
  }

  async function updateStatus(id: number, status: string) {
    setPesan('');
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/api/laporan/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, status }),
    });
    const data = await parseResponse(res);
    if (!res.ok) {
      const msg = typeof data === 'object' && data !== null && typeof (data as { message?: unknown }).message === 'string' ? (data as { message: string }).message : typeof data === 'string' ? data : 'Gagal update status';
      setPesan(msg);
      return;
    }
    setPesan('Status berhasil diupdate');
    fetchAllData();
  }
 


  async function handleSaveEditUser(id: number) {
    setPesan('');
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/api/user/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, username: editUsername, role: editRole }),
    });
    const data = await parseResponse(res);
    if (!res.ok) {
      const msg = typeof data === 'object' && data !== null && typeof (data as { message?: unknown }).message === 'string' ? (data as { message: string }).message : typeof data === 'string' ? data : 'Gagal update user';
      setPesan(msg);
      return;
    }
    setPesan('User berhasil diupdate');
    fetchAllData();
  }

  // Fungsi untuk menampilkan overlay
  function handleShowOverlay(userId: number) {
    setShowMiniTab(userId);
  }

  // Fungsi untuk menyembunyikan overlay
  function handleHideOverlay() {
    setShowMiniTab(null);
  }

  // Tambahkan fungsi untuk membuka forum
  async function handleOpenForum(forumId: number) {
    const token = localStorage.getItem('token');
    try {
      const forum = forums.find(f => f.id === forumId) || null;
      setOpenedForum(forum);

      // Ubah endpoint di sini
      const res = await fetch(`${API_BASE_URL}/api/forum/${forumId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await parseResponse(res);
      // Type assertion agar TypeScript tahu bentuk data
      const forumData = data as { comments?: any[] };
      setForumMessages(Array.isArray(forumData.comments) ? forumData.comments : []);
    } catch (err) {
      setPesan('Gagal memuat forum');
    }
  }

  

  async function handleSendMessage() {
    if (!openedForum || !newMessage.trim()) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/api/forum/${openedForum.id}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isi: newMessage }),
    });
    if (res.ok) {
      setNewMessage('');
      // Tambahkan ini agar komentar langsung ter-refresh
      await handleOpenForum(openedForum.id);
    } else {
      setPesan('Gagal mengirim pesan');
    }
  }

  return (
    <div className="bg-white h-screen flex overflow-hidden">
      <aside className="w-76 bg-white h-screen flex-shrink-0 shadow-lg">
        <div className="h-full flex flex-col overflow-hidden">
          <AdminNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto px-10 py-5">
        <div className="py-10">
          <h2 className="text-22 font-bold mb-4">Dashboard Admin</h2>
          {pesan && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{pesan}</div>}

          {showDeleteUserOverlay && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full flex flex-col items-center">
                <h3 className="text-lg font-bold mb-4 text-center">Konfirmasi Hapus User</h3>
                <p className="mb-4 text-center">
                  Yakin ingin menghapus user <span className="font-semibold">{showDeleteUserOverlay.username}</span>?<br />
                  Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex gap-2">
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded-2xl border-2 border-gray-300"
                    onClick={async () => {
                      await handleDeleteUser(showDeleteUserOverlay.id);
                      setShowDeleteUserOverlay(null);
                    }}
                  >
                    Yes
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-2xl border-2 border-gray-300"
                    onClick={() => setShowDeleteUserOverlay(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {showDeleteForumOverlay && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full flex flex-col items-center">
                <h3 className="text-lg font-bold mb-2 text-center">Konfirmasi Hapus Forum</h3>
                <p className="mb-4 text-center">
                  Yakin ingin menghapus forum <span className="font-semibold">{showDeleteForumOverlay.judul}</span>? <br />
                  Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex gap-3">
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded-2xl border-2 border-gray-300"
                    onClick={async () => {
                      await deleteForum(showDeleteForumOverlay.id);
                      setShowDeleteForumOverlay(null);
                    }}
                  >
                    Yes
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-2xl border-2 border-gray-300"
                    onClick={() => setShowDeleteForumOverlay(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {showDeleteLaporanOverlay && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full flex flex-col items-center">
                <h3 className="text-lg font-bold mb-4 text-center">Konfirmasi Hapus Laporan</h3>
                <p className="mb-4 text-center">
                  Yakin ingin menghapus laporan <span className="font-semibold">{showDeleteLaporanOverlay.judul}</span>?<br />
                  Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex gap-2">
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded-2xl border-2 border-gray-300"
                    onClick={async () => {
                      await deleteLaporan(showDeleteLaporanOverlay.id);
                      setShowDeleteLaporanOverlay(null);
                    }}
                  >
                    Yes
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-2xl border-2 border-gray-300"
                    onClick={() => setShowDeleteLaporanOverlay(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {loading ? (
            <div className="text-center text-gray-500 py-8">Memuat data...</div>
          ) : (
            <>
              {/* Laporan Tab */}
              {activeTab === 'laporan' && (
                <div>
                  <h3 className="text-2 font-semibold mb-4">Daftar Laporan</h3>
                  <div className="overflow-x-auto rounded-lg shadow">
                    <table className="min-w-full bg-white rounded-lg">
                      <thead>
                        <tr>
                          <th className="bg-[#25E82F] text-white px-4 py-2 text-left rounded-tl-lg">ID</th>
                          <th className="bg-[#25E82F] text-white px-4 py-2 text-left">User ID</th>
                          <th className="bg-[#25E82F] text-white px-4 py-2 text-left">Judul</th>
                          <th className="bg-[#25E82F] text-white px-4 py-2 text-left">Status</th>
                          <th className="bg-[#25E82F] text-white px-4 py-2 text-left rounded-tr-lg">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {laporan.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center text-gray-500 py-4">
                              Belum ada laporan.
                            </td>
                          </tr>
                        ) : (
                          laporan.map((l) => (
                            <tr key={l.id} className="border-t hover:bg-gray-50">
                              <td className="px-4 py-3">{l.id}</td>
                              <td className="px-4 py-3">{l.user_id}</td>
                              <td className="px-4 py-3">
                                <div className="font-semibold">{l.judul}</div>
                                <div className="text-xs text-gray-600">{l.deskripsi.substring(0, 50)}...</div>
                                <div className="flex gap-2 mt-1">
                                  {l.foto_url && (
                                    <a href={l.foto_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600">
                                      Lihat Foto
                                    </a>
                                  )}
                                  {l.video_url && (
                                    <a href={l.video_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600">
                                      Lihat Video
                                    </a>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{l.lokasi}</div>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${l.status === 'Selesai' ? 'bg-green-100 text-green-800' : l.status === 'Diproses' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}
                                >
                                  {l.status}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  <button
                                    className={`bg-yellow-500 text-white px-2 py-1 rounded text-xs ${l.status === 'Diproses' || l.status === 'Selesai' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-yellow-600'}`}
                                    onClick={() => updateStatus(l.id, 'Diproses')}
                                    disabled={l.status === 'Diproses' || l.status === 'Selesai'}
                                  >
                                    Proses
                                  </button>
                                  <button
                                    className={`bg-green-600 text-white px-2 py-1 rounded text-xs ${l.status === 'Selesai' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-green-700'}`}
                                    onClick={() => updateStatus(l.id, 'Selesai')}
                                    disabled={l.status === 'Selesai'}
                                  >
                                    Selesai
                                  </button>
                                  <button className="bg-red-600 text-white px-2 py-1 rounded text-xs cursor-pointer hover:bg-red-700" onClick={() => setShowDeleteLaporanOverlay({ id: l.id, judul: l.judul })}>
                                    Hapus
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Daftar User</h3>
                  <div className="overflow-x-auto rounded-lg shadow">
                    <table className="min-w-full bg-white rounded-lg">
                      <thead>
                        <tr>
                          <th className="bg-[#25E82F] text-white px-4 py-2 text-left rounded-tl-lg">ID</th>
                          <th className="bg-[#25E82F] text-white px-4 py-2 text-left">Email</th>
                          <th className="bg-[#25E82F] text-white px-4 py-2 text-left">Username</th>
                          <th className="bg-[#25E82F] text-white px-4 py-2 text-left">Role</th>
                          <th className="bg-[#25E82F] text-white px-4 py-2 text-left">Poin</th>
                          <th className="bg-[#25E82F] text-white px-4 py-2 text-left rounded-tr-lg">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center text-gray-500 py-4">
                              Belum ada user.
                            </td>
                          </tr>
                        ) : (
                          users.map((u) => (
                            <tr key={u.id} className="border-t hover:bg-gray-50">
                              <td className="px-4 py-3">{u.id}</td>
                              <td className="px-4 py-3">{u.email}</td>
                              <td className="px-4 py-3">{u.username}</td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                  }`}
                                >
                                  {u.role}
                                </span>
                              </td>
                              <td className="px-4 py-3">{u.poin}</td>
                              <td className="px-4 py-3">
                                {showMiniTab === u.id ? (
                                  <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                                    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full">
                                      <h3 className="text-lg font-bold mb-4">Edit User</h3>
                                      <input
                                        type="text"
                                        className="border rounded px-2 py-1 text-sm mb-4 w-full"
                                        placeholder="Ganti Username"
                                        value={editUsername}
                                        onChange={(e) => setEditUsername(e.target.value)}
                                      />
                                      <select
                                        className="border rounded px-2 py-1 text-sm mb-4 w-full"
                                        value={editRole}
                                        onChange={(e) => setEditRole(e.target.value)}
                                      >
                                        <option value="user">user</option>
                                        <option value="admin">admin</option>
                                      </select>
                                      <div className="flex justify-end gap-2">
                                        <button
                                          className="W-Full bg-red-600 text-white px-4 py-2 rounded-2xl text-sm hover:bg-red-700 border-2 border-gray-300"
                                          onClick={() => setShowDeleteUserOverlay({ id: u.id, username: u.username })}
                                        >
                                          Hapus User
                                        </button>
                                        <button
                                          className="W-Full bg-[#C4C7C1] text-black px-4 py-2 rounded-2xl text-sm hover:bg-gray-700 border-2 border-gray-300"
                                          onClick={handleHideOverlay}
                                        >
                                          Batal
                                        </button>
                                        <button
                                          className="bg-[#32C439] text-white px-4 py-2 rounded-2xl text-sm hover:bg-green-700 border-2 border-gray-300"
                                          onClick={() => handleSaveEditUser(u.id)}
                                        >
                                          Konfirmasi
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600"
                                    onClick={() => handleShowOverlay(u.id)}
                                  >
                                    Edit
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Forums Tab */}
              {activeTab === 'forums' && (
                <div>
                  <h3 className="text-2 font-semibold mb-4">Daftar Forum</h3>
                  <div className="overflow-x-auto rounded-lg shadow">
                    <table className="min-w-full bg-white rounded-lg">
                      <thead>
                        <tr>
                          <th className="bg-[#25E82F] text-white px-4 py-2 text-left rounded-tl-lg">ID</th>
                          <th className="bg-[#25E82F] text-white px-4 py-2 text-left">Judul</th>
                          <th className="bg-[#25E82F] text-white px-4 py-2 text-left">Author</th>
                          <th className="bg-[#25E82F] text-white px-4 py-2 text-left">Tanggal</th>
                          <th className="bg-[#25E82F] text-white px-4 py-2 text-left rounded-tr-lg">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {forums.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center text-gray-500 py-4">
                              Belum ada forum.
                            </td>
                          </tr>
                        ) : (
                          forums.map((f) => (
                            <tr key={f.id} className="border-t hover:bg-gray-50">
                              <td className="px-4 py-3">{f.id}</td>
                              <td className="px-4 py-3 font-medium">{f.judul}</td>
                              <td className="px-4 py-3">{f.user}</td>
                              <td className="px-4 py-3">{new Date(f.created_at).toLocaleDateString()}</td>
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  <button
                                    className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                                    onClick={() => handleOpenForum(f.id)}
                                  >
                                    Open
                                  </button>
                                  {role === 'admin' && (
                                    <button
                                      className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                                      onClick={() => setShowDeleteForumOverlay({ id: f.id, judul: f.judul })}
                                    >
                                      Hapus
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {openedForum && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow">
                  <h4 className="text-lg font-bold mb-2">{openedForum.judul}</h4>
                  <div className="text-sm text-gray-600 mb-4">Author: {openedForum.user}</div>
                  <div className="mb-4">
                    <h5 className="font-semibold mb-2">Pesan Forum:</h5>
                    <div className="space-y-2">
                      {forumMessages.length === 0 ? (
                        <div className="text-gray-500">Belum ada pesan.</div>
                      ) : (
                        forumMessages.map((msg, idx) => (
                          <div key={idx} className="bg-white p-2 rounded border">
                            <div className="font-bold">{msg.user}</div>
                            <div>{msg.isi}</div>
                            <div className="text-xs text-gray-400">{msg.created_at && new Date(msg.created_at).toLocaleString()}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <input
                      type="text"
                      className="border rounded px-2 py-1 flex-1"
                      placeholder="Tulis pesan..."
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                    />
                    <button
                      className="bg-blue-600 text-white px-4 py-1 rounded"
                      onClick={handleSendMessage}
                    >
                      Kirim
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
