import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';

const Header = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    apiRequest('/api/user/me')
      .then(setCurrentUser)
      .catch(() => setCurrentUser(null));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md mb-4">
      <div className="flex gap-8 items-center">
        <span className="font-bold text-lg text-blue-700">TodoApp</span>
        <nav className="flex gap-4">
          <a href="/dashboard" className="hover:underline text-blue-600 font-semibold">Tableau de bord</a>
          <a href="/todos" className="hover:underline text-blue-600 font-semibold">Todos</a>
        </nav>
      </div>
      {currentUser && (
        <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-5 py-2 rounded-full font-medium shadow border border-blue-200 mr-4">
          <img src={currentUser.imageUrl || '/vite.svg'} alt="avatar" className="w-8 h-8 rounded-full object-cover border border-blue-300" />
          Connecté : {currentUser.name || currentUser.nom || currentUser.email}
        </span>
      )}
      <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow transition">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3A2.25 2.25 0 008.25 5.25V9m7.5 0v10.5A2.25 2.25 0 0113.5 21h-3a2.25 2.25 0 01-2.25-2.25V9m7.5 0H18a2.25 2.25 0 012.25 2.25v7.5A2.25 2.25 0 0118 21h-1.5m-7.5 0H6a2.25 2.25 0 01-2.25-2.25v-7.5A2.25 2.25 0 016 9h1.5" />
        </svg>
        Déconnexion
      </button>
    </header>
  );
};

export default Header;
