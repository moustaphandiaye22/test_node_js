import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { LogOut, Bell } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    let interval;
    apiRequest('/api/user/me')
      .then(user => {
        setCurrentUser(user);
        if (user && user.id) {
          const fetchNotifications = () => {
            apiRequest(`/api/notifications/user/${user.id}`)
              .then(setNotifications)
              .catch(() => setNotifications([]));
          };
          fetchNotifications();
          interval = setInterval(fetchNotifications, 30000); // 30s
        }
      })
      .catch(() => setCurrentUser(null));
    return () => interval && clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md mb-4 relative">
      <div className="flex gap-8 items-center">
        <span className="font-bold text-lg text-green-700">TodoApp</span>
        <nav className="flex gap-4">
          <a href="/dashboard" className="hover:underline text-green-600 font-semibold">Tableau de bord</a>
          <a href="/todos" className="hover:underline text-green-600 font-semibold">Todos</a>
        </nav>
      </div>
      {currentUser && (
        <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-5 py-2 rounded-full font-medium shadow border border-blue-200 mr-4">
          <img src={currentUser.imageUrl || '/vite.svg'} alt="avatar" className="w-8 h-8 rounded-full object-cover border border-blue-300" />
          Connecté : {currentUser.name || currentUser.nom || currentUser.email}
          {/* Notification Icon */}
          <button
            className="relative ml-3"
            onClick={() => setShowNotifications(v => !v)}
            title="Notifications"
          >
            <Bell className="w-6 h-6 text-yellow-500" />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>
        </span>
      )}
      <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow transition">
        <LogOut className="w-5 h-5" />
        Déconnexion
      </button>
      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="absolute right-32 top-16 w-80 bg-white border border-gray-200 shadow-lg rounded-lg z-50">
          <div className="p-3 border-b font-bold text-gray-700">Notifications</div>
          <ul className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="p-3 text-gray-500">Aucune notification</li>
            ) : (
              notifications.map(n => (
                <li key={n.id} className={`p-3 border-b last:border-b-0 ${n.read ? 'bg-gray-100' : 'bg-yellow-50'}`}>
                  <div className="text-sm text-gray-800">{n.message}</div>
                  <div className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
