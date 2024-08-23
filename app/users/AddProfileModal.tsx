import React, { useState } from 'react';

interface AddProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newProfile: { nom: string; roles: string[] }) => void;
}

const roles = [
  "evaluer_performance_prediction",
  "creer_modele_tendance",
  "evaluer_performance_tendance",
  "deployer",
  "partager"
];

const AddProfileModal = ({ isOpen, onClose, onSave }: AddProfileModalProps) => {
  const [nom, setNom] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const handleRoleChange = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role) 
        : [...prev, role]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ nom, roles: selectedRoles });
    setNom('');
    setSelectedRoles([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-bold mb-4">Ajouter un nouveau profil</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Nom du profil"
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <div className="mb-4">
            <p className="font-bold mb-2">Rôles :</p>
            {roles.map(role => (
              <div key={role} className="flex items-center mb-2">
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
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProfileModal;