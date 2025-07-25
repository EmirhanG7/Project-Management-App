import { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import {createCard, deleteColumn, deleteCard, updateColumn} from '../api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import ConfirmModal from './ConfirmModal'
import CardItem from './CardItem'
import {CircleX, Loader2, Settings2} from "lucide-react";
import SubmitButton from "@/components/SubmitButton.jsx";
import CreateButton from "@/components/CreateButton.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog.js";
import {toast} from "sonner";


export default function Column({ column, cards = [], onAddCard, boardId }) {
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const [showDeleteColumnModal, setShowDeleteColumnModal] = useState(false)
  const [showDeleteCardModal, setShowDeleteCardModal] = useState(false)
  const [selectedCardId, setSelectedCardId] = useState(null)
  const [loading, setLoading] = useState(false)


  const handleCreateCard = async (title) => {
    if (!title.trim()) return setError('Kart başlığı boş olamaz.')
    try {
      setLoading(true)
      await createCard(boardId, column.id, { title})
      onAddCard()
      setLoading(false)
      toast.success('Yeni Kart Oluşturuldu.')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleConfirmDeleteColumn = async () => {
    try {
      await deleteColumn(boardId, column.id)
      setShowDeleteColumnModal(false)
      toast.success('Liste silindi.')
      onAddCard()
    } catch {
      toast.error('Liste silinemedi.')
    }
  }

  const handleConfirmDeleteCard = async () => {
    try {
      await deleteCard(boardId, column.id, selectedCardId)
      setShowDeleteCardModal(false)
      onAddCard()
      toast.success('Kart silindi.')
    } catch {
      toast.error('Kart silinemedi.')
    }
  }

  const handleUpdateColumn = async () =>  {
    try {
      setLoading(true)
      const result = await updateColumn(boardId, column.id, {title: newColumnTitle})
      console.log('result', result)
      toast.success('Liste Başlığı Güncellendi.')
    } catch (err) {
      setLoading(false)
      toast.error(err.message)
    } finally {
      setLoading(false)
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
        <h2 className="font-bold text-lg ">{column.title}</h2>
        <Dialog>
          <DialogTrigger>
            <Settings2 />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                <h2 className="font-bold text-lg ">{column.title}</h2>
              </DialogTitle>
              <div>
                <form className='space-y-2'>
                  <Input defaultValue={column.title}  onChange={e => setNewColumnTitle(e.target.value)}/>
                  <SubmitButton submit={handleUpdateColumn} title='Liste Başlığı Güncelle' loading={loading} />
                </form>
              </div>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteColumnModal(true)}
              >
                Listeyi Sil
                <CircleX/>
              </Button>
            </DialogHeader>
          </DialogContent>
        </Dialog>

      </div>

      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {cards.length ? (
          cards.map((card, index) => (
            <Draggable
              key={card.id}
              draggableId={card.id.toString()}
              index={index}
            >
              {(provided) => (
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

      <CreateButton title='Yeni Kart Oluştur' placeholder='Yeni Kart Başlığı...' submitTitle='Oluştur' loading={loading} submit={handleCreateCard} />
    </Card>
  )
}
