import React, { useEffect, useState } from 'react';
import { usePagination } from '../hooks/usePagination';
import Pagination from '../components/Pagination';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { History, Pencil, Trash2 } from 'lucide-react';
import TodoTabs from '../components/TodoTabs';
import TodoCard from '../components/TodoCard';
import TodoAddForm from '../components/TodoAddForm';
import EditTodoForm from '../components/EditTodoForm';
import ShareTodoForm from '../components/ShareTodoForm';
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
      setError(Message.ADD_DATE);
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
        headers: { 'Content-Type': 'application/json' },
        body: { userId: userIdToShare, canEdit: shareCanEdit, canDelete: shareCanDelete },
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
  <div className="w-full m-0 p-0 flex flex-col items-center justify-center overflow-x-hidden">
    <div className="mb-10 w-full max-w-7xl flex flex-col items-center justify-center gap-6 px-2 sm:px-4 md:px-8">
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
          <div className="mb-10 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 justify-center items-center mx-auto px-2">
            <TodoAddForm newTodo={newTodo} onChange={setNewTodo} onSubmit={handleAdd} />
          </div>

          {error && <div className="text-red-500 text-center mb-6 font-semibold text-lg">{error}</div>}

          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full" style={{ margin: 0, padding: 0, boxSizing: 'border-box', justifyContent: 'flex-start' }}>
              {currentTodos.map(todo => {
                const isMine = todo.userId === userId;
                // Formulaire d'édition via composant dédié
                const editForm = (
                  editTodoId === todo.id && (
                    <EditTodoForm
                      editTodo={editTodo}
                      setEditTodo={setEditTodo}
                      onSubmit={handleEditSubmit}
                      onCancel={() => setEditTodoId(null)}
                    />
                  )
                );
                // Formulaire de partage via composant dédié
                const shareForm = (
                  shareTodoId === todo.id && (
                    <ShareTodoForm
                      users={users}
                      shareId={shareId}
                      setShareId={setShareId}
                      shareCanEdit={shareCanEdit}
                      setShareCanEdit={setShareCanEdit}
                      shareCanDelete={shareCanDelete}
                      setShareCanDelete={setShareCanDelete}
                      shareMsg={shareMsg}
                      onShare={() => {
                        const userToShare = users.find(u => u.email === shareId);
                        if (!userToShare) {
                          setShareMsg('Utilisateur non trouvé');
                          return;
                        }
                        handleShare(todo.id, userToShare.id);
                      }}
                    />
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
  <div className="mb-10 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 justify-center items-center mx-auto px-2">
          <h2 className="text-3xl font-bold text-orange-700 mb-6">Todos partagés avec moi</h2>
          {sharedTodos.length === 0 ? (
            <div className="text-gray-500 text-center">Aucun todo partagé avec vous.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full" style={{ margin: 0, padding: 0, boxSizing: 'border-box', justifyContent: 'flex-start' }}>
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