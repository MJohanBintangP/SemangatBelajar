import { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { UserContext } from './userContextImpl';
import type { User as UserType, UserContextValue } from './userContextImpl';

export function UserProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile() {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:8081/api/user/profile', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        setUser(null);
      } else {
        const data = await res.json();
        setUser({ username: data.username, email: data.email });
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchProfile();
  }, []);

  const value: UserContextValue = {
    user,
    loading,
    refresh: fetchProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserProvider;
