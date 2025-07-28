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
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog.js";
import {toast} from "sonner";


export default function Column({ column, cards = [], setCardsMap, onAddCard, boardId, setColumns }) {
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const [showDeleteColumnModal, setShowDeleteColumnModal] = useState(false)
  const [showDeleteCardModal, setShowDeleteCardModal] = useState(false)
  const [selectedCardId, setSelectedCardId] = useState(null)
  const [loading, setLoading] = useState(false)




  const handleCreateCard = async (title) => {
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
      toast.success(`'${column.title}' Listesi Silindi.`)
      onAddCard()
    } catch {
      toast.error('Liste silinemedi.')
    }
  }

  const handleConfirmDeleteCard = async () => {
    try {
      const result = await deleteCard(boardId, column.id, selectedCardId)
      setShowDeleteCardModal(false)
      onAddCard()
      toast.success(`'${result.card.title}' Kartı Silindi.`)
    } catch {
      toast.error('Kart silinemedi.')
    }
  }

  const handleUpdateColumn = async (e) =>  {
    e.preventDefault();
    if(newColumnTitle === '') {
      toast.error('Liste Başlığı Boş Olamaz.')
      return
    }
    if(newColumnTitle === column.title) {
      toast.info('Farklı Bir Başlık Giriniz.')
      return
    }
    try {
      setLoading(true)
      const result = await updateColumn(boardId, column.id, {title: newColumnTitle})
      toast.success(`Liste Başlığı '${result.title}' Olarak Güncellendi.`)
      setColumns(prev => prev.map(col => col.id === column.id ? {...col, title: newColumnTitle} : col))
      setNewColumnTitle('')
    } catch (err) {
      setLoading(false)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-white px-2 pt-2 pb-4 rounded shadow min-h-[70vh] w-full flex flex-col relative">
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

      <div className=" bg-white shadow rounded flex justify-between items-center px-3 py-3 absolute w-full -top-16 left-0 ">
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

      <div className="flex-1 overflow-y-auto space-y-2">
        <div className='flex flex-col gap-2'>
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
                      setCardsMap={setCardsMap}
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
            <div className="h-12 mt-1 text-xs rounded border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
              Buraya kart sürükleyin veya yeni kart ekleyin.
            </div>
          )}
        </div>
      </div>

      <CreateButton title='Yeni Kart Oluştur' placeholder='Yeni Kart Başlığı...' submitTitle='Oluştur' loading={loading} submit={handleCreateCard} />
    </Card>
  )
}
