import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  getColumns,
  getCards,
  createColumn,
  moveCard,
  reorderCards,
} from '../api'
import Column from '../components/Column'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DragDropContext,
  Droppable,
  Draggable,
} from '@hello-pangea/dnd'
import {Loader2} from "lucide-react";
import SubmitButton from "@/components/SubmitButton.jsx";

function reorderList(list, from, to) {
  const result = Array.from(list)
  const [m] = result.splice(from, 1)
  result.splice(to, 0, m)
  return result
}

export default function BoardPage() {
  const { boardId } = useParams()
  const [columns, setColumns] = useState([])
  const [cardsMap, setCardsMap] = useState({})
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadBoard()
  }, [boardId])

  async function loadBoard() {
    try {
      const cols = await getColumns(boardId)
      setColumns(cols)
      const map = {}
      for (const col of cols) {
        map[col.id] = await getCards(boardId, col.id)
      }
      setCardsMap(map)
    } catch {
      setError('Veriler yüklenemedi.')
    }
  }

  const handleCreateColumn = async () => {
    if (!newColumnTitle.trim()) return setError('Başlık boş olamaz.')
    try {
      setLoading(true)
      await createColumn(boardId, { title: newColumnTitle })
      await loadBoard()
      setNewColumnTitle('')
      setError('')
      setLoading(false)
    } catch {
      setError('Kolon oluşturulamadı.')
    }
  }

  const onDragStart = () => {
    setIsDragging(true)
  }

  const onDragEnd = async (result) => {
    setIsDragging(false)

    const { source, destination, draggableId } = result
    if (!destination) return

    const fromCol    = source.droppableId
    const toCol      = destination.droppableId
    const cardId     = Number(draggableId)

    if (fromCol === toCol) {
      const newList = reorderList(
        cardsMap[fromCol],
        source.index,
        destination.index
      )
      setCardsMap(m => ({ ...m, [fromCol]: newList }))
      const reordered = newList.map((c, i) => ({ id: c.id, order: i }))
      try {
        await reorderCards(boardId, Number(fromCol), reordered)
      } catch (e) {
        console.error(e)
      }
      return
    }

    const sourceList = Array.from(cardsMap[fromCol])
    const [moved]    = sourceList.splice(source.index, 1)
    const destList   = Array.from(cardsMap[toCol] || [])
    destList.splice(destination.index, 0, moved)

    setCardsMap(m => ({
      ...m,
      [fromCol]: sourceList,
      [toCol]:   destList,
    }))

    try {
      await moveCard(
        boardId,
        Number(fromCol),
        cardId,
        Number(toCol),
        destination.index
      )
      const reordered = destList.map((c, i) => ({ id: c.id, order: i }))
      await reorderCards(boardId, Number(toCol), reordered)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="py-4 h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Pano: {boardId}</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Yeni liste başlığı"
          value={newColumnTitle}
          onChange={e => setNewColumnTitle(e.target.value)}
        />
        <SubmitButton loading={loading} submit={handleCreateColumn} title="Liste Ekle" />
      </div>

      <DragDropContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div
          className={`
            flex items-start gap-6 overflow-x-auto
            ${isDragging ? '' : 'snap-x snap-mandatory'} 
            scroll-auto snap-center snap-mandatory
          `}
        >
          {columns.map(col => (
            <Droppable
              key={col.id}
              droppableId={col.id.toString()}
              direction="vertical"
            >
              {provided => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="snap-center w-full md:min-w-[300px] flex-shrink-0 md:flex-initial"
                >
                  <Column
                    column={col}
                    cards={cardsMap[col.id] || []}
                    boardId={boardId}
                    onAddCard={loadBoard}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}
