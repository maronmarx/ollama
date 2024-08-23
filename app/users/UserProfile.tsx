import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  nom: string;
  email: string;
  isTrialActive: boolean;
}

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="py-1">
      <div className="px-4 py-2">
      <img src="../imageinconnu.png" alt="Avatar" className="w-12 h-12 rounded-full mr-4 object-cover" />
        <p className="text-sm font-medium text-gray-900">{user.nom}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
      <div className="flex items-center mb-4">
        <span className={`px-2 py-1 rounded-full text-xs ${user.isTrialActive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
          {user.isTrialActive ? 'Période d\'essai active' : 'Période d\'essai expirée'}
        </span>
      </div>
      <div className="border-t border-gray-100"></div>
      <button
        onClick={handleLogout}
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Se déconnecter
      </button>
    </div>
  );
}
