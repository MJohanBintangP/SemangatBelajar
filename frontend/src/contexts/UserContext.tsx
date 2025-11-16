import React, { useEffect, useState } from 'react';
import { UserContext, type User as UserType, type UserContextValue } from './userContextImpl';

export function UserProvider({ children }: { children: React.ReactNode }) {
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
    fetchProfile();
  }, []);

  return <UserContext.Provider value={{ user, loading, refresh: fetchProfile } as UserContextValue}>{children}</UserContext.Provider>;
}
