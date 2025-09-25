import React from 'react';

const EditTodoForm = ({ editTodo, setEditTodo, onSubmit, onCancel }) => (
  <form className="mt-6 border-t pt-6 w-full max-w-lg mx-auto overflow-auto" onSubmit={onSubmit}>
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
      <button type="button" onClick={onCancel} className="flex-1 bg-gray-300 text-gray-700 p-3 rounded-xl hover:bg-gray-400 transition text-lg font-bold">Annuler</button>
    </div>
  </form>
);

export default EditTodoForm;
