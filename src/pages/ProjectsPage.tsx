"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, FolderOpen, MoreHorizontal } from "lucide-react"
import { useTaskStore } from "@/store/useTaskStore"
import { format } from "date-fns"

export function ProjectsPage() {
  const { projects, tasks, addProject, updateProject, deleteProject } = useTaskStore()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    color: "#F97316",
  })

  const handleCreateProject = () => {
    if (newProject.name.trim()) {
      addProject(newProject)
      setNewProject({ name: "", description: "", color: "#F97316" })
      setIsCreateDialogOpen(false)
    }
  }

  const getProjectStats = (projectId: string) => {
    const projectTasks = tasks.filter((task) => task.projectId === projectId)
    const completedTasks = projectTasks.filter((task) => task.status === "completed").length
    const totalTasks = projectTasks.length
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    return {
      totalTasks,
      completedTasks,
      completionRate,
      inProgress: projectTasks.filter((task) => task.status === "in-progress").length,
    }
  }

  const colors = ["#F97316", "#3B82F6", "#10B981", "#8B5CF6", "#EF4444", "#F59E0B", "#06B6D4", "#84CC16"]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={newProject.name}
                  onChange={(e) => setNewProject((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter project description"
                />
              </div>
              <div>
                <Label>Color</Label>
                <div className="flex space-x-2 mt-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 ${newProject.color === color ? "border-gray-400" : "border-gray-200"}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewProject((prev) => ({ ...prev, color }))}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProject} className="bg-orange-500 hover:bg-orange-600">
                  Create Project
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const stats = getProjectStats(project.id)

          return (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: project.color }} />
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                {project.description && <p className="text-sm text-gray-600 mt-2">{project.description}</p>}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{stats.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${stats.completionRate}%`,
                          backgroundColor: project.color,
                        }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Total Tasks</p>
                      <p className="font-semibold">{stats.totalTasks}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Completed</p>
                      <p className="font-semibold">{stats.completedTasks}</p>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex space-x-2">
                    <Badge variant="secondary">{stats.inProgress} In Progress</Badge>
                    <Badge variant="outline">{format(project.createdAt, "MMM yyyy")}</Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <FolderOpen className="h-4 w-4 mr-2" />
                      View Board
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {/* Empty State */}
        {projects.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FolderOpen className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600 text-center mb-4">
                Create your first project to organize your tasks and track progress.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-orange-500 hover:bg-orange-600">
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
