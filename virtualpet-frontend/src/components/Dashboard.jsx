import React, { useState, useEffect } from 'react';
import PetCard from './PetCard';
import { useAuth } from '../context/AuthContext';
import CreatePetForm from './CreatePetForm'; // Nou component

const Dashboard = () => {
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user, logout } = useAuth();

  const fetchPets = async () => {
    if (!user || !user.userId) {
      setError("ID d'usuari no disponible. Si us plau, torna a iniciar sessió.");
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8080/api/pets/${user.userId}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (!response.ok) {
        throw new Error('No es van poder carregar les mascotes.');
      }
      const data = await response.json();
      setPets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [user]);

  const handleAction = async (petId, action) => {
    if (!user || !user.userId) return;

    try {
      const response = await fetch(`http://localhost:8080/api/pets/${petId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (!response.ok) {
        throw new Error(`Error en l'acció '${action}'`);
      }
      const updatedPet = await response.json();
      setPets(prevPets => prevPets.map(p => p.id === updatedPet.id ? updatedPet : p));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (petId) => {
    if (!user || !user.userId) return;

    if (window.confirm("Estàs segur que vols eliminar aquesta criatura?")) {
        try {
            const response = await fetch(`http://localhost:8080/api/pets/${petId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Error en eliminar la mascota.');
            }
            setPets(prevPets => prevPets.filter(p => p.id !== petId));
        } catch (err) {
            setError(err.message);
        }
    }
  };

  const handlePetCreated = () => {
    setShowCreateForm(false);
    fetchPets();
  };

  if (isLoading) {
    return <div className="text-center font-pixel text-cyan-400 mt-20">CARREGANT ZOO...</div>;
  }

  if (error) {
    return (
      <div className="text-center font-pixel text-red-500 mt-20">
        ERROR: {error}
        <button onClick={logout} className="block mx-auto mt-4 border-2 border-red-500 px-4 py-2 text-red-500 hover:bg-red-500 hover:text-black transition-colors duration-200">
          TORNAR AL LOGIN
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-pixel p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl text-magenta-500">EL MEU ZOO CÒSMIC</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="border-2 border-cyan-400 px-4 py-2 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-colors duration-200"
        >
          + ADOPTA UNA NOVA MASCOTA
        </button>
      </div>

      {showCreateForm && (
        <CreatePetForm onClose={() => setShowCreateForm(false)} onPetCreated={handlePetCreated} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {pets.length > 0 ? (
          pets.map(pet => (
            <PetCard
              key={pet.id}
              pet={pet}
              onFeed={() => handleAction(pet.id, 'feed')}
              onPlay={() => handleAction(pet.id, 'play')}
              onTrain={() => handleAction(pet.id, 'train')}
              onDelete={() => handleDelete(pet.id)}
            />
          ))
        ) : (
          <p className="text-center col-span-full">Encara no tens cap mascota. Adopta'n una!</p>
        )}
      </div>
      <button
        onClick={logout}
        className="fixed bottom-4 right-4 border-2 border-cyan-400 px-4 py-2 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-colors duration-200"
      >
        Tancar Sessió
      </button>
    </div>
  );
};

export default Dashboard;