import { createContext, useContext } from 'react';

export type User = {
  username?: string;
  email?: string;
};

export type UserContextValue = {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

// Export the context so hooks/components can use it from a file that only exports
// non-component utilities (helps Fast Refresh stability when components are in
// separate files).
export const UserContext = createContext<UserContextValue>({ user: null, loading: true, refresh: async () => {} });

export function useUser() {
  return useContext(UserContext);
}

// no default export required
