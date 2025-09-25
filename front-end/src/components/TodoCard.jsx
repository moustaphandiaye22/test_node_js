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
    className={`rounded-3xl shadow-xl border border-gray-100 p-6 flex flex-col gap-1 bg-white transition-all duration-300 hover:shadow-2xl hover:scale-[1.03]  mx-auto min-h-[40px] ${isMine ? 'ring-2 ring-green-400' : ''}`}
  >
    {todo.imageUrl && (
      <div className="flex justify-center items-center mb-2">
        <img
          src={todo.imageUrl}
          alt="Todo"
          className="rounded-2xl border border-gray-200 shadow-lg object-cover"
          style={{ width: '320px', height: '180px', maxWidth: '100%', maxHeight: '180px' }}
        />
      </div>
    )}
    {todo.audioUrl && (
      <div className="flex justify-center items-center mb-2">
        <audio controls src={todo.audioUrl} className="w-full" />
      </div>
    )}
    <div className="flex flex-row justify-between items-start gap-1">
      <div className="flex-1">
        <h3 className={`text-xl font-bold mb-1 ${todo.completed ? 'text-gray-400 line-through' : 'text-green-700'}`}>{todo.title}</h3>
        <p className={`text-sm ${todo.completed ? 'text-gray-400' : 'text-gray-700'}`}>{todo.description}</p>
        <div className="mt-2 text-xs text-gray-600">
          {todo.startDate && (
            <div>
              <span className="font-semibold">Début :</span> {new Date(todo.startDate).toLocaleString()}
            </div>
          )}
          {todo.endDate && (
            <div>
              <span className="font-semibold">Fin :</span> {new Date(todo.endDate).toLocaleString()}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 min-w-[90px]">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase shadow ${todo.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{todo.completed ? 'Terminée' : 'En cours'}</span>
        {isMine && <span className="px-2 py-1 rounded-full bg-green-600 text-white text-[10px] font-bold shadow">Moi</span>}
      </div>
    </div>
    <div className="flex gap-3 justify-end items-center mt-2">
      {!todo.completed && !todo.archived && (
        <button onClick={() => onComplete(todo.id)} title="Marquer comme terminée" className="text-green-600 hover:text-green-800 transition"><CheckCircle2 className="w-6 h-6" /></button>
      )}
      {!todo.archived && (
        <button onClick={() => onArchive(todo.id)} title="Archiver la tâche" className="text-gray-600 hover:text-gray-800 transition"><span className="w-6 h-6">🗄️</span></button>
      )}
      {todo.archived && (
        <button onClick={() => onUnarchive(todo.id)} title="Désarchiver la tâche" className="text-green-600 hover:text-green-800 transition"><span className="w-6 h-6">🔄</span></button>
      )}
      <button onClick={() => onEdit(todo)} title="Modifier la tâche" className="text-yellow-600 hover:text-yellow-800 transition"><Pencil className="w-6 h-6" /></button>
      <button onClick={() => onDelete(todo.id)} title="Supprimer la tâche" className="text-red-600 hover:text-red-800 transition"><Trash2 className="w-6 h-6" /></button>
      <button onClick={() => onShare(todo.id)} title="Partager la tâche" className="text-orange-600 hover:text-orange-800 transition"><Share2 className="w-6 h-6" /></button>
    </div>
    {editTodoId === todo.id && editForm}
    {shareTodoId === todo.id && shareForm}
  </div>
);

export default TodoCard;
