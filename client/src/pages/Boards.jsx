import { useEffect, useState } from 'react';
import { getBoards, createBoard, deleteBoard } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export default function BoardsPage() {
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

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

  const handleCreate = async () => {
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

  const handleDelete = async (id) => {
    try {
      await deleteBoard(id);
      setBoards((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Panolar</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Yeni Pano Başlığı"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button onClick={handleCreate}>
          Ekle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boards.map((board) => (
          <Card key={board.id} className="p-4 flex justify-between items-center">
            <Link to={`/boards/${board.id}`} className="text-blue-600 font-medium">
              {board.title}
            </Link>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(board.id)}>
              Sil
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
