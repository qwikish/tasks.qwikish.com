"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { useTaskStore } from "@/store/useTaskStore"
import { Clock, CheckCircle, Target, TrendingUp } from "lucide-react"

export function AnalyticsPage() {
  const { tasks, pomodoroSessions } = useTaskStore()

  // Calculate metrics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Priority breakdown
  const priorityData = [
    { name: "High", value: tasks.filter((t) => t.priority === "high").length, color: "#EF4444" },
    { name: "Medium", value: tasks.filter((t) => t.priority === "medium").length, color: "#F59E0B" },
    { name: "Low", value: tasks.filter((t) => t.priority === "low").length, color: "#10B981" },
  ]

  // Status breakdown
  const statusData = [
    { name: "Backlog", count: tasks.filter((t) => t.status === "backlog").length },
    { name: "To Do", count: tasks.filter((t) => t.status === "todo").length },
    { name: "In Progress", count: tasks.filter((t) => t.status === "in-progress").length },
    { name: "Review", count: tasks.filter((t) => t.status === "review").length },
    { name: "Completed", count: tasks.filter((t) => t.status === "completed").length },
  ]

  // Weekly completion trend (mock data)
  const weeklyData = [
    { week: "Week 1", completed: 8, created: 12 },
    { week: "Week 2", completed: 12, created: 10 },
    { week: "Week 3", completed: 15, created: 14 },
    { week: "Week 4", completed: 10, created: 8 },
  ]

  // Pomodoro stats
  const totalSessions = pomodoroSessions.length
  const completedSessions = pomodoroSessions.filter((s) => s.completed).length
  const totalFocusTime = pomodoroSessions
    .filter((s) => s.type === "focus" && s.completed)
    .reduce((acc, s) => acc + s.duration, 0)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Focus Time</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(totalFocusTime / 60)}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#F97316" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Priority Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Completion Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Completion Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} name="Completed" />
                <Line type="monotone" dataKey="created" stroke="#3B82F6" strokeWidth={2} name="Created" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pomodoro Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Pomodoro Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-500">{totalSessions}</p>
              <p className="text-sm text-gray-600">Total Sessions</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-500">{completedSessions}</p>
              <p className="text-sm text-gray-600">Completed Sessions</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-500">{Math.round(totalFocusTime / 60)}h</p>
              <p className="text-sm text-gray-600">Total Focus Time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
