"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, Square, RotateCcw } from "lucide-react"
import { useTaskStore } from "@/store/useTaskStore"

type TimerType = "focus" | "short-break" | "long-break"

interface TimerSettings {
  focus: number
  shortBreak: number
  longBreak: number
}

export function PomodoroTimer() {
  const { tasks, addPomodoroSession } = useTaskStore()
  const [selectedTaskId, setSelectedTaskId] = useState<string>("")
  const [timerType, setTimerType] = useState<TimerType>("focus")
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)
  const [settings, setSettings] = useState<TimerSettings>({
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
  })

  const intervalRef = useRef<NodeJS.Timeout>()
  const startTimeRef = useRef<Date>()

  const activeTasks = tasks.filter((task) => task.status === "todo" || task.status === "in-progress")

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      if (timeLeft === 0 && isRunning) {
        handleTimerComplete()
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  const handleTimerComplete = () => {
    setIsRunning(false)

    // Save session
    if (startTimeRef.current && selectedTaskId) {
      addPomodoroSession({
        taskId: selectedTaskId,
        startTime: startTimeRef.current,
        endTime: new Date(),
        duration: getDurationForType(timerType),
        type: timerType,
        completed: true,
      })
    }

    // Auto-switch timer type
    if (timerType === "focus") {
      setSessionCount((prev) => prev + 1)
      const nextType = sessionCount % 4 === 3 ? "long-break" : "short-break"
      switchTimerType(nextType)
    } else {
      switchTimerType("focus")
    }

    // Play notification sound (mock)
    console.log("Timer completed! 🎉")
  }

  const getDurationForType = (type: TimerType): number => {
    switch (type) {
      case "focus":
        return settings.focus
      case "short-break":
        return settings.shortBreak
      case "long-break":
        return settings.longBreak
    }
  }

  const switchTimerType = (type: TimerType) => {
    setTimerType(type)
    setTimeLeft(getDurationForType(type) * 60)
    setIsRunning(false)
  }

  const handleStart = () => {
    if (!isRunning) {
      startTimeRef.current = new Date()
    }
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleStop = () => {
    setIsRunning(false)
    setTimeLeft(getDurationForType(timerType) * 60)
    startTimeRef.current = undefined
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(getDurationForType(timerType) * 60)
    setSessionCount(0)
    startTimeRef.current = undefined
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const progress = ((getDurationForType(timerType) * 60 - timeLeft) / (getDurationForType(timerType) * 60)) * 100

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Pomodoro Timer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Type Selector */}
          <div className="flex justify-center space-x-2">
            {(["focus", "short-break", "long-break"] as TimerType[]).map((type) => (
              <Button
                key={type}
                variant={timerType === type ? "default" : "outline"}
                size="sm"
                onClick={() => switchTimerType(type)}
                disabled={isRunning}
                className={timerType === type ? "bg-orange-500 hover:bg-orange-600" : ""}
              >
                {type === "focus" ? "Focus" : type === "short-break" ? "Short Break" : "Long Break"}
              </Button>
            ))}
          </div>

          {/* Task Selection */}
          {timerType === "focus" && (
            <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a task to focus on" />
              </SelectTrigger>
              <SelectContent>
                {activeTasks.map((task) => (
                  <SelectItem key={task.id} value={task.id}>
                    {task.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Timer Display */}
          <div className="text-center space-y-4">
            <div className="text-6xl font-mono font-bold text-gray-900">{formatTime(timeLeft)}</div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-2">
            <Button
              onClick={isRunning ? handlePause : handleStart}
              disabled={timerType === "focus" && !selectedTaskId}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" onClick={handleStop}>
              <Square className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Session Counter */}
          <div className="text-center text-sm text-gray-600">Sessions completed: {sessionCount}</div>
        </CardContent>
      </Card>
    </div>
  )
}
