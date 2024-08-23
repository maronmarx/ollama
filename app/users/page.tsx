'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import AddProfileModal from './AddProfileModal';
import AddUserModal from './AddUserModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import EditUserModal from './EditUserModal';
import { Profile, User } from './types';
import Navbar from '../../components/Navbar';

// Déclaration pour étendre l'interface Window
declare global {
  interface Window {
    inactivityTimer: NodeJS.Timeout | null;
  }
}

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes

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

  const handleLogout = useCallback(async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('lastActivityTime');
        router.replace('/');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      router.replace('/');
    }
  }, [router]);

  const resetInactivityTimer = useCallback(() => {
    if (window.inactivityTimer) {
      clearTimeout(window.inactivityTimer);
    }
    const currentTime = new Date().getTime().toString();
    localStorage.setItem('lastActivityTime', currentTime);
    document.cookie = `lastActivityTime=${currentTime}; path=/; max-age=${30 * 60}`;
    window.inactivityTimer = setTimeout(handleLogout, INACTIVITY_TIMEOUT);
  }, [handleLogout]);

  const checkActivity = useCallback(() => {
    const lastActivityTime = localStorage.getItem('lastActivityTime');
    const currentTime = new Date().getTime();
    if (lastActivityTime && currentTime - parseInt(lastActivityTime) > INACTIVITY_TIMEOUT) {
      handleLogout();
    } else {
      resetInactivityTimer();
    }
  }, [handleLogout, resetInactivityTimer]);

  const handleUserActivity = useCallback(() => {
    console.log('Activité utilisateur détectée');
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/check-auth', {
          method: 'GET',
          credentials: 'include',
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
        handleLogout();
      }
    };

    checkAuth();

    window.addEventListener('click', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);

    const activityCheckInterval = setInterval(checkActivity, 60000);
    resetInactivityTimer();

    const authCheckInterval = setInterval(checkAuth, 10000);

    return () => {
      clearInterval(authCheckInterval);
      clearInterval(activityCheckInterval);
      if (window.inactivityTimer) {
        clearTimeout(window.inactivityTimer);
      }
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
    };
  }, [checkActivity, handleLogout, handleUserActivity, resetInactivityTimer]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs');
      }
      const data = await response.json();
      const usersWithStringIds: User[] = await Promise.all(
        data.users.map(async (user: any) => {
          const isTrialActive = await checkTrialStatus(user.id.toString());
          return {
            ...user,
            id: user.id.toString(),
            isTrialActive,
          };
        })
      );
      setUsers(usersWithStringIds);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchProfiles = async () => {
    try {
      const response = await fetch('/api/profiles', {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des profils');
      }
      const data = await response.json();
      setProfiles(data.profiles);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = async (updatedUser: User) => {
    try {
      const response = await fetch(`/api/users/${updatedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de l\'utilisateur');
      }
      fetchUsers();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsConfirmDeleteModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (userToDelete) {
      try {
        const response = await fetch(`/api/users/${userToDelete.id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Erreur lors de la suppression de l\'utilisateur');
        }
        fetchUsers();
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
    setIsConfirmDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleAddUser = async (newUser: Omit<User, 'id' | 'trialStartDate' | 'trialEndDate' | 'isTrialActive'>) => {
    try {
      const trialDuration = 30; // Durée de la période d'essai en jours
      const trialStartDate = new Date();
      const trialEndDate = new Date(trialStartDate);
      trialEndDate.setDate(trialEndDate.getDate() + trialDuration);

      const userWithTrial = {
        ...newUser,
        trialStartDate: trialStartDate.toISOString(),
        trialEndDate: trialEndDate.toISOString(),
        isTrialActive: true,
      };

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userWithTrial),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout de l\'utilisateur');
      }
      fetchUsers();
      setIsAddUserModalOpen(false);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleAddProfile = async (newProfile: Profile) => {
    try {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProfile),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du profil');
      }
      fetchProfiles();
      setIsAddProfileModalOpen(false);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const checkTrialStatus = async (userId: string) => {
    try {
      const response = await fetch('/api/check-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la vérification de la période d essai');
      }
      const data = await response.json();
      return data.isTrialActive;
    } catch (error) {
      console.error('Erreur:', error);
      return false;
    }
  };

  const [filter, setFilter] = useState('all');
  const filteredUsers = users.filter((user) => {
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
           
          <h1 className="text-3xl font-bold text-gray-900 text-center">Liste des Utilisateurs</h1>
            <div>
              <button
                onClick={() => setIsAddUserModalOpen(true)}
                className="px-4 py-2 mr-2 mt-5 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Ajouter un utilisateur
              </button>
             
              
            </div>
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
                    Profil
                  </th>
                  
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
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
                <div className="text-sm text-gray-500">{user.profil.nom}</div>
              </td>
             
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded flex items-center text-xs"
                  >
                    <FaEdit className="inline mr-1" /> Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded flex items-center text-xs"
                  >
                    <FaTrash className="inline mr-1"/> Supprimer
                  </button>
                </div>
              </td>
            </tr>
          ))}
              </tbody>
            </table>
            
          </div>
   
          <EditUserModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleSaveUser}
            user={editingUser}
            profiles={profiles}
          />
          <AddUserModal
            isOpen={isAddUserModalOpen}
            onClose={() => setIsAddUserModalOpen(false)}
            onSave={handleAddUser}
            profiles={profiles}
          />
          <AddProfileModal
            isOpen={isAddProfileModalOpen}
            onClose={() => setIsAddProfileModalOpen(false)}
            onSave={handleAddProfile}
          />
          <ConfirmDeleteModal
            isOpen={isConfirmDeleteModalOpen}
            onClose={() => setIsConfirmDeleteModalOpen(false)}
            onConfirm={confirmDeleteUser}
          />
        </div>
      ) : (
        <p>Vous n êtes pas autorisé à accéder à cette page.</p>
      )}
    </div>
  );
}