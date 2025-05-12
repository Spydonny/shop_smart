export const API_BASE = 'shopsmartapi-production.up.railway.app/api';

export const createList = async (name) => {
  const res = await fetch(`${API_BASE}/lists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return res.json();
}

export const fetchLists = async () => {
  const res = await fetch(`${API_BASE}/lists`);
  return res.json();
};

export const fetchListById = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/lists/${id}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Error fetching list by ID:', err);
    return null;
  }
};

let pollingAbortController = null;

export const pollListById = async (id, onUpdate, getLastUpdated) => {
  // Отменяем прошлый poll, если есть
  if (pollingAbortController) {
    pollingAbortController.abort();
  }

  pollingAbortController = new AbortController();

  const poll = async () => {
    const lastUpdated = getLastUpdated?.() || 0.0;

    try {
      const res = await fetch(`${API_BASE}/lists/${id}/poll?last_updated=${lastUpdated}`, {
        signal: pollingAbortController.signal,
      });

      if (res.status === 200) {
        const data = await res.json();
        onUpdate(data); // обновить UI
      }

      // если 204 или 200 — делаем следующий poll
      if (res.status === 204 || res.status === 200) {
        setTimeout(poll, 100); // перезапускаем poll через паузу
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Polling error:', err);
        setTimeout(poll, 2000); // если ошибка, пробуем позже
      }
    }
  };

  poll();
};

export const stopPolling = () => {
  if (pollingAbortController) {
    pollingAbortController.abort();
    pollingAbortController = null;
  }
};


export const addItem = async (listId, item) => {
  await fetch(`${API_BASE}/lists/${listId}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
};

export const updateItem = async (listId, itemId, data) => {
  await fetch(`${API_BASE}/lists/${listId}/items/${itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

export const deleteItem = async (listId, itemId) => {
  await fetch(`${API_BASE}/lists/${listId}/items/${itemId}`, { method: 'DELETE' });
};

export const deleteList = async (listId) => {
  await fetch(`${API_BASE}/lists/${listId}`, { method: 'DELETE' });
};

export const generateItems = async (listId, promt) => {
  await fetch(`${API_BASE}/lists/${listId}/generate_items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: promt }),
  });
};
