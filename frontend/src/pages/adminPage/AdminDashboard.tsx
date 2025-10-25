import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/adminPage/AdminNavbar';
import { useUser } from '../../contexts/UserContext';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<{ username?: string; email?: string }>({});
  const navigate = useNavigate();
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchAllData();
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
      const resLaporan = await fetch('http://localhost:8081/api/laporan/all', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });

      if (resLaporan.status === 401) {
        navigate('/login');
        return;
      }

      const dataLaporan = await resLaporan.json();
      setLaporan(Array.isArray(dataLaporan) ? dataLaporan : []);

      const resUser = await fetch(`http://localhost:8081/api/user/all?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });

      const dataUser = await resUser.json();
      setUsers(Array.isArray(dataUser) ? dataUser : []);

      const resForum = await fetch(`http://localhost:8081/api/forum?t=${Date.now()}`, {
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

  const { user: ctxUser } = useUser();

  useEffect(() => {
    if (ctxUser) setProfile({ username: ctxUser.username, email: ctxUser.email });
  }, [ctxUser]);

  // Accessibility: trap focus inside drawer and close on Escape
  useEffect(() => {
    if (!sidebarOpen) return;

    // focus close button when drawer opens
    setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 0);

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
        hamburgerRef.current?.focus();
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  async function updateStatus(id: number, status: string) {
    setPesan('');
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:8081/api/laporan/update', {
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
    const res = await fetch('http://localhost:8081/api/laporan/delete', {
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
    const res = await fetch('http://localhost:8081/api/forum/delete', {
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

  return (
    <div className="bg-white min-h-screen flex overflow-hidden">
      {/* Sidebar for large screens */}
      <aside className="hidden lg:flex w-64 bg-white h-screen flex-shrink-0 shadow-lg">
        <div className="h-full flex flex-col overflow-hidden">
          <AdminNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </aside>

  <main aria-hidden={sidebarOpen} className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-10 py-5">
        {/* Top compact header for small screens with hamburger */}
        <div className="lg:hidden mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button ref={hamburgerRef} aria-label="Open menu" aria-expanded={sidebarOpen} onClick={() => setSidebarOpen(true)} className="p-2 rounded-md bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="font-semibold text-lg">Dashboard Admin</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-700">{profile.username || '...'}</div>
          </div>
        </div>

        {/* Mobile drawer overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50">
              <div className="absolute inset-0 bg-black opacity-40" onClick={() => setSidebarOpen(false)} />
              <div ref={drawerRef} role="dialog" aria-modal="true" aria-label="Sidebar menu" className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-lg p-4 overflow-auto">
                <div className="flex justify-end mb-4">
                  <button ref={closeBtnRef} onClick={() => setSidebarOpen(false)} aria-label="Close menu" className="p-1">
                    ×
                  </button>
                </div>
                <AdminNavbar activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); setSidebarOpen(false); }} username={profile.username} email={profile.email} />
              </div>
          </div>
        )}
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
                  {/* Table for large screens */}
                  <div className="hidden lg:block overflow-x-auto rounded-lg shadow">
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

                  {/* Cards for small/mobile screens */}
                  <div className="block lg:hidden space-y-4">
                    {laporan.length === 0 ? (
                      <div className="text-center text-gray-500 py-4">Belum ada laporan.</div>
                    ) : (
                      laporan.map((l) => (
                        <div key={l.id} className="bg-white rounded-lg shadow p-4 border">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-sm font-semibold">{l.judul}</div>
                              <div className="text-xs text-gray-600">{l.deskripsi.substring(0, 100)}...</div>
                              <div className="text-xs text-gray-500 mt-2">Lokasi: {l.lokasi}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-500">ID: {l.id}</div>
                              <div className="mt-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${l.status === 'Selesai' ? 'bg-green-100 text-green-800' : l.status === 'Diproses' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{l.status}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
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

                          <div className="mt-3 flex gap-2">
                            <button
                              className={`bg-yellow-500 text-white px-3 py-1 rounded text-sm ${l.status === 'Diproses' || l.status === 'Selesai' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-yellow-600'}`}
                              onClick={() => updateStatus(l.id, 'Diproses')}
                              disabled={l.status === 'Diproses' || l.status === 'Selesai'}
                            >
                              Proses
                            </button>
                            <button
                              className={`bg-green-600 text-white px-3 py-1 rounded text-sm ${l.status === 'Selesai' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-green-700'}`}
                              onClick={() => updateStatus(l.id, 'Selesai')}
                              disabled={l.status === 'Selesai'}
                            >
                              Selesai
                            </button>
                            <button className="bg-red-600 text-white px-3 py-1 rounded text-sm cursor-pointer hover:bg-red-700" onClick={() => deleteLaporan(l.id)}>
                              Hapus
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Daftar User</h3>
                  <div className="hidden lg:block overflow-x-auto rounded-lg shadow">
                    <table className="min-w-full bg-white rounded-lg">
                      <thead>
                        <tr>
                          <th className="bg-[#25E82F] text-white px-4 py-2 text-left rounded-tl-lg">ID</th>
                          <th className="bg-[#25E82F] text-white px-4 py-2 text-left">Email</th>
                          <th className="bg-[#25E82F] text-white px-4 py-2 text-left">Username</th>
                          <th className="bg-[#25E82F] text-white px-4 py-2 text-left">Role</th>
                          <th className="bg-[#25E82F] text-white px-4 py-2 text-left rounded-tr-lg">Poin</th>
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
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>{u.role}</span>
                              </td>
                              <td className="px-4 py-3">{u.poin}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="block lg:hidden space-y-4">
                    {users.length === 0 ? (
                      <div className="text-center text-gray-500 py-4">Belum ada user.</div>
                    ) : (
                      users.map((u) => (
                        <div key={u.id} className="bg-white rounded-lg shadow p-4 border">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-semibold">{u.username}</div>
                              <div className="text-xs text-gray-600">{u.email}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-500">ID: {u.id}</div>
                              <div className="mt-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>{u.role}</span>
                              </div>
                              <div className="text-sm mt-2">Poin: {u.poin}</div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Forums Tab */}
              {activeTab === 'forums' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Daftar Forum</h3>
                  <div className="hidden lg:block overflow-x-auto rounded-lg shadow">
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
                                <button className="bg-red-600 text-white px-2 py-1 rounded text-xs cursor-pointer" onClick={() => deleteForum(f.id)}>
                                  Hapus
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="block lg:hidden space-y-4">
                    {forums.length === 0 ? (
                      <div className="text-center text-gray-500 py-4">Belum ada forum.</div>
                    ) : (
                      forums.map((f) => (
                        <div key={f.id} className="bg-white rounded-lg shadow p-4 border">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-sm font-semibold">{f.judul}</div>
                              <div className="text-xs text-gray-600">oleh {f.user}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-500">ID: {f.id}</div>
                              <div className="text-xs mt-1">{new Date(f.created_at).toLocaleDateString()}</div>
                            </div>
                          </div>

                          <div className="mt-3">
                            <button className="bg-red-600 text-white px-3 py-1 rounded text-sm cursor-pointer" onClick={() => deleteForum(f.id)}>
                              Hapus
                            </button>
                          </div>
                        </div>
                      ))
                    )}
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
