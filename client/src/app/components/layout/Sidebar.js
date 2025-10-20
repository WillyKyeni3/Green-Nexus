// client/src/components/layout/Sidebar.js
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  BarChart2Icon,
  LeafIcon,
  ShoppingBagIcon,
  UserIcon,
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  // Helper function to determine active link
  const isActive = (path) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col h-full">
      <div className="p-5 border-b border-neutral-gray">
        <h1 className="text-2xl font-bold text-primary-dark flex items-center">
          <LeafIcon className="mr-2" size={24} />
          GreenNexus
        </h1>
      </div>
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/"
              className={`flex items-center p-3 rounded-lg ${
                pathname === '/' ? 'bg-primary-light text-primary-dark font-medium' : 'text-gray-600 hover:bg-primary-light/50'
              }`}
            >
              <HomeIcon className="mr-3" size={20} />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/activity"
              className={`flex items-center p-3 rounded-lg ${
                isActive('/activity') ? 'bg-primary-light text-primary-dark font-medium' : 'text-gray-600 hover:bg-primary-light/50'
              }`}
            >
              <BarChart2Icon className="mr-3" size={20} />
              Activity Tracker
            </Link>
          </li>
          <li>
            <Link
              href="/waste-scanner"
              className={`flex items-center p-3 rounded-lg ${
                isActive('/waste-scanner') ? 'bg-primary-light text-primary-dark font-medium' : 'text-gray-600 hover:bg-primary-light/50'
              }`}
            >
              <LeafIcon className="mr-3" size={20} />
              Waste Scanner
            </Link>
          </li>
          <li>
            <Link
              href="/marketplace"
              className={`flex items-center p-3 rounded-lg ${
                isActive('/marketplace') ? 'bg-primary-light text-primary-dark font-medium' : 'text-gray-600 hover:bg-primary-light/50'
              }`}
            >
              <ShoppingBagIcon className="mr-3" size={20} />
              Marketplace
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4 border-t border-neutral-gray">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
            <UserIcon size={20} className="text-primary" />
          </div>
          <div className="ml-3">
            <p className="font-medium">Alex Green</p>
            <p className="text-sm text-gray-500">Eco Enthusiast</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;