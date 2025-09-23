

import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Todos from './pages/Todos';
// import Historique from './pages/Historique';
import Header from './components/Header';
import './App.css';

function App() {
  const location = useLocation();
  // On masque le header sur la page de login et register
  const hideHeader = ["/login", "/register"].includes(location.pathname);
  return (
    <div className="min-h-screen bg-gray-50">
      {!hideHeader && <Header />}
      <div className="max-w-full mx-auto ml-11 mr-11">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/todos" element={<Todos />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
