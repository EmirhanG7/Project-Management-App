import {useEffect, useRef, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {
  getColumns,
  getCards,
  createColumn,
  moveCard,
  reorderCards,
  getBoardById,
  inviteToBoard,
  deleteBoard, updateBoard
} from '../api'
import Column from '../components/Column'
import {DragDropContext, Droppable} from '@hello-pangea/dnd'
import CreateButton from "@/components/CreateButton.jsx";
import {useSelector} from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog.js";
import {CircleX, Cog} from 'lucide-react';
import {toast} from "sonner";
import {Button} from "@/components/ui/button.js";
import ConfirmModal from "@/components/ConfirmModal.jsx";
import {Input} from "@/components/ui/input.js";
import SubmitButton from "@/components/SubmitButton.jsx";

function reorderList(list, from, to) {
  const result = Array.from(list)
  const [m] = result.splice(from, 1)
  result.splice(to, 0, m)
  return result
}

export default function BoardPage() {
  const {boardId} = useParams()
  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState([])
  const [cardsMap, setCardsMap] = useState({})
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showDeleteBoardModal, setShowDeleteBoardModal] = useState(false)
  const [newBoardTitle, setNewBoardTitle] = useState('')


  const navigate = useNavigate()
  const containerRef = useRef(null)
  const initialLoaded = useRef(false)

  const user = useSelector(state => state.auth.user)

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

  const handleCreateColumn = async (title) => {

    try {
      setLoading(true)
      const result = await createColumn(boardId, {title, order: columns.length})
      toast.success(`'${result.title}' Listesi Oluşturuldu.`)
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
    } catch(err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const onDragStart = () => {
    setIsDragging(true)
  }

  const onDragEnd = async (result) => {
    setIsDragging(false)

    const {source, destination, draggableId} = result
    if (!destination) return

    const fromCol = source.droppableId
    const toCol = destination.droppableId
    const cardId = Number(draggableId)

    if (fromCol === toCol) {
      const newList = reorderList(
        cardsMap[fromCol],
        source.index,
        destination.index
      )
      setCardsMap(m => ({...m, [fromCol]: newList}))
      const reordered = newList.map((c, i) => ({id: c.id, order: i}))
      try {
        await reorderCards(boardId, Number(fromCol), reordered)
      } catch (e) {
        console.error(e)
      }
      return
    }

    const sourceList = Array.from(cardsMap[fromCol])
    const [moved] = sourceList.splice(source.index, 1)
    const destList = Array.from(cardsMap[toCol] || [])
    destList.splice(destination.index, 0, moved)

    setCardsMap(m => ({
      ...m,
      [fromCol]: sourceList,
      [toCol]: destList,
    }))

    try {
      await moveCard(
        boardId,
        Number(fromCol),
        cardId,
        Number(toCol),
        destination.index
      )
      const reordered = destList.map((c, i) => ({id: c.id, order: i}))
      await reorderCards(boardId, Number(toCol), reordered)
    } catch (e) {
      console.error(e)
    }
  }

  const handleInvite = async email => {
    try {
      setLoading(true)
      const {message} = await inviteToBoard(boardId, email)
      toast.success(message)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteBoard(board.id)
      toast.success('Pano silindi.')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setShowDeleteBoardModal(false)
      navigate('/boards')
    }
  }
  const handleUpdateBoard = async (e) => {
    e.preventDefault()
    if (newBoardTitle === '') {
      toast.error('Pano Başlığı Boş Olamaz.')
      return
    }
    if (newBoardTitle === board.title) {
      toast.info('Farklı Bir Başlık Giriniz.')
      return
    }
    try {
      setLoading(true)
      const result = await updateBoard(board.id, newBoardTitle)
      toast.success(`Pano Başlığı ${result.title} Olarak Değiştirildi.`)
      setBoard(result)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-4 h-full flex flex-col">
      <ConfirmModal
        isOpen={showDeleteBoardModal}
        title="Bu panoyu silmek istiyor musun?"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteBoardModal(false)}
      />
      <div className='flex items-center justify-between mb-4'>
        <h1 className="text-2xl font-bold mb-4">{board.title}</h1>
        {
          user.id === board.userId &&
          <Dialog>
            <DialogTrigger>
              <Cog/>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle><h1 className="text-2xl font-bold mb-4">{board.title}</h1></DialogTitle>
                <div>
                  <form className='space-y-2 '>
                    <Input defaultValue={board.title} onChange={e => setNewBoardTitle(e.target.value)}/>
                    <SubmitButton submit={handleUpdateBoard} title='Kart Başlığı Güncelle' loading={loading}/>
                  </form>
                </div>

                <div className="flex flex-col gap-6 items-center justify-center  ">
                  <CreateButton
                    className='!max-w-none'
                    title="Email ile Davet Et"
                    placeholder="Email adresi..."
                    loading={loading}
                    submitTitle="Davet Et"
                    submit={handleInvite}
                  />
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={() => {
                      setShowDeleteBoardModal(true)
                    }}
                  >
                    Panoyu Sil
                    <CircleX/>
                  </Button>
                </div>

              </DialogHeader>
            </DialogContent>
          </Dialog>
        }
      </div>

      <DragDropContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div
          ref={containerRef}
          className={`
           pt-16
            flex items-start gap-6 overflow-x-auto
            scroll-auto snap-center snap-mandatory
            ${isDragging ? '' : 'snap-x'} 
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
                    setColumns={setColumns}
                    cards={cardsMap[col.id] || []}
                    setCardsMap={setCardsMap}
                    boardId={boardId}
                    onAddCard={loadBoard}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
          <div className="snap-center w-full md:min-w-[300px] flex-shrink-0 md:flex-initial">
            <CreateButton title='Yeni Liste Oluştur' placeholder='Yeni Liste Başlığı...' submitTitle='Oluştur'
                          submit={handleCreateColumn}/>
          </div>
        </div>
      </DragDropContext>
    </div>
  )
}
