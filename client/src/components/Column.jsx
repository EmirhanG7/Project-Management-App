import { useState, useEffect } from 'react';
import { createCard, deleteColumn, deleteCard } from '../api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ConfirmModal from './ConfirmModal';
import CardItem from './CardItem';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

export default function Column({ column, cards = [], onAddCard, boardId }) {
  const [newCardTitle, setNewCardTitle] = useState('');
  const [error, setError] = useState('');
  const [showDeleteColumnModal, setShowDeleteColumnModal] = useState(false);
  const [showDeleteCardModal, setShowDeleteCardModal] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);

  const { setNodeRef } = useDroppable({
    id: column.id.toString(),
  });

  const hasCards = cards.length > 0;

  const handleCreateCard = async () => {
    if (!newCardTitle.trim()) {
      setError('Kart başlığı boş olamaz.');
      return;
    }
    try {
      await createCard(boardId, column.id, { title: newCardTitle });
      setNewCardTitle('');
      setError('');
      if (onAddCard) {
        onAddCard();
      }
    } catch (err) {
      console.error(err);
      setError('Kart oluşturulamadı.');
    }
  };

  const handleConfirmDeleteColumn = async () => {
    try {
      await deleteColumn(boardId, column.id);
      setShowDeleteColumnModal(false);
      if (onAddCard) {
        onAddCard();
      }
    } catch (err) {
      console.error(err);
      setError('Liste silinemedi.');
    }
  };

  const handleConfirmDeleteCard = async () => {
    try {
      await deleteCard(boardId, column.id, selectedCardId);
      setSelectedCardId(null);
      setShowDeleteCardModal(false);
      if (onAddCard) {
        onAddCard();
      }
    } catch (err) {
      console.error(err);
      setError('Kart silinemedi.');
    }
  };

  return (
    <Card
      ref={setNodeRef}
      className="bg-white p-4 rounded shadow min-w-80 min-h-[85vh] flex flex-col justify-between flex-shrink-0"
    >
      <div className='flex flex-col gap-6'>
        <ConfirmModal
          isOpen={showDeleteColumnModal}
          title="Bu listeyi silmek istiyor musun?"
          onConfirm={handleConfirmDeleteColumn}
          onCancel={() => setShowDeleteColumnModal(false)}
        />
        <ConfirmModal
          isOpen={showDeleteCardModal}
          title="Bu kartı silmek istiyor musun?"
          onConfirm={handleConfirmDeleteCard}
          onCancel={() => {
            setSelectedCardId(null);
            setShowDeleteCardModal(false);
          }}
        />

        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2 flex-shrink-0">
          <h2 className="font-bold">{column.title}</h2>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setShowDeleteColumnModal(true)}
          >
            ×
          </Button>
        </div>

        <SortableContext
          items={hasCards ? cards.map((c) => c.id.toString()) : [`empty-${column.id}`]}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2 mb-4 min-h-[100px]">
            {hasCards ? (
              cards.map((card) => (
                <CardItem
                  key={card.id}
                  card={card}
                  onDelete={() => {
                    setSelectedCardId(card.id);
                    setShowDeleteCardModal(true);
                  }}
                />
              ))
            ) : (
              <div className="h-20 bg-transparent rounded border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                Kart ekleyin veya sürükleyin.
              </div>
            )}
          </div>
        </SortableContext>
      </div>

      <div className="flex flex-col space-y-2">
        <Input
          placeholder="Yeni kart adı"
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
        />
        <Button onClick={handleCreateCard}>
          Kart Ekle
        </Button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </Card>
  );
}
