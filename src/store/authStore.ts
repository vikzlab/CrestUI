import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  name: string;
  email: string;
  role: string;
  initials: string;
}

interface AuthState {
  user: AuthUser | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

// Demo credentials — in production replace with real JWT auth
const DEMO_USERS: Record<string, { password: string; user: AuthUser }> = {
  'analyst@crestdata.com': {
    password: 'CrestSOC2026',
    user: { name: 'SOC Analyst', email: 'analyst@crestdata.com', role: 'Analyst', initials: 'SA' },
  },
  'admin@crestdata.com': {
    password: 'CrestSOC2026',
    user: { name: 'SOC Admin', email: 'admin@crestdata.com', role: 'Admin', initials: 'AD' },
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (email, password) => {
        const entry = DEMO_USERS[email.toLowerCase().trim()];
        if (!entry) return { success: false, error: 'No account found with that email' };
        if (entry.password !== password) return { success: false, error: 'Incorrect password' };
        set({ user: entry.user });
        return { success: true };
      },
      logout: () => set({ user: null }),
    }),
    { name: 'soc_auth' },
  ),
);
