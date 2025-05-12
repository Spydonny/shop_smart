import React, { useState } from 'react';

export default function ListView({
  list,
  onToggleItem,
  onRemoveItem,
  onAddItem,
  onGenerateItems,
  onDeleteList,
  onReload,
}) {
  const [newTitle, setNewTitle] = useState('');
  const [newQty, setNewQty] = useState(1);
  const [prompt, setPrompt] = useState('');

  return (
    <div>
      <h2>{list.name}</h2>
      <button onClick={onReload}>Обновить</button>
      <button onClick={onDeleteList}>Удалить список</button>

      <ul>
        {list.items.map(item => (
          <li key={item.id}>
            <label style={{ textDecoration: item.is_bought ? 'line-through' : 'none' }}>
              <input
                type="checkbox"
                checked={item.is_bought}
                onChange={() => onToggleItem(item.id, !item.is_bought)}
              />
              {item.title} — {item.quantity}
            </label>
            <button onClick={() => onRemoveItem(item.id)}>🗑️</button>
          </li>
        ))}
      </ul>

      <div>
        <input
          placeholder="Новый товар"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
        />
        <input
          type="number"
          min="1"
          value={newQty}
          onChange={e => setNewQty(Number(e.target.value))}
        />
        <button
          onClick={() => {
            onAddItem(newTitle, newQty);
            setNewTitle('');
            setNewQty(1);
          }}
        >
          Добавить
        </button>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <input
          placeholder="Промпт для генерации"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
        <button onClick={() => onGenerateItems(prompt)}>Сгенерировать</button>
      </div>
    </div>
);
}
