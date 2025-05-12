import { useState, useEffect, useRef } from 'react';
import {
  createList,
  fetchLists,
  addItem,
  updateItem,
  deleteItem,
  deleteList,
  generateItems,
  pollListById,
  stopPolling,
} from '@/api'; 

export const useShoppingLists = () => {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [loading, setLoading] = useState(false);
  const lastUpdatedRef = useRef(0);

  // Обновление состояния при новых данных из polling
  const handlePollUpdate = (data) => {
    console.log('Polling update received:', data);
    setSelectedList(data);
    lastUpdatedRef.current = data.updated_at;
    setLoading(false);
  };

  // Функция для передачи в polling
  const getLastUpdated = () => lastUpdatedRef.current;

  const loadLists = async () => {
    setLoading(true);
    const data = await fetchLists();
    setLists(data);
    setLoading(false);
  };

  const selectListById = (id) => {
    if (!id) return;
    setLoading(true);
    // Отменяем предыдущий polling
    stopPolling();
    // Запускаем новый long-polling
    pollListById(id, handlePollUpdate, getLastUpdated);
  };

  const handleCreateList = async (name) => {
    const newList = await createList(name);
    setLists((prev) => [...prev, newList]);
  };

  const handleDeleteList = async (listId) => {
    await deleteList(listId);
    setLists((prev) => prev.filter((list) => list.id !== listId));
    if (selectedList?.id === listId) setSelectedList(null);
  };

  const handleAddItem = async (listId, item) => {
    await addItem(listId, item);
    // Ожидаем обновление через polling
  };

  const handleUpdateItem = async (listId, itemId, data) => {
    await updateItem(listId, itemId, data);
    // Ожидаем новый ответ от polling
  };

  const handleDeleteItem = async (listId, itemId) => {
    await deleteItem(listId, itemId);
    // Ожидаем обновление через polling
  };

  const handleGenerateItems = async (listId, prompt) => {
    await generateItems(listId, prompt);
    // Ожидаем генерацию через polling
  };

  // Загрузка списков при монтировании
  useEffect(() => {
    loadLists();
  }, []);

  // Останавливаем polling при размонтировании
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  return {
    lists,
    selectedList,
    loading,
    loadLists,
    selectListById,
    handleCreateList,
    handleDeleteList,
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
    handleGenerateItems,
    stopPolling, // Экспортируем для компонента
  };
};
