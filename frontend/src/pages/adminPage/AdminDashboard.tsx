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
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [forums, setForums] = useState<Forum[]>([]);
  const [pesan, setPesan] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('laporan');
  const [role, setRole] = useState<string>('');
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editRole, setEditRole] = useState('user');
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
      const dataLaporan = await resLaporan.json();
      setLaporan(Array.isArray(dataLaporan) ? dataLaporan : []);

      const resUser = await fetch(`${API_BASE_URL}/api/user/all?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      const dataUser = await resUser.json();
      setUsers(Array.isArray(dataUser) ? dataUser : []);

      const resForum = await fetch(`${API_BASE_URL}/api/forum?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      const dataForum = await resForum.json();
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
    const data = await res.json();
    if (!res.ok) {
      setPesan(data.message || 'Gagal update status');
      return;
    }
    setPesan('Status berhasil diupdate');
    fetchAllData();
  }

  async function deleteLaporan(id: number) {
    if (!window.confirm('Yakin ingin menghapus laporan ini?')) return;
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
    const data = await res.json();
    if (!res.ok) {
      setPesan(data.message || 'Gagal menghapus laporan');
      return;
    }
    setPesan('Laporan berhasil dihapus');
    fetchAllData();
  }

  async function deleteForum(id: number) {
    if (!window.confirm('Yakin ingin menghapus forum ini?')) return;
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
    const data = await res.json();
    if (!res.ok) {
      setPesan(data.message || 'Gagal menghapus forum');
      return;
    }
    setPesan('Forum berhasil dihapus');
    fetchAllData();
  }

  async function handleEditUser(u: User) {
    setEditUserId(u.id);
    setEditUsername(u.username);
    setEditRole(u.role);
  }

  function handleCancelEdit() {
    setEditUserId(null);
    setEditUsername('');
    setEditRole('user');
  }

  async function handleDeleteUser(id: number) {
    if (!window.confirm('Yakin ingin menghapus pengguna ini ?')) return;
    setPesan('');
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:8081/api/user/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (!res.ok) {
      setPesan(data.message || 'Gagal menghapus user');
      return;
    }
    setPesan('User berhasil dihapus');
    setEditUserId(null);
    fetchAllData();
  }

  async function handleSaveEditUser(id: number) {
    setPesan('');
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:8081/api/user/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, username: editUsername, role: editRole }),
    });
    const data = await res.json();
    if (!res.ok) {
      setPesan(data.message || 'Gagal update user');
      return;
    }
    setPesan('User berhasil diupdate');
    setEditUserId(null);
    fetchAllData();
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
          <h2 className="text-2xl font-bold mb-4">Dashboard Admin</h2>
          {pesan && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{pesan}</div>}
          {loading ? (
            <div className="text-center text-gray-500 py-8">Memuat data...</div>
          ) : (
            <>
              {/* Laporan Tab */}
              {activeTab === 'laporan' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Daftar Laporan</h3>
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
                                  <button className="bg-red-600 text-white px-2 py-1 rounded text-xs cursor-pointer hover:bg-red-700" onClick={() => deleteLaporan(l.id)}>
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
                              <td className="px-4 py-3">{editUserId === u.id ? <input type="text" className="border rounded px-2 py-1 text-sm" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} /> : u.username}</td>
                              <td className="px-4 py-3">
                                {editUserId === u.id ? (
                                  <select className="border rounded px-2 py-1 text-sm" value={editRole} onChange={(e) => setEditRole(e.target.value)}>
                                    <option value="user">user</option>
                                    <option value="admin">admin</option>
                                  </select>
                                ) : (
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>{u.role}</span>
                                )}
                              </td>
                              <td className="px-4 py-3">{u.poin}</td>
                              <td className="px-4 py-3">
                                {editUserId === u.id ? (
                                  <div className="flex gap-2">
                                    <button className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700" onClick={() => handleSaveEditUser(u.id)}>
                                      Simpan
                                    </button>
                                    <button className="bg-gray-400 text-white px-2 py-1 rounded text-xs hover:bg-gray-500" onClick={handleCancelEdit}>
                                      Batal
                                    </button>
                                    <button className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700" onClick={() => handleDeleteUser(u.id)}>
                                      Hapus
                                    </button>
                                  </div>
                                ) : (
                                  <button className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600" onClick={() => handleEditUser(u)}>
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
                  <h3 className="text-xl font-semibold mb-4">Daftar Forum</h3>
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
                                {role === 'admin' && (
                                  <button className="bg-red-600 text-white px-2 py-1 rounded text-xs cursor-pointer" onClick={() => deleteForum(f.id)}>
                                    Hapus
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
            </>
          )}
        </div>
      </main>
    </div>
  );
}
