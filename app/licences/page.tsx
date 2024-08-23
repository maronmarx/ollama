'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Profile, User } from '../users/types';
//imporation du profil de la personne connecter 
import Navbar from '../../components/Navbar';


export default function Users() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddProfileModalOpen, setIsAddProfileModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/check-auth', {
          method: 'GET',
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Not authenticated');
        }
        const data = await response.json();
        if (!data.user || data.user.profil.nom !== 'admin') {
          throw new Error('Not authorized');
        }
        setIsAuthorized(true);
        setIsLoading(false);
        fetchUsers();
        fetchProfiles();
      } catch (error) {
        console.error('Authentication or authorization error:', error);
        setIsAuthorized(false);
        setIsLoading(false);
        router.replace('/');
      }
    };
    
    checkAuth();
  }, [router]);

  
  
//Logout 
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'GET',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs');
      }
      const data = await response.json();
      const usersWithStringIds: User[] = await Promise.all(data.users.map(async (user: any) => {
        const isTrialActive = await checkTrialStatus(user.id.toString());
        return {
          ...user,
          id: user.id.toString(),
          isTrialActive
        };
      }));
      setUsers(usersWithStringIds);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const fetchProfiles = async () => {
    try {
      const response = await fetch('/api/profiles', {
        method: 'GET',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des profils');
      }
      const data = await response.json();
      setProfiles(data.profiles);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      if (response.ok) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.replace('/');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      router.replace('/');
    }
  };
  //verification de la période d'essai
  const checkTrialStatus = async (userId: string) => {
    try {
      const response = await fetch('/api/check-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la vérification de la période d essai');
      }
      const data = await response.json();
      return data.isTrialActive;
    } catch (error) {
      console.error("Erreur:", error);
      return false;
    }
  };

  //filtre des périodes d'essai 
  const [filter, setFilter] = useState('all');

  // Filtrez les utilisateurs avant de les afficher
const filteredUsers = users.filter(user => {
  if (filter === 'all') return true;
  if (filter === 'active') return user.isTrialActive;
  if (filter === 'expired') return !user.isTrialActive;
  return true;
});
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {isLoading ? (
        <p>Chargement...</p>
      ) : isAuthorized ? (
        
        <div className="max-w-7xl mx-auto">
        <div>
        <Navbar/>
        </div>
          <div className="flex justify-between items-center mb-6">
          <div className="mb-4 mt-4">
              <button onClick={() => setFilter('all')} className="mr-2 px-3 py-1 bg-gray-200 rounded">Tous</button>
              <button onClick={() => setFilter('active')} className="mr-2 px-3 py-1 bg-green-200 rounded">Période d essai active</button>
              <button onClick={() => setFilter('expired')} className="px-3 py-1 bg-red-200 rounded">Période d essai expirée</button>
         </div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion de la période d essai</h1>
          
          </div>
          <div className="bg-white shadow overflow-x-auto sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Période d essai
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profil
                  </th>

                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{user.nom}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {user.isTrialActive ? (
                    <span className="text-green-600">Active</span>
                  ) : (
                    <span className="text-red-600">Expirée</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{user.profil.nom}</div>
              </td>
             
            
            </tr>
          ))}
              </tbody>
            </table>
            
          </div>
        </div>
      ) : (
        <p>Vous n êtes pas autorisé à accéder à cette page.</p>
      )}
    </div>
  );
}