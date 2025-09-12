import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-900 border-2 border-red-500 text-red-300 p-2 text-sm text-center font-pixel">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm mb-1 text-cyan-400">
          USERNAME
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border-2 border-cyan-400 text-yellow-300 focus:outline-none focus:border-magenta-500 pixel-input"
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label className="block text-sm mb-1 text-cyan-400">
          PASSWORD
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border-2 border-cyan-400 text-yellow-300 focus:outline-none focus:border-magenta-500 pixel-input"
          disabled={isSubmitting}
        />
      </div>
      
      <button
        type="submit"
        className="w-full py-3 mt-4 border-4 border-cyan-400 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-colors duration-200 font-pixel disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'ACCEDINT...' : 'ACCESS TERMINAL'}
      </button>
    </form>
  );
};

export default LoginForm;