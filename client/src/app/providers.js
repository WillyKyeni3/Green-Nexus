// client/src/app/providers.js
'use client'; // Mark as a client component

import { AuthProvider } from '../context/AuthContext'; // Adjust path as needed

export function Providers({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}