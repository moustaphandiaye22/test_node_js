import React from 'react';
import { ClipboardList, History, Share2 } from 'lucide-react';

const TodoTabs = ({ activeTab, setActiveTab }) => (
  <div className="flex flex-wrap gap-4 justify-center items-center w-full">
    <button
      className={`flex items-center gap-2 px-5 sm:px-8 py-3 rounded-xl font-semibold border-b-4 transition-all duration-150 text-lg shadow ${activeTab === 'all' ? 'border-green-600 text-green-700 bg-white shadow-lg' : 'border-transparent text-gray-500 hover:bg-white hover:shadow-md'}`}
      onClick={() => setActiveTab('all')}
    >
      <ClipboardList className="w-6 h-6" /> Tous les Todos
    </button>
    <button
      className={`flex items-center gap-2 px-5 sm:px-8 py-3 rounded-xl font-semibold border-b-4 transition-all duration-150 text-lg shadow ${activeTab === 'user' ? 'border-green-600 text-green-700 bg-white shadow-lg' : 'border-transparent text-gray-500 hover:bg-white hover:shadow-md'}`}
      onClick={() => setActiveTab('user')}
    >
      <ClipboardList className="w-6 h-6" /> Mes Todos
    </button>
    <button
      className={`flex items-center gap-2 px-5 sm:px-8 py-3 rounded-xl font-semibold border-b-4 transition-all duration-150 text-lg shadow ${activeTab === 'shared' ? 'border-green-600 text-green-700 bg-white shadow-lg' : 'border-transparent text-gray-500 hover:bg-white hover:shadow-md'}`}
      onClick={() => setActiveTab('shared')}
    >
      <Share2 className="w-6 h-6" /> Partagés avec moi
    </button>
    <button
      className={`flex items-center gap-2 px-5 sm:px-8 py-3 rounded-xl font-semibold border-b-4 transition-all duration-150 text-lg shadow ${activeTab === 'historique' ? 'border-green-600 text-green-700 bg-white shadow-lg' : 'border-transparent text-gray-500 hover:bg-white hover:shadow-md'}`}
      onClick={() => setActiveTab('historique')}
    >
      <History className="w-6 h-6" /> Historique
    </button>
  </div>
);

export default TodoTabs;
