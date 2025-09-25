import React, { useEffect, useState } from 'react';
import { usePagination } from '../hooks/usePagination';
import Pagination from '../components/Pagination';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { History, Pencil, Trash2 } from 'lucide-react';
import TodoTabs from '../components/TodoTabs';
import TodoCard from '../components/TodoCard';
import TodoAddForm from '../components/TodoAddForm';
import { Message } from '../utils/Message';
import TodoHistory from '../components/TodoHistory';
import TodoFilters from '../components/TodoFilters';

const Todos = () => {
  const [search, setSearch] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showArchived, setShowArchived] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [users, setUsers] = useState([]);
  const [historique, setHistorique] = useState([]);
  const [todos, setTodos] = useState([]);
  const [sharedTodos, setSharedTodos] = useState([]);
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem('userId'));
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [error, setError] = useState('');
  const [shareId, setShareId] = useState('');
  const [shareTodoId, setShareTodoId] = useState(null);
  const [shareMsg, setShareMsg] = useState('');
  const [shareCanEdit, setShareCanEdit] = useState(true);
  const [shareCanDelete, setShareCanDelete] = useState(false);
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodo, setEditTodo] = useState({ title: '', description: '', startDate: '', endDate: '' });
  const [fetchId, setFetchId] = useState('');
  // Prépare la liste filtrée pour la pagination (all/user)
  let filteredTodos = (activeTab === 'all' ? todos : todos.filter(todo => todo.userId === userId));
  if (search.trim()) {
    filteredTodos = filteredTodos.filter(todo =>
      todo.title.toLowerCase().includes(search.toLowerCase()) ||
      (todo.description || '').toLowerCase().includes(search.toLowerCase())
    );
  }
  if (filterUser) {
    filteredTodos = filteredTodos.filter(todo => String(todo.userId) === filterUser);
  }
  if (filterStatus === 'active') {
    filteredTodos = filteredTodos.filter(todo => !todo.completed && !todo.archived);
  } else if (filterStatus === 'completed') {
    filteredTodos = filteredTodos.filter(todo => todo.completed && !todo.archived);
  } else if (filterStatus === 'archived') {
    filteredTodos = filteredTodos.filter(todo => todo.archived);
  } else {
    filteredTodos = filteredTodos.filter(todo => showArchived ? todo.archived : !todo.archived);
  }
  filteredTodos = filteredTodos.slice().reverse();

  // Appel du hook toujours, mais inutilisé pour les autres onglets
  const { page, perPage, totalPages, setPage, setPerPage } = usePagination((activeTab === 'all' || activeTab === 'user') ? filteredTodos.length : 0);
  let currentTodos = [];
  if (activeTab === 'all' || activeTab === 'user') {
    const indexOfLastTodo = page * perPage;
    const indexOfFirstTodo = indexOfLastTodo - perPage;
    currentTodos = filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo);
  }

  const fetchTodos = async () => {
    try {
      const data = await apiRequest('/api/todo');
      setTodos(data);
    } catch (err) {
      setError(Message.ERROR_CHARGEMENT);
    }
  };

  useEffect(() => {
    // Récupérer l'utilisateur connecté
    apiRequest('/api/user/me')
      .then(userData => {
        setCurrentUser(userData);
        // Récupère les todos partagés reçus
        apiRequest(`/api/user/${userData.id}/shared-todos`)
          .then(setSharedTodos)
          .catch(() => {});
      })
      .catch(() => {});
    // Redirige si pas connecté
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    fetchTodos();
    apiRequest('/api/historique')
      .then(setHistorique)
      .catch(() => setError(Message.ERROR_CHARGE_HISTORIQUE));
    // Récupérer tous les utilisateurs pour afficher leur nom dans l'historique
    apiRequest('/api/user')
      .then(setUsers)
      .catch(() => {});
  }, [navigate]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;
    if (!newTodo.startDate || !newTodo.endDate) {
      setError('Veuillez renseigner la date de début et de fin.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', newTodo.title);
      if (newTodo.description && newTodo.description.trim() !== '') {
        formData.append('description', newTodo.description);
      }
      formData.append('startDate', newTodo.startDate);
      formData.append('endDate', newTodo.endDate);
      formData.append('completed', 'false');
      if (newTodo.image) {
        formData.append('image', newTodo.image);
      }
      if (newTodo.audio) {
        formData.append('audio', newTodo.audio, 'audio.webm');
      }
      await apiRequest('/api/todo', {
        method: 'POST',
        body: formData,
        isFormData: true,
      });
      setNewTodo({ title: '', description: '', image: undefined, audio: undefined, startDate: '', endDate: '' });
      fetchTodos();
    } catch (err) {
      setError(err?.errors?.[0]?.message || err?.error || Message.ERROR_AJOUT);
    }
  };

  const handleEdit = (todo) => {
    setEditTodoId(todo.id);
    setEditTodo({
      title: todo.title,
      description: todo.description || '',
      startDate: todo.startDate ? new Date(todo.startDate).toISOString().slice(0, 16) : '',
      endDate: todo.endDate ? new Date(todo.endDate).toISOString().slice(0, 16) : ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editTodo.startDate || !editTodo.endDate) {
      setError('Veuillez renseigner la date de début et de fin.');
      return;
    }
    try {
      const todoToEdit = currentTodos.find(t => t.id === editTodoId);
      const formData = new FormData();
      formData.append('title', editTodo.title);
      formData.append('description', editTodo.description || '');
      formData.append('startDate', editTodo.startDate);
      formData.append('endDate', editTodo.endDate);
      formData.append('completed', 'false');
      await apiRequest(`/api/todo/${editTodoId}`, {
        method: 'PUT',
        body: formData,
      });
      setEditTodoId(null);
      setEditTodo({ title: '', description: '' , startDate: '', endDate: '' });
      fetchTodos();
    } catch (err) {
      setError(err?.error || Message.ERROR_UPDATE);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiRequest(`/api/todo/${id}`, { method: 'DELETE' });
      fetchTodos();
    } catch (err) {
      setError(err?.error || Message.ERROR_DELETE);
    }
  };
  const handleArchive = async (id) => {
    try {
      await apiRequest(`/api/todo/${id}/archive`, { method: 'PATCH' });
      fetchTodos();
    } catch (err) {
      setError(err?.error || Message.ERROR_ARCHIVE);
    }
  };

   const handleUnarchive = async (id) => {
    try {
      await apiRequest(`/api/todo/${id}/unarchive`, { method: 'PATCH' });
      fetchTodos();
    } catch (err) {
      setError(err?.error || Message.ERROR_DESARCHIVE);
    }
  };

  const handleShare = async (todoId, userIdToShare) => {
    if (!userIdToShare) return;
    try {
      await apiRequest(`/api/todo/${todoId}/share`, {
        method: 'POST',
        body: JSON.stringify({ userId: userIdToShare, canEdit: shareCanEdit, canDelete: shareCanDelete }),
      });
      setShareMsg('Todo partagé !');
      setTimeout(() => setShareMsg(''), 2000);
      setShareId('');
      setShareTodoId(null);
      setShareCanEdit(true);
      setShareCanDelete(false);
    } catch (err) {
      setShareMsg(err?.error || Message.ERROR_PAGE);
    }
  };

  const handleComplete = async (id) => {
    try {
      await apiRequest(`/api/todo/${id}/complete`, { method: 'PATCH' });
      fetchTodos();
    } catch (err) {
      setError(err?.error || Message.ERROR_COMPLETED);
    }
  };

  return (
  <div className="w-90% m-0 p-0 flex flex-col items-center justify-center " style={{ overflow: 'hidden', width: 'calc(100vw - 1rem)'}}>
    <div className="mb-10 w-full max-w-7xl flex flex-col items-center justify-center gap-6">
        {/* Filtres de recherche */}
        <TodoFilters
          search={search}
          setSearch={setSearch}
          filterUser={filterUser}
          setFilterUser={setFilterUser}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          showArchived={showArchived}
          setShowArchived={setShowArchived}
          users={users}
        />
        {/* Onglets sections */}
        <TodoTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {(activeTab === 'all' || activeTab === 'user') && (
        <>
          <div className="mb-10 w-1/2 justify-center items-center mx-auto">
            <TodoAddForm newTodo={newTodo} onChange={setNewTodo} onSubmit={handleAdd} />
          </div>

          {error && <div className="text-red-500 text-center mb-6 font-semibold text-lg">{error}</div>}

          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8" style={{ width: '90vw',  margin: 0, padding: 0, boxSizing: 'border-box', overflowX: 'hidden', justifyContent: 'flex-start' }}>
              {currentTodos.map(todo => {
                const isMine = todo.userId === userId;
                // Formulaire d'édition (inline)
                const editForm = (
                  editTodoId === todo.id && (
                    <form className="mt-6 border-t pt-6" onSubmit={handleEditSubmit}>
                      <h4 className="text-base font-semibold mb-3 text-purple-700">Modifier</h4>
                      <input type="text" value={editTodo.title} onChange={e => setEditTodo({ ...editTodo, title: e.target.value })} className="w-full border p-3 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-lg" required />
                      <textarea value={editTodo.description} onChange={e => setEditTodo({ ...editTodo, description: e.target.value })} className="w-full border p-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-lg" placeholder="Description (optionnelle)" />
                      <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className="flex-1">
                          <label className="block text-gray-700 font-semibold mb-2">Date et heure de début</label>
                          <input type="datetime-local" value={editTodo.startDate} onChange={e => setEditTodo({ ...editTodo, startDate: e.target.value })} className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-300 text-lg" />
                        </div>
                        <div className="flex-1">
                          <label className="block text-gray-700 font-semibold mb-2">Date et heure de fin</label>
                          <input type="datetime-local" value={editTodo.endDate} onChange={e => setEditTodo({ ...editTodo, endDate: e.target.value })} className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-300 text-lg" />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button type="submit" className="flex-1 bg-yellow-500 text-white p-3 rounded-xl shadow hover:bg-yellow-600 transition text-lg font-bold">Enregistrer</button>
                        <button type="button" onClick={() => setEditTodoId(null)} className="flex-1 bg-gray-300 text-gray-700 p-3 rounded-xl hover:bg-gray-400 transition text-lg font-bold">Annuler</button>
                      </div>
                    </form>
                  )
                );
                // Formulaire de partage (inline)
                const shareForm = (
                  shareTodoId === todo.id && (
                    <div className="mt-6 border-t pt-6 flex flex-col items-center w-full">
                      <h4 className="text-base font-semibold mb-3 text-orange-700">Partager avec un utilisateur</h4>
                      <div className="flex flex-col sm:flex-row gap-3 w-full min-w-0">
                        <input type="text" placeholder="Email de l'utilisateur" value={shareId} onChange={e => setShareId(e.target.value)} className="flex-1 min-w-0 border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-lg" />
                        <button onClick={() => { const userToShare = users.find(u => u.email === shareId); if (!userToShare) { setShareMsg('Utilisateur non trouvé'); return; } handleShare(todo.id, userToShare.id); }} className="bg-orange-600 text-white p-3 rounded-xl shadow hover:bg-orange-700 transition text-lg font-bold min-w-0">Partager</button>
                      </div>
                      <div className="flex gap-4 mt-4 items-center">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={shareCanEdit} onChange={e => setShareCanEdit(e.target.checked)} />
                          <span>Peut éditer</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={shareCanDelete} onChange={e => setShareCanDelete(e.target.checked)} />
                          <span>Peut supprimer</span>
                        </label>
                      </div>
                      {shareMsg && <span className={`mt-3 text-base font-semibold ${shareMsg.includes('Erreur') ? 'text-red-500' : 'text-green-600'}`}>{shareMsg}</span>}
                    </div>
                  )
                );
                return (
                  <TodoCard
                    key={todo.id}
                    todo={todo}
                    isMine={isMine}
                    onComplete={handleComplete}
                    onArchive={handleArchive}
                    onUnarchive={handleUnarchive}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onShare={setShareTodoId}
                    editTodoId={editTodoId}
                    editForm={editForm}
                    shareTodoId={shareTodoId}
                    shareForm={shareForm}
                  />
                );
              })}
            </div>
            {/* Pagination controls (nouveau composant) */}
            <Pagination
              page={page}
              totalPages={totalPages}
              setPage={setPage}
              perPage={perPage}
              setPerPage={setPerPage}
            />
          </>
        </>
      )}

      {activeTab === 'shared' && (
        <div className="mb-10 w-1/2 justify-center items-center mx-auto">
          <h2 className="text-3xl font-bold text-orange-700 mb-6">Todos partagés avec moi</h2>
          {sharedTodos.length === 0 ? (
            <div className="text-gray-500 text-center">Aucun todo partagé avec vous.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8" style={{ width: '90vw', margin: 0, padding: 0, boxSizing: 'border-box', overflowX: 'hidden', justifyContent: 'flex-start' }}>
              {sharedTodos.map(todo => {
                // Cherche le partage correspondant à l'utilisateur courant
                const myShare = Array.isArray(todo.shares) ? todo.shares.find(s => s.userId === userId) : null;
                return (
                  <div key={todo.id} className="bg-white p-8 flex flex-col justify-between transition-all duration-300 transform hover:scale-105">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className={`text-2xl font-bold mb-2 ${todo.completed ? 'text-gray-400 line-through' : 'text-orange-700'}`}>{todo.title}</h3>
                        <p className={`text-base ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>{todo.description}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold uppercase shadow ${todo.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{todo.completed ? 'Terminée' : 'En cours'}</span>
                    </div>
                    <div className="flex gap-4 justify-end items-center">
                      {myShare?.canEdit && (
                        <button onClick={() => handleEdit(todo)} title="Modifier la tâche" className="text-yellow-600 hover:text-yellow-800 transition"><Pencil className="w-7 h-7" /></button>
                      )}
                      {myShare?.canDelete && (
                        <button onClick={() => handleDelete(todo.id)} title="Supprimer la tâche" className="text-red-600 hover:text-red-800 transition"><Trash2 className="w-7 h-7" /></button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'historique' && (
        <TodoHistory historique={historique} users={users} error={error} />
      )}

      {/* Footer */}
      <div className="text-center text-gray-400 mt-12 text-base">
        &copy; {new Date().getFullYear()} Todos App. Tous droits réservés.
      </div>
    </div>
  );
};

export default Todos;