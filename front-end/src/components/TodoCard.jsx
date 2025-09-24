import React from 'react';
import { CheckCircle2, Pencil, Trash2, Share2 } from 'lucide-react';

const TodoCard = ({
  todo,
  isMine,
  onComplete,
  onArchive,
  onUnarchive,
  onEdit,
  onDelete,
  onShare,
  editTodoId,
  editForm,
  shareTodoId,
  shareForm
}) => (
  <div
    className={`p-8 flex flex-col justify-between transition-all duration-300 transform hover:scale-105 ${isMine ? 'bg-green-50 border-2 border-green-400' : 'bg-white'}`}
  >
    <div className="flex justify-between items-start mb-6">
      <div>
        <h3 className={`text-2xl font-bold mb-2 ${todo.completed ? 'text-gray-400 line-through' : isMine ? 'text-green-700' : 'text-green-700'}`}>{todo.title}</h3>
        <p className={`text-base ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>{todo.description}</p>
        {todo.imageUrl && (
          <img
            src={todo.imageUrl}
            alt="Todo"
            className="mt-3 max-h-48 rounded-xl border border-gray-200 shadow"
            style={{ maxWidth: '100%', objectFit: 'cover' }}
          />
        )}
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className={`px-4 py-2 rounded-full text-sm font-semibold uppercase shadow ${todo.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{todo.completed ? 'Terminée' : 'En cours'}</span>
        {isMine && <span className="px-3 py-1 rounded-full bg-green-600 text-white text-xs font-bold shadow">Moi</span>}
      </div>
    </div>
    <div className="flex gap-4 justify-end items-center">
      {!todo.completed && !todo.archived && (
        <button onClick={() => onComplete(todo.id)} title="Marquer comme terminée" className="text-green-600 hover:text-green-800 transition"><CheckCircle2 className="w-7 h-7" /></button>
      )}
      {!todo.archived && (
        <button onClick={() => onArchive(todo.id)} title="Archiver la tâche" className="text-gray-600 hover:text-gray-800 transition"><span className="w-7 h-7">🗄️</span></button>
      )}
      {todo.archived && (
        <button onClick={() => onUnarchive(todo.id)} title="Désarchiver la tâche" className="text-green-600 hover:text-green-800 transition"><span className="w-7 h-7">🔄</span></button>
      )}
      <button onClick={() => onEdit(todo)} title="Modifier la tâche" className="text-yellow-600 hover:text-yellow-800 transition"><Pencil className="w-7 h-7" /></button>
      <button onClick={() => onDelete(todo.id)} title="Supprimer la tâche" className="text-red-600 hover:text-red-800 transition"><Trash2 className="w-7 h-7" /></button>
      <button onClick={() => onShare(todo.id)} title="Partager la tâche" className="text-orange-600 hover:text-orange-800 transition"><Share2 className="w-7 h-7" /></button>
    </div>
    {editTodoId === todo.id && editForm}
    {shareTodoId === todo.id && shareForm}
  </div>
);

export default TodoCard;
