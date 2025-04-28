const API_BASE = import.meta.env.VITE_API_BASE;

function getToken() {
  return localStorage.getItem('token');
}

async function fetchApi(url, options = {}) {
  const token = getToken();
  const res = await fetch(API_BASE + url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || res.statusText);
  }

  if (res.status === 204) return null;
  return res.json();
}


export const register = (data) =>
  fetchApi('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const login = (data) =>
  fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const getMe = () =>
  fetchApi('/auth/me');


export const getBoards = () =>
  fetchApi('/boards');

export const createBoard = (title) =>
  fetchApi('/boards', {
    method: 'POST',
    body: JSON.stringify({ title }),
  });

export const deleteBoard = (id) =>
  fetchApi(`/boards/${id}`, {
    method: 'DELETE',
  });

export const updateBoard = (id, title) =>
  fetchApi(`/boards/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title }),
  });


export const getColumns = (boardId) =>
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

export const deleteCard = async (boardId, columnId, cardId) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/boards/${boardId}/columns/${columnId}/cards/${cardId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Kart silinemedi.');

  return res.json();
};

export const moveCard = async (boardId, columnId, cardId, newColumnId, order) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/boards/${boardId}/columns/${columnId}/cards/${cardId}/move`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newColumnId, order }),
  });

  if (!res.ok) throw new Error('Kart taşınamadı.');
  return res.json();
};


export const reorderCards = async (boardId, columnId, cardsList) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/boards/${boardId}/columns/${columnId}/cards/reorder`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cardsList),
  });

  if (!res.ok) throw new Error('Kart sıralaması güncellenemedi.');
  return res.json();
};





