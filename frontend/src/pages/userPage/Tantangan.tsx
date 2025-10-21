import { useEffect, useState } from 'react';
import ilustrasiRank from '../../assets/ilustrasiRank.svg';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  const extractUsername = (email: string): string => {
    const username = email.split('@')[0];
    return username.replace(/[^a-zA-Z0-9]/g, '');
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/tantangan/hari-ini`)
      .then((res) => res.json())
      .then((data) => setTasks(Array.isArray(data) ? data : []));

    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/api/user/poin`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTotalPoin(data.poin || 0));

    fetch(`${API_BASE_URL}/api/tantangan/selesai-hari-ini`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCompleted(Array.isArray(data) ? data : []));

    fetch(`${API_BASE_URL}/api/leaderboard`)
      .then((res) => res.json())
      .then((data) => {
        const processedData = Array.isArray(data)
          ? data.map((user) => ({
              ...user,
              username: user.username || extractUsername(user.email),
            }))
          : [];
        setLeaderboard(processedData);
      });
  }, []);

  function handleCheck(tantangan: Tantangan) {
    if (completed.includes(tantangan.id)) return;
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/api/tantangan/selesai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ tantangan_id: tantangan.id, poin: tantangan.poin }),
    })
      .then((res) => res.json())
      .then(() => {
        setCompleted((prev) => [...prev, tantangan.id]);
        setTotalPoin((prev) => prev + tantangan.poin);
      });
  }

  return (
    <div className="py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Tantangan</h1>
        <div className="bg-[#25E82F]/20 px-4 py-2 rounded-lg">
          <span className="font-medium">Total Poin Anda: </span>
          <span className="font-bold">{totalPoin}</span>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="mb-10">
        <div className="flex items-center mb-4">
          <span className="text-yellow-500 text-2xl mr-2">🏆</span>
          <h2 className="text-xl font-semibold">Leaderboard top 5</h2>
        </div>

        <div className="bg-[#25E82F]/9 rounded-3xl p-6 flex relative overflow-hidden">
          <div className="z-10">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="pb-4 pr-6">Rank</th>
                  <th className="pb-4 pr-6">Nama</th>
                  <th className="pb-4">Poin</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((user, idx) => (
                  <tr key={user.email} className="h-10">
                    <td className="font-medium pr-20">{idx + 1}</td>
                    <td className="font-medium pr-20">{user.username}</td>
                    <td className="font-medium">{user.poin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="absolute right-12 -bottom-5 h-full flex items-end">
            <img
              src={ilustrasiRank}
              alt="Leaderboard"
              className="w-80 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>

      {/* Tantangan Harian Section */}
      <div>
        <div className="flex items-center mb-4">
          <span className="text-red-500 text-2xl mr-2">🎯</span>
          <h2 className="text-xl font-semibold">Tantangan Harian</h2>
        </div>

        <div className="space-y-4">
          {tasks.map((t, idx) => (
            <div key={t.id} className="bg-white rounded-xl p-6 drop-shadow-md border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="mt-8 mr-3">
                  <input type="checkbox" checked={completed.includes(t.id)} onChange={() => handleCheck(t)} className="w-5 h-5 accent-green-600 rounded cursor-pointer" disabled={completed.includes(t.id)} />
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg mb-1">
                    {idx + 1}. {t.judul}
                  </h3>
                  <p className="text-gray-700 mb-2">{t.deskripsi}</p>
                  <p className="text-sm">
                    Poin: <span className="font-medium">{t.poin}</span> ({t.tingkat_kesulitan})
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
