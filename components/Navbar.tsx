import Link from 'next/link';
import { ReactNode, useState, useEffect } from 'react';
import { FaBell, FaIdCard, FaKey, FaUserCircle, FaUsers } from 'react-icons/fa';
import UserProfile from '../app/users/UserProfile';
interface NavLinkProps {
  href: string;
  children: ReactNode;
  icon: ReactNode;
}

interface Notification {
  id: number;
  message: string;
  createdAt: string;
  read: boolean;
}

function NavLink({ href, children, icon }: NavLinkProps) {
  return (
    <Link href={href} className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
      {icon}
      <span className="ml-2">{children}</span>
    </Link>
  );
}

export default function Navbar() {
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 w-full z-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/dashboard" className="flex-shrink-0 flex items-center">
              <img className="h-8 w-auto" src="/S2D.png" alt="Logo" />
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink href="/users" icon={<FaUsers />}>Gestion des utilisateurs</NavLink>
              <NavLink href="/profiles" icon={<FaIdCard />}>Gestion des profils</NavLink>
              <NavLink href="/licences" icon={<FaKey />}>Gestion des licences</NavLink>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label="Notifications"
              >
                <FaBell className="h-6 w-6" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-2 text-sm text-gray-700">Pas de nouvelles notifications</p>
                  ) : (
                    notifications.map((notification) => (
                      <div key={notification.id} className="px-4 py-2 text-sm text-gray-700 border-b last:border-b-0">
                        <p className={notification.read ? 'text-gray-500' : 'font-semibold'}>{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(notification.createdAt).toLocaleString()}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <div className="ml-3 relative">
              <div>
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  aria-expanded={showProfile}
                  aria-haspopup="true"
                >
                  <span className="sr-only">Ouvrir le menu utilisateur</span>
                  <FaUserCircle className="h-8 w-8 text-gray-400" />
                </button>
              </div>
              {showProfile && (
                <div 
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <UserProfile />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}