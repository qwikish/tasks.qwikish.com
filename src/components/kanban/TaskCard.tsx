import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Task, Priority } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MessageCircle, Paperclip, CheckSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface TaskCardProps {
  task: Task
  isDragging?: boolean
}

const priorityColors: Record<Priority, string> = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
}

export function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const completedSubtasks = task.subtasks.filter((st) => st.completed).length
  const totalSubtasks = task.subtasks.length

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md",
        (isDragging || isSortableDragging) && "opacity-50 shadow-lg",
      )}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Priority and Tags */}
          <div className="flex items-center justify-between">
            <Badge className={priorityColors[task.priority]} variant="secondary">
              {task.priority}
            </Badge>
            <div className="flex gap-1">
              {task.tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  style={{ borderColor: tag.color, color: tag.color }}
                  className="text-xs"
                >
                  {tag.name}
                </Badge>
              ))}
              {task.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{task.tags.length - 2}
                </Badge>
              )}
            </div>
          </div>

          {/* Title and Description */}
          <div>
            <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
            {task.description && <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>}
          </div>

          {/* Subtasks Progress */}
          {totalSubtasks > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckSquare className="h-4 w-4" />
              <span>
                {completedSubtasks}/{totalSubtasks}
              </span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all"
                  style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{format(task.dueDate, "MMM dd")}</span>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {task.comments.length > 0 && (
                <div className="flex items-center space-x-1 text-gray-500">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-xs">{task.comments.length}</span>
                </div>
              )}
              {task.attachments.length > 0 && (
                <div className="flex items-center space-x-1 text-gray-500">
                  <Paperclip className="h-4 w-4" />
                  <span className="text-xs">{task.attachments.length}</span>
                </div>
              )}
            </div>

            {/* Assignees */}
            <div className="flex -space-x-2">
              {task.assignees.slice(0, 3).map((assignee) => (
                <Avatar key={assignee.id} className="h-6 w-6 border-2 border-white">
                  <AvatarImage src={assignee.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">
                    {assignee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              ))}
              {task.assignees.length > 3 && (
                <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-gray-600">+{task.assignees.length - 3}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
