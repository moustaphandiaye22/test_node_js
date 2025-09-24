import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { Message } from '../utils/Message';
import { useForm } from 'react-hook-form';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('USER');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { handleSubmit, register: rhfRegister } = useForm();

  // Ajout de la validation côté front
  const onSubmit = async () => {
    setError('');
    if (!name || name.length < 2) {
      setError(Message.NOM_MIN_CARACTERE);
      return;
    }
    if (!email || !email.includes('@')) {
      setError(Message.INVALID_EMAIL);
      return;
    }
    if (!password || password.length < 2) {
      setError(Message.PASSWORD_MIN_CARACTERE);
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('name', name);
      formData.append('role', role);
      if (image) formData.append('image', image);
      await apiRequest('/api/user', {
        method: 'POST',
        body: formData,
      });
      // Connexion automatique après inscription
      const result = await apiRequest('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { email, password },
      });
      localStorage.setItem('token', result.accessToken || result.token);
      if (result.userId) localStorage.setItem('userId', result.userId.toString());
      navigate('/dashboard');
    } catch (err) {
      let msg = '';
      if (err.errors && Array.isArray(err.errors)) {
        msg = err.errors.map(e => e.message).join(' | ');
      } else if (err.error) {
        msg = err.error;
      } else {
        msg = err.message || Message.ERREURCONNECTION
      }
      if (msg.includes('Unique constraint failed') || msg.includes('email') || msg.includes('user_email_key')) {
        msg = Message.MAIL_EXISTTE;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  from-green-100 to-blue-100">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-6 text-green-700">Inscription</h2>
        <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <input
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files[0])}
            className="border border-green-200 p-3 rounded-xl"
          />
          <FormInput
            name="name"
            type="text"
            placeholder="Nom"
            value={name}
            onChange={e => setName(e.target.value)}
            register={rhfRegister}
            minLength={2}
            autoComplete="name"
          />
          <FormInput
            name="email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            register={rhfRegister}
            autoComplete="username"
          />
          <div className="relative w-full">
            <FormInput
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              register={rhfRegister}
              minLength={2}
              autoComplete="new-password"
            />
            <button type="button" onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-sm focus:outline-none">
              {showPassword ? 'Cacher' : 'Voir'}
            </button>
          </div>
          <div className="relative w-full">
            <FormInput
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              register={rhfRegister}
              minLength={2}
              autoComplete="new-password"
            />
            <button type="button" onClick={() => setShowConfirmPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-sm focus:outline-none">
              {showConfirmPassword ? 'Cacher' : 'Voir'}
            </button>
          </div>
          <FormSelect
            name="role"
            label={null}
            register={rhfRegister}
            value={role}
            onChange={e => setRole(e.target.value)}
            options={[
              { value: 'USER', label: 'Utilisateur' },
              { value: 'ADMIN', label: 'Administrateur' },
            ]}
          />
          {error && <div className="text-red-500 text-center font-semibold">{error}</div>}
          <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl font-bold shadow transition disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>
        <button className="mt-6 underline text-green-600 hover:text-green-800" onClick={() => navigate('/login')}>Déjà un compte ? Se connecter</button>
      </div>
    </div>
  );
};

export default Register;
