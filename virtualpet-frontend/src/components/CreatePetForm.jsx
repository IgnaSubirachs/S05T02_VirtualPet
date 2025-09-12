import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const speciesOptions = [
  'XENOMORPH',
  'PREDATOR',
  'FACEHUGGER',
  'CHESTBURSTER',
  'ENGINEER'
];

const CreatePetForm = ({ onClose, onPetCreated }) => {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState(speciesOptions[0]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !species) {
      setError('Tots els camps són obligatoris.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    const newPet = {
      name,
      species,
      hunger: 0, // Valors inicials segons la lògica de la teva API
      aggressiveness: 0,
    };

    try {
      const response = await fetch(`http://localhost:8080/api/pets/${user.userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(newPet),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error en crear la mascota.');
      }

      onPetCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative w-full max-w-sm p-8 bg-gray-900 border-4 border-cyan-500 font-pixel">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 text-xl font-bold hover:text-red-700"
        >
          X
        </button>
        <h3 className="text-2xl text-center text-magenta-500 mb-6">ADOPTA UNA CRIATURA</h3>
        {error && (
          <div className="bg-red-900 border-2 border-red-500 text-red-300 p-2 text-sm text-center mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-cyan-400">NOM:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border-2 border-cyan-400 text-yellow-300 focus:outline-none focus:border-magenta-500 pixel-input"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-cyan-400">ESPÈCIE:</label>
            <select
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border-2 border-cyan-400 text-yellow-300 focus:outline-none focus:border-magenta-500 pixel-input"
              disabled={isSubmitting}
            >
              {speciesOptions.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-4 border-4 border-cyan-400 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-colors duration-200 font-pixel disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'CREANT...' : 'ADOPTA'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePetForm;