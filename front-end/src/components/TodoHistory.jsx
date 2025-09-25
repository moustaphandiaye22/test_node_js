import React from 'react';
import { History } from 'lucide-react';

const TodoHistory = ({ historique, users, error }) => (
  <div className="bg-white p-8 rounded-2xl shadow-2xl border border-green-100 w-full">
    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-green-700">
      <History className="w-8 h-8 text-orange-500" /> Historique des activités
    </h2>
    {error && <div className="text-red-500 mb-3 text-lg font-semibold">{error}</div>}
    <div className="overflow-x-auto">
      <table className="min-w-full text-base rounded-xl overflow-hidden">
        <thead className="bg-orange-100">
          <tr className="text-left text-orange-700 uppercase tracking-wider">
            <th className="px-5 py-4 font-semibold">Action</th>
            <th className="px-5 py-4 font-semibold">Utilisateur</th>
            <th className="px-5 py-4 font-semibold">Todo</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-green-100">
          {historique.map(item => {
            const user = users.find(u => u.id === item.userId);
            return (
              <tr key={item.id} className="hover:bg-green-50 transition">
                <td className="px-5 py-4 text-green-700 font-medium">{item.action}</td>
                <td className="px-5 py-4 text-gray-700">{user ? user.nom || user.name || user.email : item.userId}</td>
                <td className="px-5 py-4 text-gray-700">{item.todoId || '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default TodoHistory;
