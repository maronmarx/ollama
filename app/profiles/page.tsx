"use client";

import { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import { Profile } from './types';
import AddProfileModal from './AddProfileModal';
import EditProfileModal from './EditProfileModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

export default function Profiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isAddProfileModalOpen, setIsAddProfileModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);
  

  useEffect(() => {
    fetchProfiles();
  }, []);

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
      // Ajouter un id généré à chaque profil
      const profilesWithIds = data.profiles.map((profile: Profile, index: number) => ({
        ...profile,
        id: `profile-${index + 1}`
      }));
      setProfiles(profilesWithIds);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleAddProfile = async (newProfile: Profile) => {
    try {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProfile),
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du profil');
      }
      fetchProfiles();
      setIsAddProfileModalOpen(false);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleEditProfile = (profile: Profile) => {
    setEditingProfile(profile);
    setIsEditProfileModalOpen(true);
  };

  const handleSaveProfile = async (updatedProfile: Profile) => {
    // Implement the logic to save the updated profile
    // Similar to handleAddProfile, but use PUT method
    fetchProfiles();
    setIsEditProfileModalOpen(false);
  };

  const handleDeleteProfile = (profile: Profile) => {
    setProfileToDelete(profile);
    setIsConfirmDeleteModalOpen(true);
  };

  const confirmDeleteProfile = async () => {
    // Implement the logic to delete the profile
    // Use DELETE method to /api/profiles/{profileId}
    fetchProfiles();
    setIsConfirmDeleteModalOpen(false);
    setProfileToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Profils</h1>
          <button
            onClick={() => setIsAddProfileModalOpen(true)}
            className="px-1 py-1 mr-2 mt-6 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <FaPlus className="mr-2" /> Ajouter un profil
          </button>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôles</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {profiles.map((profile) => (
    <tr key={profile.id || profile.nom}>  
      <td className="px-6 py-4 whitespace-nowrap">{profile.nom}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button onClick={() => handleEditProfile(profile)} className="text-indigo-600 hover:text-indigo-900 mr-4">
          <FaEdit className="inline mr-1" /> Modifier
        </button>
        <button onClick={() => handleDeleteProfile(profile)} className="text-red-600 hover:text-red-900">
          <FaTrash className="inline mr-1" /> Supprimer
        </button>
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
      </div>
      <AddProfileModal
        isOpen={isAddProfileModalOpen}
        onClose={() => setIsAddProfileModalOpen(false)}
        onSave={handleAddProfile}
      />
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        onSave={handleSaveProfile}
        profile={editingProfile}
      />
      <ConfirmDeleteModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
        onConfirm={confirmDeleteProfile}
      />
    </div>
  );
}