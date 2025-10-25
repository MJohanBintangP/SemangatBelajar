import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ilustrasiRegister from '../assets/ilustrasilogin.svg';
import { ArrowLeftIcon } from '@phosphor-icons/react';

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:8081/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Gagal daftar');
        return;
      }
      navigate('/Login');
    } catch (err) {
      console.error(err);
      setError('Gagal koneksi ke server');
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <div className="flex justify-between items-center">
        <div className="flex flex-col px-32 md:px-20 lg:px-0">
          <div onClick={() => navigate('/')} className="bg-[#008207] w-fit p-3 rounded-full mb-10 cursor-pointer">
            <ArrowLeftIcon color="#ffffff" weight="bold" size={20} />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-[#004203] max-w-[400px]">Daftarkan akunmu di ECOSTEPS</h1>
          <p className="text-[#878787] mb-12 text-sm max-w-[400px]">Masukkan username,email dan password untuk membuat akun-mu.</p>
          <form onSubmit={handleSubmit} className="w-80">
            {error && <div className="mb-4 text-red-600">{error}</div>}
            <div className="mb-4">
              <h3 className="font-medium">Username</h3>
              <input type="text" placeholder="usernameExample" className="focus:outline-none w-full py-2 border-b-1 placeholder:text-[#D0D0D0]" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="mb-4">
              <h3 className="font-medium">Email</h3>
              <input type="email" placeholder="name@example.com" className="focus:outline-none w-full py-2 border-b-1 placeholder:text-[#D0D0D0]" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-8">
              <h3 className="font-medium">Password</h3>
              <input type="password" placeholder="passwordExample" className="focus:outline-none w-full py-2 border-b-1 placeholder:text-[#D0D0D0]" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <p className="text-sm text-[#454545] mb-8">
              Sudah punya akun?{' '}
              <span className="text-[#008207] hover:underline cursor-pointer" onClick={() => navigate('/Login')}>
                Masuk
              </span>
            </p>
            <button type="submit" className="cursor-pointer hover:bg-green-700 duration-200 transition-colors w-fit bg-[#25E82F] text-white px-8 py-2 rounded-full font-semibold">
              Daftar
            </button>
          </form>
        </div>

        <img className="hidden lg:block relative -right-25" src={ilustrasiRegister} alt="ilustrasiRegister" />
      </div>
    </div>
  );
}
