import React from 'react';
import AudioRecorder from './AudioRecorder';


const TodoAddForm = ({ newTodo, onChange, onSubmit }) => (
  <form className="w-40% bg-white justify-center items-center p-8 rounded-2xl shadow-2xl border border-green-100" onSubmit={onSubmit} encType="multipart/form-data">
    <h2 className="text-3xl font-bold text-green-700 mb-6">Ajouter une nouvelle tâche</h2>
    <div className="flex flex-col sm:flex-row gap-4">
      <input
        type="text"
        placeholder="Titre du todo"
        value={newTodo.title}
        onChange={e => onChange({ ...newTodo, title: e.target.value })}
        className="flex-1 border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-lg"
      />
      <textarea
        placeholder="Description (optionnelle)"
        value={newTodo.description}
        onChange={e => onChange({ ...newTodo, description: e.target.value })}
        className="flex-1 border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-lg"
      />
    </div>
    <div className="mt-4 flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <label className="block text-gray-700 font-semibold mb-2">Date et heure de début</label>
        <input
          type="datetime-local"
          value={newTodo.startDate || ''}
          onChange={e => onChange({ ...newTodo, startDate: e.target.value })}
          className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-lg"
        />
      </div>
      <div className="flex-1">
        <label className="block text-gray-700 font-semibold mb-2">Date et heure de fin</label>
        <input
          type="datetime-local"
          value={newTodo.endDate || ''}
          onChange={e => onChange({ ...newTodo, endDate: e.target.value })}
          className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-lg"
        />
      </div>
    </div>
    <div className="mt-4">
      <label className="block text-gray-700 font-semibold mb-2">Photo (optionnelle)</label>
      <input
        type="file"
        accept="image/*"
        onChange={e => onChange({ ...newTodo, image: e.target.files[0] })}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
      />
    </div>
    <div className="mt-4">
      <label className="block text-gray-700 font-semibold mb-2">Message vocal (optionnel)</label>
      <AudioRecorder onAudioRecorded={audioBlob => onChange({ ...newTodo, audio: audioBlob })} />
    </div>
    <button
      type="submit"
      className="mt-6 w-full bg-green-500 text-white p-4 rounded-xl shadow-lg hover:bg-green-600"
    >
      Ajouter
    </button>
  </form>
);

export default TodoAddForm;
