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

export default function CardItem({ card, onDelete, isOverlay }) {
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
