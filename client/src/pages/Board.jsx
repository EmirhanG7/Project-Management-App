import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getColumns, getCards, createColumn, moveCard, reorderCards } from '../api';
import Column from '../components/Column';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

export default function BoardPage() {
  const { boardId } = useParams();
  const [columns, setColumns] = useState([]);
  const [cardsMap, setCardsMap] = useState({});
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [error, setError] = useState('');
  const [activeCard, setActiveCard] = useState(null);
  const [overColumnId, setOverColumnId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  useEffect(() => {
    loadBoard();
  }, [boardId]);

  async function loadBoard() {
    try {
      const cols = await getColumns(boardId);
      setColumns(cols);

      const cards = {};
      for (const col of cols) {
        cards[col.id] = await getCards(boardId, col.id);
      }
      setCardsMap(cards);
    } catch (err) {
      console.error(err);
      setError('Veriler yüklenemedi.');
    }
  }

  const handleCreateColumn = async () => {
    if (!newColumnTitle.trim()) {
      setError('Başlık boş olamaz.');
      return;
    }
    try {
      await createColumn(boardId, { title: newColumnTitle });
      setNewColumnTitle('');
      setError('');
      await loadBoard();
    } catch (err) {
      console.error(err);
      setError('Kolon oluşturulamadı.');
    }
  };

  const findCardColumn = (cardId) => {
    for (const colId in cardsMap) {
      if (cardsMap[colId].some((c) => c.id.toString() === cardId)) {
        return colId;
      }
    }
    return null;
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const activeId = active.id;
    const sourceColId = findCardColumn(activeId);

    if (!sourceColId) return;

    const activeCard = cardsMap[sourceColId].find((c) => c.id.toString() === activeId);
    setActiveCard({ ...activeCard, columnId: sourceColId });
  };

  const handleDragOver = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    let activeColumnId = findCardColumn(activeId);
    let overColId = findCardColumn(overId);

    if (!overColId) {
      overColId = overId;
    }

    if (!activeColumnId || !overColId) return;

    if (activeColumnId !== overColId) {
      const activeCard = cardsMap[activeColumnId]?.find((c) => c.id.toString() === activeId);
      if (!activeCard) return;

      setCardsMap((prev) => {
        const newSourceCards = prev[activeColumnId].filter((c) => c.id.toString() !== activeId);
        const newTargetCards = [...(prev[overColId] || [])];

        const overIndex = newTargetCards.findIndex((c) => c.id.toString() === overId);
        if (overIndex === -1) {
          newTargetCards.push(activeCard);
        } else {
          newTargetCards.splice(overIndex, 0, activeCard);
        }

        return {
          ...prev,
          [activeColumnId]: newSourceCards,
          [overColId]: newTargetCards,
        };
      });

      setOverColumnId(overColId);
    } else {
      const columnCards = cardsMap[activeColumnId];
      const oldIndex = columnCards.findIndex((c) => c.id.toString() === activeId);
      const newIndex = columnCards.findIndex((c) => c.id.toString() === overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        setCardsMap((prev) => ({
          ...prev,
          [activeColumnId]: arrayMove(prev[activeColumnId], oldIndex, newIndex),
        }));
      }
    }
  };

  const handleDragEnd = async (event) => {
    const { active } = event;
    setActiveCard(null);

    if (!active) return;

    const activeId = active.id;
    const oldColumnId = activeCard?.columnId;
    const newColumnId = overColumnId || oldColumnId;

    if (!oldColumnId || !newColumnId) return;

    if (oldColumnId !== newColumnId) {
      try {
        const newCards = cardsMap[newColumnId] || [];
        const newOrder = newCards.findIndex((c) => c.id.toString() === activeId);

        await moveCard(boardId, oldColumnId, activeId, newColumnId, newOrder);

        const reordered = newCards.map((c, idx) => ({
          id: c.id,
          order: idx,
        }));

        await reorderCards(boardId, newColumnId, reordered);
      } catch (err) {
        console.error('Move sırasında hata:', err);
      }
    } else {
      try {
        const sourceCards = cardsMap[oldColumnId];
        const reordered = sourceCards.map((c, idx) => ({
          id: c.id,
          order: idx,
        }));

        await reorderCards(boardId, oldColumnId, reordered);
      } catch (err) {
        console.error('Reorder sırasında hata:', err);
      }
    }

    setOverColumnId(null);
  };

  const handleDragCancel = () => {
    setActiveCard(null);
    setOverColumnId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Pano: {boardId}</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Yeni liste başlığı"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
          />
          <Button onClick={handleCreateColumn}>
            Liste Ekle
          </Button>
        </div>

        <div className="flex items-center gap-6 overflow-x-auto">
          {columns.map((col) => (
            <Column
              key={col.id}
              column={col}
              cards={cardsMap[col.id] || []}
              boardId={boardId}
              onAddCard={loadBoard}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeCard ? (
          <div className="p-2 bg-gray-100 rounded shadow text-center font-semibold">
            {activeCard.title}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
