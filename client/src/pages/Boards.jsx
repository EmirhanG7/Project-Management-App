import { useEffect, useState } from 'react';
import { getBoards, createBoard, deleteBoard } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import CreateButton from "@/components/CreateButton.jsx";
import ConfirmModal from "@/components/ConfirmModal.jsx";

export default function BoardsPage() {
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [showDeleteBoardModal, setShowDeleteBoardModal] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState(null);


  useEffect(() => {
    async function loadBoards() {
      try {
        const data = await getBoards();
        setBoards(data);
      } catch (err) {
        console.error(err);
        navigate('/login');
      }
    }
    loadBoards();
  }, []);

  const handleCreate = async (title) => {
    if (!title.trim()) {
      setError('Başlık boş olamaz.');
      return;
    }
    try {
      const newBoard = await createBoard(title);
      setBoards((prev) => [...prev, newBoard]);
      setTitle('');
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    const id = selectedBoardId
    try {
      await deleteBoard(id);
      setBoards((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSelectedBoardId(null)
      setShowDeleteBoardModal(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <ConfirmModal
        isOpen={showDeleteBoardModal}
        title="Bu listeyi silmek istiyor musun?"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteBoardModal(false)}
      />
      <h1 className="text-2xl font-bold mb-4">Panolar</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <CreateButton title='Pano' submit={handleCreate} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boards.map((board) => (
          <Card key={board.id} className="p-4 flex justify-between items-center">
            <Link to={`/boards/${board.id}`} className="font-medium text-xl capitalize">
              {board.title}
            </Link>
            <Button variant="destructive" size="sm"
              onClick={() =>
                {
                  setSelectedBoardId(board.id)
                  setShowDeleteBoardModal(true)
                }
            }>
              Sil
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
