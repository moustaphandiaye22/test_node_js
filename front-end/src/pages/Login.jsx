import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { Message } from '../utils/Message';
import { useForm } from 'react-hook-form';
import FormInput from '../components/FormInput';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { handleSubmit, register } = useForm();

  // Ajout de la validation côté front
  const onSubmit = async () => {
    setError('');
    if (!email || !email.includes('@')) {
      setError(Message.EMAILINCORECT);
      return;
    }
    if (!password || password.length < 2) {
      setError(Message.PASSWORDINCORECT);
      return;
    }
    setLoading(true);
    try {
      // On suppose que l'API retourne { accessToken, userId } ou { token, userId }
      const result = await apiRequest('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { email, password },
      });
      // Compatibilité : si c'est juste un string, on ne peut pas stocker l'id
      if (typeof result === 'string') {
        localStorage.setItem('token', result);
      } else {
        localStorage.setItem('token', result.accessToken || result.token);
        if (result.userId) localStorage.setItem('userId', result.userId.toString());
      }
      // Si pas d'id, on va le chercher via /api/user?email=...
      if (!localStorage.getItem('userId')) {
        try {
          const users = await apiRequest(`/api/user?email=${encodeURIComponent(email)}`);
          if (Array.isArray(users) && users.length > 0) {
            localStorage.setItem('userId', users[0].id.toString());
          }
        } catch {}
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || Message.ERREURCONNECTION);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-6 text-green-700">Connexion</h2>
        <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            name="email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            register={register}
            autoComplete="username"
          />
          <div className="relative w-full">
            <FormInput
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              register={register}
              autoComplete="current-password"
            />
            <button type="button" onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 text-sm focus:outline-none">
              {showPassword ? 'Cacher' : 'Voir'}
            </button>
          </div>
          {error && <div className="text-red-500 text-center font-semibold">{error}</div>}
          <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl font-bold shadow transition disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <button className="mt-6 underline text-green-600 hover:text-green-800" onClick={() => navigate('/register')}>Créer un compte</button>
      </div>
    </div>
  );
};

export default Login;
