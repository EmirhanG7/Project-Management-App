import { useEffect, useState } from 'react'
import { getBoards, createBoard, deleteBoard } from '../api'
import { useNavigate, Link } from 'react-router-dom'
import { Card } from "../components/ui/card"
import CreateButton from "@/components/CreateButton.jsx"
import ConfirmModal from "@/components/ConfirmModal.jsx"
import {Button} from "@/components/ui/button.js";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.js";

export default function BoardsPage() {
  const navigate = useNavigate()

  const [ownBoards, setOwnBoards] = useState([])
  const [sharedBoards, setSharedBoards] = useState([])
  const [activeTab, setActiveTab] = useState('own')

  const [error, setError] = useState('')
  const [loadingCreate, setLoadingCreate] = useState(false)

  const [showDeleteBoardModal, setShowDeleteBoardModal] = useState(false)
  const [selectedBoardId, setSelectedBoardId] = useState(null)

  useEffect(() => {
    async function loadBoards() {
      try {
        const res = await getBoards()
        console.log(res)
        setOwnBoards(res.private)
        setSharedBoards(res.shared)
      } catch (err) {
        console.error(err)
        navigate('/login')
      }
    }
    loadBoards()
  }, [])

  const handleCreate = async title => {
    if (!title.trim()) {
      setError('Başlık boş olamaz.')
      return
    }
    try {
      setLoadingCreate(true)
      const newBoard = await createBoard(title)
      setOwnBoards(prev => [...prev, newBoard])
      setError('')
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoadingCreate(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteBoard(selectedBoardId)
      setOwnBoards(prev => prev.filter(b => b.id !== selectedBoardId))
      setError('')
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setShowDeleteBoardModal(false)
      setSelectedBoardId(null)
    }
  }


  return (
    <div className="flex flex-col gap-4">
      <ConfirmModal
        isOpen={showDeleteBoardModal}
        title="Bu panoyu silmek istiyor musun?"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteBoardModal(false)}
      />

      <h1 className="text-2xl font-bold">Panolar</h1>
      {error && <div className="text-red-500">{error}</div>}

      <Tabs
        defaultValue="own"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList >
          <TabsTrigger
            value="own"
          >
            Panolarım
          </TabsTrigger>
          <TabsTrigger
            value="shared"
          >
            Ortak Çalışma Alanları
          </TabsTrigger>
        </TabsList>

        <TabsContent value="own" className="pt-4">
          <div className="mb-4">
            <CreateButton
              title="Yeni Pano Oluştur"
              placeholder="Pano başlığı..."
              submitTitle="Oluştur"
              loading={loadingCreate}
              submit={handleCreate}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ownBoards.map(board => (
              <Card
                key={board.id}
                className="p-4 flex justify-between items-center"
              >
                <Link
                  to={`/boards/${board.id}`}
                  className="font-medium text-xl capitalize"
                >
                  {board.title}
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setSelectedBoardId(board.id)
                    setShowDeleteBoardModal(true)
                  }}
                >
                  Sil
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shared" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sharedBoards.map(board => (
              <Card
                key={board.id}
                className="p-4 flex justify-between items-center"
              >
                <Link
                  to={`/boards/${board.id}`}
                  className="font-medium text-xl capitalize"
                >
                  {board.title}
                </Link>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}