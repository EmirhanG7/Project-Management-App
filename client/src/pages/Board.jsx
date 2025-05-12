import {useEffect, useRef, useState} from 'react'
import { useParams } from 'react-router-dom'
import {getColumns, getCards, createColumn, moveCard, reorderCards, getBoardById, inviteToBoard} from '../api'
import Column from '../components/Column'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import CreateButton from "@/components/CreateButton.jsx";

function reorderList(list, from, to) {
  const result = Array.from(list)
  const [m] = result.splice(from, 1)
  result.splice(to, 0, m)
  return result
}

export default function BoardPage() {
  const { boardId } = useParams()
  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState([])
  const [cardsMap, setCardsMap] = useState({})
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [inviteErr, setInviteErr] = useState('')
  const [inviteMsg, setInviteMsg] = useState('')

  const containerRef = useRef(null)
  const initialLoaded = useRef(false)

  useEffect(() => {
    loadBoard()
  }, [])


  async function loadBoard() {
    try {
      const getBoard = await getBoardById(boardId)
      setBoard(getBoard)
      const cols = await getColumns(boardId)
      setColumns(cols)
      const map = {}
      for (const col of cols) {
        map[col.id] = await getCards(boardId, col.id)
      }
      setCardsMap(map)

      if (!initialLoaded.current) {
        if (containerRef.current) {
          containerRef.current.scrollLeft = 0
        }
        initialLoaded.current = true
      }


    } catch {
      setError('Veriler yüklenemedi.')
    }
  }

  const handleCreateColumn = async ( title ) => {
    if (!title.trim()) return setError('Başlık boş olamaz.')
    try {
      setLoading(true)
      await createColumn(boardId, { title, order: columns.length })
      await loadBoard()
      // setNewColumnTitle('')

      const container = containerRef.current
      if (!container) return
      const createFormWrapper = container.lastElementChild
      const newColumnWrapper = createFormWrapper?.previousElementSibling
      if (newColumnWrapper) {
        newColumnWrapper.scrollIntoView({
          behavior: 'smooth',
          inline: 'end'
        })
      }

      setError('')
    } catch {
      setError('Kolon oluşturulamadı.')
    } finally {
      setLoading(false)
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

  const handleInvite = async email => {
    setInviteErr(''); setInviteMsg('')
    try {
      setLoading(true)
      const { message } = await inviteToBoard(boardId, email)
      setInviteMsg(message)
    } catch (err) {
      setInviteErr(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-4 h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-4">{board.title}</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {inviteErr && <p className="text-red-500 mb-2">{inviteErr}</p>}
      {inviteMsg && <p className="text-green-600 mb-2">{inviteMsg}</p>}

      <div className="mb-4">
        <CreateButton
          title="Email ile Davet Et"
          placeholder="Email adresi..."
          loading={loading}
          submitTitle="Davet Et"
          submit={handleInvite}
        />
      </div>

      <DragDropContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div
          ref={containerRef}
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
          <div className="snap-center w-full md:min-w-[300px] flex-shrink-0 md:flex-initial">
            <CreateButton title='Yeni Liste Oluştur' placeholder='Yeni Liste Başlığı...' submitTitle='Oluştur' submit={handleCreateColumn} />
          </div>
        </div>
      </DragDropContext>
    </div>
  )
}
