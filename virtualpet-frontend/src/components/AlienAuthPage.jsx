import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
// 

const AlienAuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="relative min-h-screen bg-black text-cyan-400 font-pixel overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0 bg-cover bg-center">
        {/* Aquí aniria la teva imatge de fons pixel art */}
      </div>
      
      <div className="absolute inset-0 z-10 pointer-events-none scanlines"></div>

      <div className="relative z-20 w-full max-w-md p-8 bg-gray-900 border-4 border-cyan-500 shadow-neon">
        
        <h1 className="text-3xl text-center mb-6 text-magenta-500">
          GALACTIC PET ZOO
        </h1>

        <div className="flex justify-center mb-6 space-x-2">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 border-4 ${
              isLogin ? 'bg-cyan-500 text-black border-cyan-500' : 'text-cyan-400 border-transparent hover:border-cyan-500'
            } transition-colors duration-200`}
          >
            LOG IN
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 border-4 ${
              !isLogin ? 'bg-cyan-500 text-black border-cyan-500' : 'text-cyan-400 border-transparent hover:border-cyan-500'
            } transition-colors duration-200`}
          >
            REGISTER
          </button>
        </div>

        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
};

export default AlienAuthPage;