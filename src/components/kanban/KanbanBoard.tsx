"use client"

import { useState } from "react"
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import type { Task, TaskStatus, Column } from "@/types"
import { useTaskStore } from "@/store/useTaskStore"
import { KanbanColumn } from "./KanbanColumn"
import { TaskCard } from "./TaskCard"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const columns: Column[] = [
  { id: "backlog", title: "Backlog" },
  { id: "todo", title: "To Do", wipLimit: 5 },
  { id: "in-progress", title: "In Progress", wipLimit: 3 },
  { id: "review", title: "Review", wipLimit: 2 },
  { id: "completed", title: "Completed" },
]

export function KanbanBoard() {
  const { tasks, moveTask } = useTaskStore()
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as TaskStatus

    moveTask(taskId, newStatus)
    setActiveTask(null)
  }

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status)
  }

  return (
    <div className="h-full p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-6 h-full overflow-x-auto">
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.id)
            return (
              <SortableContext
                key={column.id}
                items={columnTasks.map((task) => task.id)}
                strategy={verticalListSortingStrategy}
              >
                <KanbanColumn column={column} tasks={columnTasks} />
              </SortableContext>
            )
          })}
        </div>

        <DragOverlay>{activeTask ? <TaskCard task={activeTask} isDragging /> : null}</DragOverlay>
      </DndContext>
    </div>
  )
}
