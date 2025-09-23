import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { ClipboardList, CheckCircle2, Pencil, Trash2, Share2, History } from 'lucide-react';
import { Message } from '../utils/Message';

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
  const [editTodo, setEditTodo] = useState({ title: '', description: '' });
  const [fetchId, setFetchId] = useState('');
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 3;

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
    try {
      await apiRequest('/api/todo', {
        method: 'POST',
        body: JSON.stringify({ title: newTodo.title, completed: false, description: newTodo.description }),
      });
      setNewTodo({ title: '', description: '' });
      fetchTodos();
    } catch (err) {
      setError(err?.errors?.[0]?.message || err?.error || Message.ERROR_AJOUT);
    }
  };

  const handleEdit = (todo) => {
    setEditTodoId(todo.id);
    setEditTodo({ title: todo.title, description: todo.description || '' });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest(`/api/todo/${editTodoId}`, {
        method: 'PUT',
        body: JSON.stringify({ title: editTodo.title, completed: false, userId, description: editTodo.description }),
      });
      setEditTodoId(null);
      setEditTodo({ title: '', description: '' });
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
          {/* L'affichage du user connecté est maintenant dans le Header */}
  <div className="mb-10 w-full max-w-7xl flex flex-col items-center justify-center gap-6">
        {/* Filtres de recherche */}
  <div className="flex flex-col md:flex-row gap-4 items-center justify-center w-full">
          <input
            type="text"
            placeholder="Rechercher par titre ou description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-auto w-2/3 border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
          />
          <select
            value={filterUser}
            onChange={e => setFilterUser(e.target.value)}
            className="min-w-[180px] border border-gray-300 p-3 rounded-xl text-lg"
          >
            <option value="">Tous les utilisateurs</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name || u.nom || u.email}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="min-w-[160px] border border-gray-300 p-3 rounded-xl text-lg"
          >
            <option value="all">Tous</option>
            <option value="active">Actifs</option>
            <option value="completed">Terminés</option>
            <option value="archived">Archivés</option>
          </select>
          <button
            className={`min-w-[160px] px-5 py-2 rounded-xl font-semibold border transition-all duration-150 text-lg shadow ${showArchived ? 'bg-green-100 text-green-700 border-green-400' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
            onClick={() => setShowArchived(!showArchived)}
          >
            {showArchived ? 'Afficher les actifs' : 'Afficher les archivés'}
          </button>
        </div>
        {/* Onglets sections */}
  <div className="flex flex-wrap gap-4 justify-center items-center w-full">
          <button
            className={`flex items-center gap-2 px-5 sm:px-8 py-3 rounded-xl font-semibold border-b-4 transition-all duration-150 text-lg shadow ${activeTab === 'all' ? 'border-blue-600 text-blue-700 bg-white shadow-lg' : 'border-transparent text-gray-500 hover:bg-white hover:shadow-md'}`}
            onClick={() => setActiveTab('all')}
          >
            <ClipboardList className="w-6 h-6" /> Tous les Todos
          </button>
          <button
            className={`flex items-center gap-2 px-5 sm:px-8 py-3 rounded-xl font-semibold border-b-4 transition-all duration-150 text-lg shadow ${activeTab === 'user' ? 'border-blue-600 text-blue-700 bg-white shadow-lg' : 'border-transparent text-gray-500 hover:bg-white hover:shadow-md'}`}
            onClick={() => setActiveTab('user')}
          >
            <ClipboardList className="w-6 h-6" /> Mes Todos
          </button>
          <button
            className={`flex items-center gap-2 px-5 sm:px-8 py-3 rounded-xl font-semibold border-b-4 transition-all duration-150 text-lg shadow ${activeTab === 'shared' ? 'border-blue-600 text-blue-700 bg-white shadow-lg' : 'border-transparent text-gray-500 hover:bg-white hover:shadow-md'}`}
            onClick={() => setActiveTab('shared')}
          >
            <Share2 className="w-6 h-6" /> Partagés avec moi
          </button>
          <button
            className={`flex items-center gap-2 px-5 sm:px-8 py-3 rounded-xl font-semibold border-b-4 transition-all duration-150 text-lg shadow ${activeTab === 'historique' ? 'border-blue-600 text-blue-700 bg-white shadow-lg' : 'border-transparent text-gray-500 hover:bg-white hover:shadow-md'}`}
            onClick={() => setActiveTab('historique')}
          >
            <History className="w-6 h-6" /> Historique
          </button>
        </div>
      </div>

      {(activeTab === 'all' || activeTab === 'user') && (
        <>
          <div className="mb-10 w-1/2 justify-center items-center mx-auto">
            <form className="w-full bg-white justify-center items-center p-8 rounded-2xl shadow-2xl border border-green-100" onSubmit={handleAdd}>
              <h2 className="text-3xl font-bold text-green-700 mb-6">Ajouter une nouvelle tâche</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Titre du todo"
                  value={newTodo.title}
                  onChange={e => setNewTodo({ ...newTodo, title: e.target.value })}
                  className="flex-1 border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-lg"
                  required
                />
                <textarea
                  placeholder="Description (optionnelle)"
                  value={newTodo.description}
                  onChange={e => setNewTodo({ ...newTodo, description: e.target.value })}
                  className="flex-1 border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-lg"
                />
              </div>
              <button
                type="submit"
                className="mt-6 w-full bg-green-500 text-white p-4 rounded-xl shadow-lg hover:bg-green-600"
              >
                Ajouter
              </button>
            </form>
          </div>

          {error && <div className="text-red-500 text-center mb-6 font-semibold text-lg">{error}</div>}

          {/* Pagination logic and grid */}
          {(() => {
            let filteredTodos = activeTab === 'all' ? todos : todos.filter(todo => todo.userId === userId);
            // Filtre par recherche
            if (search.trim()) {
              filteredTodos = filteredTodos.filter(todo =>
                todo.title.toLowerCase().includes(search.toLowerCase()) ||
                (todo.description || '').toLowerCase().includes(search.toLowerCase())
              );
            }
            // Filtre par utilisateur
            if (filterUser) {
              filteredTodos = filteredTodos.filter(todo => String(todo.userId) === filterUser);
            }
            // Filtre par statut
            if (filterStatus === 'active') {
              filteredTodos = filteredTodos.filter(todo => !todo.completed && !todo.archived);
            } else if (filterStatus === 'completed') {
              filteredTodos = filteredTodos.filter(todo => todo.completed && !todo.archived);
            } else if (filterStatus === 'archived') {
              filteredTodos = filteredTodos.filter(todo => todo.archived);
            } else {
              filteredTodos = filteredTodos.filter(todo => showArchived ? todo.archived : !todo.archived);
            }
            // Afficher les plus récents en premier
            filteredTodos = filteredTodos.slice().reverse();
            const indexOfLastTodo = currentPage * todosPerPage;
            const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
            const currentTodos = filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo);
            const totalPages = Math.ceil(filteredTodos.length / todosPerPage);
            return (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8" style={{ width: '90vw',  margin: 0, padding: 0, boxSizing: 'border-box', overflowX: 'hidden', justifyContent: 'flex-start' }}>
                  {currentTodos.map(todo => {
                    const isMine = todo.userId === userId;
                    return (
                      <div
                        key={todo.id}
                        className={`p-8 flex flex-col justify-between transition-all duration-300 transform hover:scale-105 ${isMine ? 'bg-green-50 border-2 border-green-400' : 'bg-white'}`}
                      >
                        {/* ...existing card content... */}
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h3 className={`text-2xl font-bold mb-2 ${todo.completed ? 'text-gray-400 line-through' : isMine ? 'text-green-700' : 'text-green-700'}`}>{todo.title}</h3>
                            <p className={`text-base ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>{todo.description}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold uppercase shadow ${todo.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{todo.completed ? 'Terminée' : 'En cours'}</span>
                            {isMine && <span className="px-3 py-1 rounded-full bg-green-600 text-white text-xs font-bold shadow">Moi</span>}
                          </div>
                        </div>
                        <div className="flex gap-4 justify-end items-center">
                          {!todo.completed && !todo.archived && (
                            <button onClick={() => handleComplete(todo.id)} title="Marquer comme terminée" className="text-green-600 hover:text-green-800 transition"><CheckCircle2 className="w-7 h-7" /></button>
                          )}
                          {!todo.archived && (
                            <button onClick={() => handleArchive(todo.id)} title="Archiver la tâche" className="text-gray-600 hover:text-gray-800 transition"><span className="w-7 h-7">🗄️</span></button>
                          )}
                          {todo.archived && (
                            <button onClick={() => handleUnarchive(todo.id)} title="Désarchiver la tâche" className="text-green-600 hover:text-green-800 transition"><span className="w-7 h-7">🔄</span></button>
                          )}
                          <button onClick={() => handleEdit(todo)} title="Modifier la tâche" className="text-yellow-600 hover:text-yellow-800 transition"><Pencil className="w-7 h-7" /></button>
                          <button onClick={() => handleDelete(todo.id)} title="Supprimer la tâche" className="text-red-600 hover:text-red-800 transition"><Trash2 className="w-7 h-7" /></button>
                          <button onClick={() => setShareTodoId(todo.id)} title="Partager la tâche" className="text-orange-600 hover:text-orange-800 transition"><Share2 className="w-7 h-7" /></button>
                        </div>
                        {editTodoId === todo.id && (
                          <form className="mt-6 border-t pt-6" onSubmit={handleEditSubmit}>
                            <h4 className="text-base font-semibold mb-3 text-purple-700">Modifier</h4>
                            <input type="text" value={editTodo.title} onChange={e => setEditTodo({ ...editTodo, title: e.target.value })} className="w-full border p-3 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-lg" required />
                            <textarea value={editTodo.description} onChange={e => setEditTodo({ ...editTodo, description: e.target.value })} className="w-full border p-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-lg" placeholder="Description (optionnelle)" />
                            <div className="flex gap-3">
                              <button type="submit" className="flex-1 bg-yellow-500 text-white p-3 rounded-xl shadow hover:bg-yellow-600 transition text-lg font-bold">Enregistrer</button>
                              <button type="button" onClick={() => setEditTodoId(null)} className="flex-1 bg-gray-300 text-gray-700 p-3 rounded-xl hover:bg-gray-400 transition text-lg font-bold">Annuler</button>
                            </div>
                          </form>
                        )}
                        {shareTodoId === todo.id && (
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
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* Pagination controls */}
                <div className="flex justify-center items-center mt-8 gap-2">
                  <button
                    className="px-4 py-2 rounded-lg bg-orange-100 text-orange-700 font-semibold shadow hover:bg-orange-200 disabled:opacity-50"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Précédent
                  </button>
                  <span className="px-3 py-2 text-lg font-bold text-orange-700">Page {currentPage} / {totalPages}</span>
                  <button
                    className="px-4 py-2 rounded-lg bg-orange-100 text-orange-700 font-semibold shadow hover:bg-orange-200 disabled:opacity-50"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Suivant
                  </button>
                </div>
              </>
            );
          })()}
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
  <div className="bg-white p-8 rounded-2xl shadow-2xl border border-green-100 w-full">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-green-700"><History className="w-8 h-8 text-orange-500" /> Historique des activités</h2>
          {error && <div className="text-red-500 mb-3 text-lg font-semibold">{error}</div>}
          <div className="overflow-x-auto">
            <table className="min-w-full text-base rounded-xl overflow-hidden">
              <thead className="bg-orange-100">
                <tr className="text-left text-orange-700 uppercase tracking-wider">
                  <th className="px-5 py-4 font-semibold">Action</th>
                  <th className="px-5 py-4 font-semibold">Utilisateur</th>
                  <th className="px-5 py-4 font-semibold">Todo</th>
                  <th className="px-5 py-4 font-semibold">Date</th>
                  <th className="px-5 py-4 font-semibold">Détails</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100">
                {historique.map(item => {
                  const user = users.find(u => u.id === item.userId);
                  return (
                    <tr key={item.id} className="hover:bg-green-50 transition">
                      <td className="px-5 py-4 text-blue-700 font-medium">{item.action}</td>
                      <td className="px-5 py-4 text-gray-700">{user ? user.nom || user.name || user.email : item.userId}</td>
                      <td className="px-5 py-4 text-gray-700">{item.todoId || '-'}</td>
                      <td className="px-5 py-4 text-gray-500">{item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}</td>
                      <td className="px-5 py-4 text-gray-500 max-w-xs truncate">{item.details || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-gray-400 mt-12 text-base">
        &copy; {new Date().getFullYear()} Todos App. Tous droits réservés.
      </div>
    </div>
  );
};

export default Todos;