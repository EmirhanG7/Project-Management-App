import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog.js";
import { Settings2, CircleX } from "lucide-react";
import {Input} from "@/components/ui/input.js";
import SubmitButton from "@/components/SubmitButton.jsx";
import {useState} from "react";
import {updateCard} from "@/api.js";
import {toast} from "sonner";

export default function CardItem({ card, setCardsMap, onDelete, isOverlay }) {
  const [newCardTitle, setNewCardTitle] = useState('')
  const [loading, setLoading] = useState(false)


  const handleUpdateCard = async (e) => {
    e.preventDefault();
    if(newCardTitle === '') {
      toast.error('Kart Başlığı Boş Olamaz.')
      return
    }
    if(newCardTitle === card.title) {
      toast.info('Farklı Bir Başlık Giriniz.')
      return
    }
    try {
      setLoading(true)
      const result = await updateCard(card.boardId, card.columnId, card.id, {title: newCardTitle})
      toast.success(`Kart Başlığı '${result.title}' Olarak Güncellendi.`)
      setCardsMap(prev => ({...prev, [card.columnId]: prev[card.columnId].map(c => c.id === card.id ? { ...c, title: newCardTitle } : c)}));
      setNewCardTitle('')
    } catch (err) {
      toast.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (

    <div
      className={`
       p-2 bg-gray-100 rounded-[12px] flex justify-between items-center
       select-none transition-all duration-200
       border border-transparent hover:shadow-md
      ${isOverlay ? '' : 'hover:scale-95'}
    `}
      style={isOverlay ? { zIndex: 50 } : {}}
    >
      <div className='flex items-center gap-4'>
        <Dialog>
          <DialogTrigger>
            <Settings2 />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle><span className="text-gray-800">{card.title}</span></DialogTitle>
              <div>
                <form className='space-y-2'>
                  <Input defaultValue={card.title}  onChange={e => setNewCardTitle(e.target.value)}/>
                  <SubmitButton submit={handleUpdateCard} title='Kart Başlığı Güncelle' loading={loading} />
                </form>
              </div>
              <DialogDescription>
                todo yapılacak
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <span className="text-gray-800">{card.title}</span>
      </div>

      {!isOverlay && (
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:bg-red-100"
          onClick={onDelete}
        >
          <CircleX />
        </Button>
      )}
    </div>

  )
}
