'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import AIFeedbackModal from '../components/common/AIFeedbackModal';

const DashboardLayout = ({ children }) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const pathname = usePathname();

  // Simulate AI feedback after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setFeedbackMessage(
        'Switch to biking to save 0.3kg CO₂ on your next trip!'
      );
      setShowFeedback(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Don't show sidebar and topbar on login page
  if (pathname === '/login') {
    return <div>{children}</div>;
  }

  return (
    <div className="flex h-screen bg-soft-beige">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6 bg-soft-beige">
          {children}
        </main>
      </div>
      {showFeedback && (
        <AIFeedbackModal
          message={feedbackMessage}
          onClose={() => setShowFeedback(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;


