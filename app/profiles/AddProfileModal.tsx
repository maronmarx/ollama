// src/app/profiles/AddProfileModal.tsx
"use client";

import React, { useState } from 'react';
import { Profile } from './types';

interface AddProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: Omit<Profile, 'id'>) => void;
}

const AVAILABLE_ROLES = [
  'evaluer_performance_prediction',
  'creer_modele_tendance',
  'evaluer_performance_tendance',
  'deployer',
  'partager'
];

export default function AddProfileModal({ isOpen, onClose, onSave }: AddProfileModalProps) {
  const [nom, setNom] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ nom, roles: selectedRoles });
    setNom('');
    setSelectedRoles([]);
  };

  const handleRoleChange = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role) 
        : [...prev, role]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Ajouter un nouveau profil</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom du profil</label>
            <input
              type="text"
              id="nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Rôles :</label>
            {AVAILABLE_ROLES.map(role => (
              <div key={role} className="flex items-center">
                <input
                  type="checkbox"
                  id={role}
                  checked={selectedRoles.includes(role)}
                  onChange={() => handleRoleChange(role)}
                  className="mr-2"
                />
                <label htmlFor={role}>{role}</label>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
              Annuler
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}