import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';

export default function CardItem({ card, onDelete, isOverlay = false }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id.toString(),
    disabled: isOverlay,
  });

  const style = isOverlay
    ? {
      transform: 'scale(1.08)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      backgroundColor: '#fff',
      zIndex: 50,
    }
    : {
      transform: CSS.Transform.toString(transform),
      transition,
    };

  return (
    <div
      ref={setNodeRef}
      {...(isOverlay ? {} : attributes)}
      {...(isOverlay ? {} : listeners)}
      className={`
        p-2 bg-gray-100 rounded-[10px] flex justify-between items-center
        select-none transition-all duration-200
        ${isDragging ? 'opacity-50 cursor-grabbing' : 'cursor-grab'}
      `}
      style={style}
    >
      <span>{card.title}</span>
      {!isOverlay && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
        >
          ×
        </Button>
      )}
    </div>
  );
}
