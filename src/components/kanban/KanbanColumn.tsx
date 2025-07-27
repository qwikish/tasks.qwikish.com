import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import type { Task, Column } from "@/types"
import { TaskCard } from "./TaskCard"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface KanbanColumnProps {
  column: Column
  tasks: Task[]
}

export function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  const isOverLimit = column.wipLimit && tasks.length >= column.wipLimit

  return (
    <div className="flex flex-col w-80 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-gray-900">{column.title}</h3>
          <Badge variant="secondary">{tasks.length}</Badge>
          {column.wipLimit && <Badge variant={isOverLimit ? "destructive" : "outline"}>WIP: {column.wipLimit}</Badge>}
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 p-4 space-y-3 min-h-[500px] transition-colors",
          isOver && "bg-blue-50",
          isOverLimit && "bg-red-50",
        )}
      >
        <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}
