export type Priority = "low" | "medium" | "high"
export type TaskStatus = "backlog" | "todo" | "in-progress" | "review" | "completed"

export interface User {
  id: string
  name: string
  avatar: string
  email: string
}

export interface Tag {
  id: string
  name: string
  color: string
}

export interface Subtask {
  id: string
  title: string
  completed: boolean
}

export interface Comment {
  id: string
  userId: string
  content: string
  createdAt: Date
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: Priority
  tags: Tag[]
  assignees: User[]
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
  subtasks: Subtask[]
  comments: Comment[]
  estimatedTime?: number // in minutes
  actualTime?: number // in minutes
  projectId?: string
  attachments: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  color: string
  createdAt: Date
}

export interface PomodoroSession {
  id: string
  taskId: string
  startTime: Date
  endTime?: Date
  duration: number // in minutes
  type: "focus" | "short-break" | "long-break"
  completed: boolean
}

export interface Column {
  id: TaskStatus
  title: string
  wipLimit?: number
}
