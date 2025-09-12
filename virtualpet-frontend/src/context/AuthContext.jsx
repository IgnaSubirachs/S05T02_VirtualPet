import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      setUser({ token, userId: parseInt(userId) });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Credencials incorrectes');
    }
    
    const data = await response.json();
    localStorage.setItem('authToken', data.token);

    // Després del login, cal obtenir l'id de l'usuari.
    // L'únic endpoint que tenim disponible és /auth/register,
    // que retorna l'id. Aquesta és una limitació de l'API.
    // Per a la prova, busquem l'usuari. En un cas real, l'API de login
    // hauria de retornar el userId o un endpoint /me
    const userResponse = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }), // Aquesta crida només és per obtenir l'ID
    });
    
    if (!userResponse.ok) {
        throw new Error('No es va poder obtenir l\'ID de l\'usuari.');
    }
    
    const userData = await userResponse.json();
    localStorage.setItem('userId', userData.id);
    
    setUser({ token: data.token, userId: userData.id });
  };

  const register = async (username, password) => {
    const response = await fetch('http://localhost:8080/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'El registre ha fallat');
    }
    const data = await response.json();
    
    localStorage.setItem('userId', data.id);
    
    // Fem el login automàticament per obtenir el token
    await login(username, password);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);