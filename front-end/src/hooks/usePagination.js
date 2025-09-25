import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export function usePagination(totalItems) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('perPage') || '6', 10);
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

  const setPage = (newPage) => {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      page: newPage,
      perPage,
    });
  };

  const setPerPage = (newPerPage) => {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      page: 1,
      perPage: newPerPage,
    });
  };

  return useMemo(() => ({
    page,
    perPage,
    totalPages,
    setPage,
    setPerPage,
  }), [page, perPage, totalPages]);
}
