import { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { createCard, deleteColumn, deleteCard } from '../api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import ConfirmModal from './ConfirmModal'
import CardItem from './CardItem'
import {Loader2} from "lucide-react";
import SubmitButton from "@/components/SubmitButton.jsx";

export default function Column({ column, cards = [], onAddCard, boardId }) {
  const [newCardTitle, setNewCardTitle] = useState('')
  const [error, setError] = useState('')
  const [showDeleteColumnModal, setShowDeleteColumnModal] = useState(false)
  const [showDeleteCardModal, setShowDeleteCardModal] = useState(false)
  const [selectedCardId, setSelectedCardId] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCreateCard = async () => {
    if (!newCardTitle.trim()) return setError('Kart başlığı boş olamaz.')
    try {
      setLoading(true)
      await createCard(boardId, column.id, { title: newCardTitle })
      onAddCard()
      setNewCardTitle('')
      setError('')
      setLoading(false)
    } catch {
      setError('Kart oluşturulamadı.')
    }
  }

  const handleConfirmDeleteColumn = async () => {
    try {
      await deleteColumn(boardId, column.id)
      setShowDeleteColumnModal(false)
      onAddCard()
    } catch {
      setError('Liste silinemedi.')
    }
  }

  const handleConfirmDeleteCard = async () => {
    try {
      await deleteCard(boardId, column.id, selectedCardId)
      setShowDeleteCardModal(false)
      onAddCard()
    } catch {
      setError('Kart silinemedi.')
    }
  }

  return (
    <Card className="bg-white p-4 rounded shadow min-h-[70vh] w-full flex flex-col ">
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
        onCancel={() => setShowDeleteCardModal(false)}
      />

      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="font-bold">{column.title}</h2>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => setShowDeleteColumnModal(true)}
        >
          ×
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {cards.length ? (
          cards.map((card, index) => (
            <Draggable
              key={card.id}
              draggableId={card.id.toString()}
              index={index}
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <CardItem
                    card={card}
                    onDelete={() => {
                      setSelectedCardId(card.id)
                      setShowDeleteCardModal(true)
                    }}
                  />
                </div>
              )}
            </Draggable>
          ))
        ) : (
          <div className="h-20 rounded border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
            Buraya kart sürükleyin veya yeni kart ekleyin.
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <Input
          placeholder="Yeni kart adı"
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
        />
        <SubmitButton loading={loading} error={error} submit={handleCreateCard} title="Kart Ekle" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </Card>
  )
}
