"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Clock, Target, CheckCircle } from "lucide-react"
import { useTaskStore } from "@/store/useTaskStore"
import { format } from "date-fns"

interface TimeSlot {
  id: string
  time: string
  task?: {
    id: string
    title: string
    estimatedTime: number
    actualTime?: number
    completed: boolean
  }
}

export function DailyPlannerPage() {
  const { tasks } = useTaskStore()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [dailyGoals, setDailyGoals] = useState<string[]>(["Complete project review", "Finish design mockups"])
  const [newGoal, setNewGoal] = useState("")
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false)

  // Generate time slots for the day (9 AM to 6 PM)
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = []
    for (let hour = 9; hour <= 18; hour++) {
      slots.push({
        id: `${hour}:00`,
        time: `${hour}:00`,
      })
    }
    return slots
  }

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(generateTimeSlots())

  const addGoal = () => {
    if (newGoal.trim()) {
      setDailyGoals((prev) => [...prev, newGoal.trim()])
      setNewGoal("")
      setIsGoalDialogOpen(false)
    }
  }

  const toggleGoalComplete = (index: number) => {
    // In a real app, this would update the goal's completion status
    console.log(`Toggle goal ${index}`)
  }

  const assignTaskToSlot = (slotId: string, taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      setTimeSlots((prev) =>
        prev.map((slot) =>
          slot.id === slotId
            ? {
                ...slot,
                task: {
                  id: task.id,
                  title: task.title,
                  estimatedTime: task.estimatedTime || 60,
                  completed: task.status === "completed",
                },
              }
            : slot,
        ),
      )
    }
  }

  const availableTasks = tasks.filter((task) => task.status === "todo" || task.status === "in-progress")

  const completedGoals = dailyGoals.filter((_, index) => index % 2 === 0) // Mock completion
  const totalEstimatedTime = timeSlots.reduce((acc, slot) => acc + (slot.task?.estimatedTime || 0), 0)
  const totalActualTime = timeSlots.reduce(
    (acc, slot) => acc + (slot.task?.actualTime || slot.task?.estimatedTime || 0),
    0,
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daily Planner</h1>
          <p className="text-gray-600">{format(selectedDate, "EEEE, MMMM dd, yyyy")}</p>
        </div>
        <div className="flex space-x-2">
          <Input
            type="date"
            value={format(selectedDate, "yyyy-MM-dd")}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="w-auto"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Daily Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Daily Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium">
                    {completedGoals.length}/{dailyGoals.length}
                  </p>
                  <p className="text-sm text-gray-600">Goals Completed</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">{Math.round(totalEstimatedTime / 60)}h</p>
                  <p className="text-sm text-gray-600">Planned Time</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">{Math.round(totalActualTime / 60)}h</p>
                  <p className="text-sm text-gray-600">Actual Time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Goals */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Daily Goals</CardTitle>
                <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Daily Goal</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="goal">Goal</Label>
                        <Textarea
                          id="goal"
                          value={newGoal}
                          onChange={(e) => setNewGoal(e.target.value)}
                          placeholder="Enter your daily goal"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsGoalDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={addGoal} className="bg-orange-500 hover:bg-orange-600">
                          Add Goal
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dailyGoals.map((goal, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={completedGoals.includes(goal)}
                      onChange={() => toggleGoalComplete(index)}
                      className="rounded"
                    />
                    <span className={`text-sm ${completedGoals.includes(goal) ? "line-through text-gray-500" : ""}`}>
                      {goal}
                    </span>
                  </div>
                ))}
                {dailyGoals.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No goals set for today</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Available Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Available Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {availableTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="p-2 border rounded cursor-pointer hover:bg-gray-50"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("taskId", task.id)}
                  >
                    <p className="font-medium text-sm">{task.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {task.estimatedTime || 60}min
                      </Badge>
                      <Badge variant={task.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Daily Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {timeSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50"
                    onDrop={(e) => {
                      e.preventDefault()
                      const taskId = e.dataTransfer.getData("taskId")
                      if (taskId) assignTaskToSlot(slot.id, taskId)
                    }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <div className="w-16 text-sm font-medium text-gray-600">{slot.time}</div>

                    <div className="flex-1">
                      {slot.task ? (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{slot.task.title}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {slot.task.estimatedTime}min
                              </Badge>
                              {slot.task.completed && (
                                <Badge variant="secondary" className="text-xs">
                                  Completed
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setTimeSlots((prev) =>
                                prev.map((s) => (s.id === slot.id ? { ...s, task: undefined } : s)),
                              )
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded p-4 text-center">
                          Drop a task here or click to schedule
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
