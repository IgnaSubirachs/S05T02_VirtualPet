// src/components/LandingPage.jsx
import React, { useState } from 'react';
import AuthModal from './AuthModal';

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('login'); // 'login' or 'register'

  const openModal = (mode) => {
    setModalMode(mode);
    setIsModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center overflow-hidden">
      {/* Fons Dinàmic (pots afegir un component de partícules aquí) */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      
      <main className="z-10 text-center p-8">
        <h1 className="text-6xl md:text-8xl font-bold text-cyan-400 font-orbitron tracking-widest uppercase animate-pulse">
          Alien Pet Zoo
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          Cria, entrena i evoluciona la teva pròpia mascota alienígena en un hàbitat intergalàctic.
        </p>
        
        <div className="mt-12 flex justify-center gap-6">
          <button 
            onClick={() => openModal('login')}
            className="px-8 py-3 bg-cyan-500 text-black font-bold uppercase rounded-md shadow-lg shadow-cyan-500/30 transform hover:scale-105 transition-transform duration-300"
          >
            Accedir
          </button>
          <button 
            onClick={() => openModal('register')}
            className="px-8 py-3 border-2 border-violet-500 text-violet-500 font-bold uppercase rounded-md shadow-lg shadow-violet-500/30 transform hover:bg-violet-500 hover:text-black transition-all duration-300"
          >
            Registrar-se
          </button>
        </div>
      </main>

      {isModalOpen && <AuthModal mode={modalMode} setMode={setModalMode} closeModal={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default LandingPage;