const API_BASE = import.meta.env.VITE_API_BASE;

async function getCsrfToken() {
  const res = await fetch(`${API_BASE}/csrf-token`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('CSRF token alınamadı');
  const { csrfToken } = await res.json();
  return csrfToken;
}


async function fetchApi(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const isStateChanging = ['POST','PUT','PATCH','DELETE'].includes(method);

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (isStateChanging) {
    const csrfToken = await getCsrfToken();
    headers['X-CSRF-Token'] = csrfToken;
  }

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    method,
    headers,
    credentials: 'include',
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || res.statusText);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const register = data =>
  fetchApi('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const verifyEmail = token =>
  fetchApi(`/auth/verify-email?token=${encodeURIComponent(token)}`
  );

export const resendVerification = email =>
  fetchApi('/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

export const login = data =>
  fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const logout = () =>
  fetchApi('/auth/logout', {
    method: 'POST',
  });

export const getMe = () =>
  fetchApi('/auth/me');



export const getBoards = () =>
  fetchApi('/boards');

export const createBoard = title =>
  fetchApi('/boards', {
    method: 'POST',
    body: JSON.stringify({ title }),
  });

export const updateBoard = (id, title) =>
  fetchApi(`/boards/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title }),
  });

export const deleteBoard = id =>
  fetchApi(`/boards/${id}`, {
    method: 'DELETE',
  });



export const getColumns = boardId =>
  fetchApi(`/boards/${boardId}/columns`);

export const createColumn = (boardId, data) =>
  fetchApi(`/boards/${boardId}/columns`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateColumn = (boardId, columnId, data) =>
  fetchApi(`/boards/${boardId}/columns/${columnId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteColumn = (boardId, columnId) =>
  fetchApi(`/boards/${boardId}/columns/${columnId}`, {
    method: 'DELETE',
  });




export const getCards = (boardId, columnId) =>
  fetchApi(`/boards/${boardId}/columns/${columnId}/cards`);

export const createCard = (boardId, columnId, data) =>
  fetchApi(`/boards/${boardId}/columns/${columnId}/cards`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateCard = (boardId, columnId, cardId, data) =>
  fetchApi(`/boards/${boardId}/columns/${columnId}/cards/${cardId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const moveCard = (boardId, columnId, cardId, newColumnId, order) =>
  fetchApi(
    `/boards/${boardId}/columns/${columnId}/cards/${cardId}/move`,
    {
      method: 'PATCH',
      body: JSON.stringify({ newColumnId, order }),
    }
  );

export const deleteCard = (boardId, columnId, cardId) =>
  fetchApi(`/boards/${boardId}/columns/${columnId}/cards/${cardId}`, {
    method: 'DELETE',
  });

export const reorderCards = (boardId, columnId, cardsList) =>
  fetchApi(`/boards/${boardId}/columns/${columnId}/cards/reorder`, {
    method: 'PATCH',
    body: JSON.stringify(cardsList),
  });
