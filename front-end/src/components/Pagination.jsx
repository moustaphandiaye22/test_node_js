import React from 'react';

const Pagination = ({ page, totalPages, setPage, perPage, setPerPage }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
      <div className="flex gap-2">
        <button
          className="px-3 py-2 rounded bg-gray-100 text-gray-700 font-semibold shadow hover:bg-gray-200 disabled:opacity-50"
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
        >
          Précédent
        </button>
        <span className="px-3 py-2 text-lg font-bold text-green-700">
          Page {page} / {totalPages}
        </span>
        <button
          className="px-3 py-2 rounded bg-gray-100 text-gray-700 font-semibold shadow hover:bg-gray-200 disabled:opacity-50"
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
        >
          Suivant
        </button>
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="perPage" className="text-gray-700 font-medium">Par page :</label>
        <select
          id="perPage"
          value={perPage}
          onChange={e => setPerPage(Number(e.target.value))}
          className="border border-gray-300 p-2 rounded text-lg"
        >
          <option value={6}>6</option>
          <option value={12}>12</option>
          <option value={24}>24</option>
        </select>
      </div>
    </div>
  );
};

export default Pagination;
