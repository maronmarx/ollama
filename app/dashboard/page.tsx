'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import UserProfile from '../users/UserProfile';
import Navbar from '../../components/Navbar';

interface User {
  id: string;
  email: string;
  nom: string;
  profil: {
    nom: string;
  };
  trialStartDate: string;
  trialEndDate: string;
  isTrialActive: boolean;
}

// Déclaration pour étendre l'interface Window
declare global {
  interface Window {
    inactivityTimer: NodeJS.Timeout | null;
  }
}

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(true);
      try {
        const response = await fetch('/api/check-auth', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Not authenticated');
        }
        const data = await response.json();
        const isTrialActive = await checkTrialStatus(data.user.id);
        setUser({ ...data.user, isTrialActive });
      } catch (error) {
        console.error('Authentication error:', error);
        handleLogout();
      } finally {
        setIsLoading(false);
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
  }, [checkActivity, handleLogout, handleUserActivity, resetInactivityTimer, router]);

  const checkTrialStatus = async (userId: string) => {
    try {
      const response = await fetch('/api/check-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la vérification de la période d\'essai');
      }
      const data = await response.json();
      return data.isTrialActive;
    } catch (error) {
      console.error('Erreur:', error);
      return false;
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!user) return <div>Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
       
        <div className="flex justify-between items-center mb-6">
          <UserProfile />
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Informations de l utilisateur</h3>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Nom</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.nom}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Profil</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.profil.nom}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Statut d essai</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.isTrialActive ? 'Actif' : 'Expiré'}
                </dd>
              </div>
              {user.trialEndDate && (
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Fin de la période d essai</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(user.trialEndDate).toLocaleDateString()}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}