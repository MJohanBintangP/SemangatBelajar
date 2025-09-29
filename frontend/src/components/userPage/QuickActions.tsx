import { Link } from 'react-router-dom';

export default function QuickActions() {
  return (
    <div className="flex flex-wrap gap-8 mb-8">
      <Link to="/Laporan" className="font-medium">
        <button className="cursor-pointer bg-white text-black px-6 py-4 rounded-xl shadow-md flex items-center">➕ Buat Laporan Baru</button>
      </Link>

      <Link to="/Tantangan" className="font-medium">
        <button className="bg-white cursor-pointer text-black px-6 py-4 rounded-xl shadow-md flex items-center">🎯 Ikuti Tantangan Hari Ini</button>
      </Link>
    </div>
  );
}
