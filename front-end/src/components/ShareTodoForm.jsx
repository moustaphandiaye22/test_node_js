import React from 'react';

const ShareTodoForm = ({ users, shareId, setShareId, shareCanEdit, setShareCanEdit, shareCanDelete, setShareCanDelete, shareMsg, onShare }) => (
  <div className="mt-6 border-t pt-6 flex flex-col items-center w-full max-w-lg mx-auto overflow-auto">
    <h4 className="text-base font-semibold mb-3 text-orange-700">Partager avec un utilisateur</h4>
    <div className="flex flex-col sm:flex-row gap-3 w-full min-w-0">
      <input type="text" placeholder="Email de l'utilisateur" value={shareId} onChange={e => setShareId(e.target.value)} className="flex-1 min-w-0 border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-lg" />
      <button onClick={onShare} className="bg-orange-600 text-white p-3 rounded-xl shadow hover:bg-orange-700 transition text-lg font-bold min-w-0">Partager</button>
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
);

export default ShareTodoForm;
