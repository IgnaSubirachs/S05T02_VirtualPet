// src/components/PetCard.jsx

import React from 'react';

const PetCard = ({ pet, onFeed, onPlay, onTrain, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'CALM': return 'text-green-500';
      case 'ANGRY': return 'text-yellow-500';
      case 'REBELLIOUS': return 'text-red-500';
      default: return 'text-white';
    }
  };

  const getPetImage = (species, status) => {
    // Retorna la ruta de la imatge segons l'espècie i l'estat
    return `/images/${species}_${status}.png`;
  };

  return (
    <div className="bg-gray-800 border-2 border-cyan-400 p-4 font-pixel text-cyan-400 text-center relative">
      <img
        src={getPetImage(pet.species, pet.status)}
        alt={pet.name}
        className="mx-auto mb-4 w-24 h-24 object-contain pixelated-image"
      />
      
      <h3 className="text-xl text-magenta-500 mb-2">{pet.name}</h3>

      <div className="text-left mb-4">
        <p className="text-sm">ESPÈCIE: <span className="font-bold">{pet.species}</span></p>
        <p className="text-sm">NIVELL: <span className="font-bold">{pet.level}</span></p>
        <p className="text-sm">ESTAT: <span className={`${getStatusColor(pet.status)} font-bold`}>{pet.status}</span></p>
        <p className="text-sm">FAM: <span className="font-bold">{pet.hunger}%</span></p>
        <div className="bg-gray-900 border border-cyan-400 h-4 w-full mb-2">
          <div
            className="bg-red-500 h-full"
            style={{ width: `${100 - pet.hunger}%` }}
          ></div>
        </div>
        <p className="text-sm">AGRESSIVITAT: <span className="font-bold">{pet.aggressiveness}%</span></p>
        <div className="bg-gray-900 border border-cyan-400 h-4 w-full">
          <div
            className="bg-yellow-500 h-full"
            style={{ width: `${pet.aggressiveness}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-around space-x-2">
        <button
          onClick={() => onFeed(pet.id)}
          className="border-2 border-cyan-400 px-2 py-1 text-cyan-400 hover:bg-cyan-500 hover:text-black text-sm transition-colors duration-200"
        >
          ALIMENTAR
        </button>
        <button
          onClick={() => onPlay(pet.id)}
          className="border-2 border-cyan-400 px-2 py-1 text-cyan-400 hover:bg-cyan-500 hover:text-black text-sm transition-colors duration-200"
        >
          JUGAR
        </button>
        <button
          onClick={() => onTrain(pet.id)}
          className="border-2 border-cyan-400 px-2 py-1 text-cyan-400 hover:bg-cyan-500 hover:text-black text-sm transition-colors duration-200"
        >
          ENTRENAR
        </button>
      </div>

      <button
        onClick={() => onDelete(pet.id)}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-bold"
      >
        X
      </button>
    </div>
  );
};

export default PetCard;