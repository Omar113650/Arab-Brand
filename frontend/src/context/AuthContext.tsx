import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

interface User { id: string; email: string; name?: string; }
interface AuthCtx {
  user: User | null;
  loading: boolean;
  setUser: (u: User | null) => void;
}

const AuthContext = createContext<AuthCtx>({ user: null, loading: true, setUser: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(data => setUser(data?.user ?? null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);