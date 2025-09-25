import React from 'react';

const TodoFilters = ({
  search, setSearch,
  filterUser, setFilterUser,
  filterStatus, setFilterStatus,
  showArchived, setShowArchived,
  users
}) => (
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
);

export default TodoFilters;
