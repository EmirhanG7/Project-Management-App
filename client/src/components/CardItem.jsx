import { Button } from '@/components/ui/button'

export default function CardItem({ card, onDelete }) {
  return (
    <div className="
      p-2 bg-gray-100 rounded-[10px] flex justify-between items-center
      select-none transition-transform duration-200
    ">
      <span>{card.title}</span>
      {onDelete && (
        <Button variant="ghost" size="icon" onClick={onDelete}>
          ×
        </Button>
      )}
    </div>
  )
}
