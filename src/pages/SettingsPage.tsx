"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Bell, Palette, Clock, Database, Shield } from "lucide-react"
import { useTaskStore } from "@/store/useTaskStore"

export function SettingsPage() {
  const { currentUser, tasks, projects, tags } = useTaskStore()
  const [settings, setSettings] = useState({
    theme: "system",
    notifications: true,
    soundEnabled: true,
    pomodoroFocus: 25,
    pomodoroShortBreak: 5,
    pomodoroLongBreak: 15,
    autoStartBreaks: false,
    autoStartPomodoros: false,
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleDataReset = () => {
    if (confirm("Are you sure you want to reset all data? This action cannot be undone.")) {
      localStorage.removeItem("qwikish-tasks-storage")
      window.location.reload()
    }
  }

  const exportData = () => {
    const data = {
      tasks,
      projects,
      tags,
      exportDate: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `qwikish-tasks-export-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {currentUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline">Change Avatar</Button>
                  <p className="text-sm text-gray-600 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={currentUser.name} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={currentUser.email} />
                </div>
              </div>

              <Button className="bg-orange-500 hover:bg-orange-600">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Appearance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Theme</Label>
                <Select value={settings.theme} onValueChange={(value) => handleSettingChange("theme", value)}>
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Preview</h4>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="font-medium">Sample Task</span>
                    <Badge variant="secondary">High</Badge>
                  </div>
                  <p className="text-sm text-gray-600">This is how your tasks will appear with the current theme.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-gray-600">Receive notifications for task updates and reminders</p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => handleSettingChange("notifications", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Sound Effects</Label>
                  <p className="text-sm text-gray-600">Play sounds for timer completions and notifications</p>
                </div>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => handleSettingChange("soundEnabled", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pomodoro Settings */}
        <TabsContent value="pomodoro">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Pomodoro Timer</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="focus">Focus Duration (minutes)</Label>
                  <Input
                    id="focus"
                    type="number"
                    value={settings.pomodoroFocus}
                    onChange={(e) => handleSettingChange("pomodoroFocus", Number.parseInt(e.target.value))}
                    min="1"
                    max="60"
                  />
                </div>
                <div>
                  <Label htmlFor="shortBreak">Short Break (minutes)</Label>
                  <Input
                    id="shortBreak"
                    type="number"
                    value={settings.pomodoroShortBreak}
                    onChange={(e) => handleSettingChange("pomodoroShortBreak", Number.parseInt(e.target.value))}
                    min="1"
                    max="30"
                  />
                </div>
                <div>
                  <Label htmlFor="longBreak">Long Break (minutes)</Label>
                  <Input
                    id="longBreak"
                    type="number"
                    value={settings.pomodoroLongBreak}
                    onChange={(e) => handleSettingChange("pomodoroLongBreak", Number.parseInt(e.target.value))}
                    min="1"
                    max="60"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-start Breaks</Label>
                    <p className="text-sm text-gray-600">Automatically start break timers after focus sessions</p>
                  </div>
                  <Switch
                    checked={settings.autoStartBreaks}
                    onCheckedChange={(checked) => handleSettingChange("autoStartBreaks", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-start Pomodoros</Label>
                    <p className="text-sm text-gray-600">Automatically start focus sessions after breaks</p>
                  </div>
                  <Switch
                    checked={settings.autoStartPomodoros}
                    onCheckedChange={(checked) => handleSettingChange("autoStartPomodoros", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Settings */}
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Data Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-orange-500">{tasks.length}</p>
                  <p className="text-sm text-gray-600">Total Tasks</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-blue-500">{projects.length}</p>
                  <p className="text-sm text-gray-600">Projects</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-green-500">{tags.length}</p>
                  <p className="text-sm text-gray-600">Tags</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Export Data</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Download all your tasks, projects, and settings as a JSON file.
                  </p>
                  <Button variant="outline" onClick={exportData}>
                    Export Data
                  </Button>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-red-600">Danger Zone</h4>
                  <p className="text-sm text-gray-600 mb-4">Reset all data. This action cannot be undone.</p>
                  <Button variant="destructive" onClick={handleDataReset}>
                    Reset All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About */}
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>About Qwikish Tasks</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">Q</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Qwikish Tasks</h3>
                <p className="text-gray-600 mb-4">Advanced Task Management for Productivity</p>
                <Badge variant="outline">Version 1.0.0</Badge>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Features</h4>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li>• Kanban Board with drag & drop</li>
                    <li>• Pomodoro Timer with task tracking</li>
                    <li>• Calendar integration</li>
                    <li>• Analytics and reporting</li>
                    <li>• Project management</li>
                    <li>• Offline-first with localStorage</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium">Built with</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">React</Badge>
                    <Badge variant="outline">TypeScript</Badge>
                    <Badge variant="outline">Tailwind CSS</Badge>
                    <Badge variant="outline">Zustand</Badge>
                    <Badge variant="outline">ShadCN UI</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
