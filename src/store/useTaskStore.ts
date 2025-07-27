import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Task, Project, Tag, User, PomodoroSession, TaskStatus } from "../types"

interface TaskStore {
  tasks: Task[]
  projects: Project[]
  tags: Tag[]
  users: User[]
  pomodoroSessions: PomodoroSession[]
  currentUser: User

  // Task actions
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  moveTask: (id: string, status: TaskStatus) => void

  // Project actions
  addProject: (project: Omit<Project, "id" | "createdAt">) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void

  // Tag actions
  addTag: (tag: Omit<Tag, "id">) => void
  updateTag: (id: string, updates: Partial<Tag>) => void
  deleteTag: (id: string) => void

  // Pomodoro actions
  addPomodoroSession: (session: Omit<PomodoroSession, "id">) => void
  updatePomodoroSession: (id: string, updates: Partial<PomodoroSession>) => void
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      projects: [],
      tags: [],
      users: [
        {
          id: "1",
          name: "John Doe",
          avatar: "/placeholder.svg?height=32&width=32",
          email: "john@qwikish.com",
        },
        {
          id: "2",
          name: "Jane Smith",
          avatar: "/placeholder.svg?height=32&width=32",
          email: "jane@qwikish.com",
        },
      ],
      pomodoroSessions: [],
      currentUser: {
        id: "1",
        name: "John Doe",
        avatar: "/placeholder.svg?height=32&width=32",
        email: "john@qwikish.com",
      },

      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({ tasks: [...state.tasks, newTask] }))
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task)),
        }))
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }))
      },

      moveTask: (id, status) => {
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? { ...task, status, updatedAt: new Date() } : task)),
        }))
      },

      addProject: (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        }
        set((state) => ({ projects: [...state.projects, newProject] }))
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((project) => (project.id === id ? { ...project, ...updates } : project)),
        }))
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        }))
      },

      addTag: (tagData) => {
        const newTag: Tag = {
          ...tagData,
          id: crypto.randomUUID(),
        }
        set((state) => ({ tags: [...state.tags, newTag] }))
      },

      updateTag: (id, updates) => {
        set((state) => ({
          tags: state.tags.map((tag) => (tag.id === id ? { ...tag, ...updates } : tag)),
        }))
      },

      deleteTag: (id) => {
        set((state) => ({
          tags: state.tags.filter((tag) => tag.id !== id),
        }))
      },

      addPomodoroSession: (sessionData) => {
        const newSession: PomodoroSession = {
          ...sessionData,
          id: crypto.randomUUID(),
        }
        set((state) => ({ pomodoroSessions: [...state.pomodoroSessions, newSession] }))
      },

      updatePomodoroSession: (id, updates) => {
        set((state) => ({
          pomodoroSessions: state.pomodoroSessions.map((session) =>
            session.id === id ? { ...session, ...updates } : session,
          ),
        }))
      },
    }),
    {
      name: "qwikish-tasks-storage",
    },
  ),
)
