'use client';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';


const wastescannerLayout = ({ children }) => {

  return (
    <div className="flex h-screen bg-soft-beige">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6 bg-soft-beige">
          {children}
        </main>
      </div>
      
    </div>
  );
};

export default wastescannerLayout;


