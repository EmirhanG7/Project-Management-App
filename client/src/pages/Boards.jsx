import { useEffect, useState } from 'react'
import { getBoards, createBoard, deleteBoard } from '../api'
import { useNavigate, Link } from 'react-router-dom'
import { Card } from "../components/ui/card"
import CreateButton from "@/components/CreateButton.jsx"
import ConfirmModal from "@/components/ConfirmModal.jsx"
import {Button} from "@/components/ui/button.js";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.js";
import {toast} from "sonner";
import {CircleX} from "lucide-react";

export default function BoardsPage() {
  const navigate = useNavigate()

  const [ownBoards, setOwnBoards] = useState([])
  const [sharedBoards, setSharedBoards] = useState([])
  const [activeTab, setActiveTab] = useState('own')

  const [error, setError] = useState('')
  const [loadingCreate, setLoadingCreate] = useState(false)


  useEffect(() => {
    async function loadBoards() {
      try {
        const res = await getBoards()
        setOwnBoards(res.private)
        setSharedBoards(res.shared)
      } catch (err) {
        toast.error(err.message)
        navigate('/login')
      }
    }
    loadBoards()
  }, [])

  const handleCreate = async title => {
    if (!title.trim()) {
      setError('Başlık boş olamaz.')
      toast.error('Başlık boş olamaz.')
      return
    }
    try {
      setLoadingCreate(true)
      const newBoard = await createBoard(title)
      setOwnBoards(prev => [...prev, newBoard])
      setError('')
      toast.success('Yeni Pano Oluşturuldu.')
    } catch (err) {
      toast.error(err.message)
      setError(err.message)
    } finally {
      setLoadingCreate(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">

      <h1 className="text-2xl font-bold text-foreground">Panolar</h1>

      <Tabs
        defaultValue="own"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full bg-card text-foreground border border-border rounded-lg shadow-lg p-4"
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
                  className="font-medium text-xl capitalize text-card-foreground hover:text-primary"
                >
                  {board.title}
                </Link>
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
                  className="font-medium text-xl capitalize text-card-foreground hover:text-primary"
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