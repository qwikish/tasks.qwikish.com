"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useEffect } from "react"
import { Sidebar } from "../src/components/layout/Sidebar"
import { KanbanBoard } from "../src/components/kanban/KanbanBoard"
import { PomodoroTimer } from "../src/components/pomodoro/PomodoroTimer"
import { useTaskStore } from "../src/store/useTaskStore"
import { mockTasks, mockProjects, mockTags } from "../src/data/mockData"
import { CalendarPage } from "../src/pages/CalendarPage"
import { AnalyticsPage } from "../src/pages/AnalyticsPage"
import { ProjectsPage } from "../src/pages/ProjectsPage"
import { SettingsPage } from "../src/pages/SettingsPage"
import { DailyPlannerPage } from "../src/pages/DailyPlannerPage"

function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Total Tasks</h3>
          <p className="text-3xl font-bold text-orange-500 mt-2">24</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">In Progress</h3>
          <p className="text-3xl font-bold text-blue-500 mt-2">8</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Completed</h3>
          <p className="text-3xl font-bold text-green-500 mt-2">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Focus Time</h3>
          <p className="text-3xl font-bold text-purple-500 mt-2">4.2h</p>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  const { tasks, projects, tags, addTask, addProject, addTag } = useTaskStore()

  // Initialize with mock data if empty
  useEffect(() => {
    if (tasks.length === 0) {
      mockTasks.forEach((task) => addTask(task))
    }
    if (projects.length === 0) {
      mockProjects.forEach((project) => addProject(project))
    }
    if (tags.length === 0) {
      mockTags.forEach((tag) => addTag(tag))
    }
  }, [tasks.length, projects.length, tags.length, addTask, addProject, addTag])

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/kanban" element={<KanbanBoard />} />
            <Route path="/pomodoro" element={<PomodoroTimer />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/planner" element={<DailyPlannerPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
