import { Button } from '@/components/ui/button'

export default function CardItem({ card, onDelete, isOverlay }) {
  return (
    // <div className="
    //   p-2 bg-gray-100 rounded-[10px] flex justify-between items-center
    //   select-none transition-all duration-200
    //   border border-transparent
    // ">
    <div
      className={`
       p-2 bg-gray-100 rounded-[12px] flex justify-between items-center
       select-none transition-all duration-200
       border border-transparent hover:shadow-md
      ${isOverlay ? '' : 'hover:scale-95'}
    `}
      style={isOverlay ? { zIndex: 50 } : {}}
    >
      <span className="text-sm text-gray-800">{card.title}</span>
      {!isOverlay && (
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:bg-red-100"
          onClick={onDelete}
        >
          ×
        </Button>
      )}
    </div>
  )
}
