import React, { createContext, useContext, useEffect, useState } from 'react';

type User = {
  username?: string;
  email?: string;
};

type UserContextValue = {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const UserContext = createContext<UserContextValue>({ user: null, loading: true, refresh: async () => {} });

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
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
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  return <UserContext.Provider value={{ user, loading, refresh: fetchProfile }}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
