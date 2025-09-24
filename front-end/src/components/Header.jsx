import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { LogOut } from 'lucide-react';

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
        <LogOut className="w-5 h-5" />
        Déconnexion
      </button>
    </header>
  );
};

export default Header;
