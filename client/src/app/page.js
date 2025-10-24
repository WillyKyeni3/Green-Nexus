'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to landing page on load
    router.push('/landingpage');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">GN</span>
        </div>
        <h1 className="text-2xl font-semibold text-emerald-800 mb-2">Welcome to Green-Nexus</h1>
        <p className="text-gray-600">Redirecting to landing page...</p>
      </div>
    </div>
  );
};

export default HomePage;
