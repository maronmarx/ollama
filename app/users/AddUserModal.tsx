'use client';

import React, { useState } from 'react';

interface User {
  id: number;
  nom: string;
  email: string;
  password: string;
  profil: {
    nom: string;
    roles: string[];
  };
}

interface Profile {
  nom: string;
  roles: string[];
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newUser: Omit<User, 'id' | 'trialStartDate' | 'trialEndDate' | 'isTrialActive'>) => Promise<void>;
  profiles: Profile[];
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onSave, profiles }) => {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: Omit<User, 'id'> = {
      nom,
      email,
      password,
      profil: profiles.find(p => p.nom === selectedProfile) || { nom: 'Profil non défini', roles: [] }
    };
    await onSave(newUser);
    // La fermeture du modal et l'affichage de la confirmation sont gérés dans le composant parent
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Ajouter un utilisateur</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-2">
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Nom"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mt-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mt-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mt-2">
            <select
              value={selectedProfile}
              onChange={(e) => setSelectedProfile(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Sélectionnez un profil</option>
              {profiles.map((profile) => (
                <option key={profile.nom} value={profile.nom}>
                  {profile.nom}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Ajouter
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;