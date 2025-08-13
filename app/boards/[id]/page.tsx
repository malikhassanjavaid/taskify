"use client"

import Navbar from "@/components/Navbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useBoard } from "@/lib/hooks/useBoards"
import { ColumnWithTasks, Task } from "@/lib/supabase/model"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { SelectContent } from "@radix-ui/react-select"
import { Calendar, MoreHorizontal, Plus, User, Clock, AlertCircle, CheckCircle2, Target } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, rectIntersection, useDroppable, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

function DropableColumn({
  column,
  children,
  onCreateTask,
  onEditColumn,
}: {
  column: ColumnWithTasks;
  children: React.ReactNode;
  onCreateTask: (taskData: any) => Promise<void>
  onEditColumn: (column: ColumnWithTasks) => void
  }) {
    const { setNodeRef, isOver} = useDroppable({id: column.id})

    return (
  <div
  ref={setNodeRef}
  className={`flex flex-col h-full p-4 sm:p-6 rounded-2xl w-full min-w-[280px] sm:min-w-[320px] max-w-full transition-all duration-300 backdrop-blur-sm border-2
    bg-card/80 border-border/50
    ${isOver ? "ring-2 ring-[#062a4d]/50 shadow-2xl scale-[1.02] bg-[#062a4d]/5 border-[#062a4d]/30" : "hover:shadow-xl hover:bg-card/90"}
  `}
>
  {/* Column Header */}
  <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/50">
    <div className="flex items-center gap-3">
      <h3 className="text-lg sm:text-xl font-bold text-foreground truncate">
        {column.title}
      </h3>
      <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold bg-[#062a4d]/10 text-[#062a4d] border border-[#062a4d]/20">
        {column.tasks.length}
      </Badge>
    </div>
    <Button
      variant="ghost"
      size="sm"
      className="rounded-xl hover:bg-muted transition-all duration-200 hover:scale-105"
      onClick={() => onEditColumn(column)}
    >
      <MoreHorizontal className="h-4 w-4 text-muted-foreground hover:text-foreground"/>
    </Button>
  </div>

  {/* Column Content */}
  <div className="flex flex-col gap-3 sm:gap-4 flex-1">
    {children}

    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 text-sm font-medium border-2 border-dashed border-border hover:border-[#062a4d]/50 hover:bg-[#062a4d]/5 transition-all duration-200 rounded-xl py-3"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] w-full rounded-2xl bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Create New Task</DialogTitle>
          <p className="text-sm text-muted-foreground">Add a task to organize your workflow</p>
        </DialogHeader>

        <form className="space-y-6" onSubmit={onCreateTask}>
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold text-foreground">Title*</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter task title"
              required
              className="rounded-xl bg-background border-border focus:border-[#062a4d] focus:ring-[#062a4d]/20"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-foreground">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter task description"
              rows={3}
              className="rounded-xl bg-background border-border focus:border-[#062a4d] focus:ring-[#062a4d]/20"
            />
          </div>

          {/* Assignee & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignee" className="text-sm font-semibold text-foreground">Assignee</Label>
              <Input
                id="assignee"
                name="assignee"
                placeholder="Who should do this?"
                className="rounded-xl bg-background border-border focus:border-[#062a4d] focus:ring-[#062a4d]/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-semibold text-foreground">Priority</Label>
              <Select name="priority" defaultValue="medium">
                <SelectTrigger className="rounded-xl bg-background border-border focus:border-[#062a4d] focus:ring-[#062a4d]/20">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border rounded-xl shadow-2xl">
                  {["low", "medium", "high"].map((priority, key) => (
                    <SelectItem
                      key={key}
                      value={priority}
                      className="capitalize text-sm px-4 py-3 hover:bg-muted focus:bg-muted rounded-lg m-1"
                    >
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-sm font-semibold text-foreground">Due Date</Label>
            <Input
              type="date"
              id="dueDate"
              name="dueDate"
              className="rounded-xl bg-background border-border focus:border-[#062a4d] focus:ring-[#062a4d]/20"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full rounded-xl bg-[#062a4d] hover:bg-[#062a4d]/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 py-3"
            >
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</div>

)
}

function SortableTask({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const styles = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  function getPriorityConfig(priority: "low" | "medium" | "high"): { color: string; icon: any; bg: string } {
    switch (priority) {
      case "high":
        return { color: "text-red-600 dark:text-red-400", icon: AlertCircle, bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50" };
      case "medium":
        return { color: "text-amber-600 dark:text-amber-400", icon: Clock, bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50" };
      case "low":
        return { color: "text-emerald-600 dark:text-emerald-400", icon: CheckCircle2, bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50" };
      default:
        return { color: "text-amber-600 dark:text-amber-400", icon: Clock, bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50" };
    }
  }

  const priorityConfig = getPriorityConfig(task.priority);
  const PriorityIcon = priorityConfig.icon;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={styles}
      className="w-full cursor-grab active:cursor-grabbing group"
    >
      <Card className={`rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border-2 bg-card/95 border-border/50 hover:border-[#062a4d]/30 hover:scale-[1.02] ${priorityConfig.bg}`}>
        <CardContent className="p-4 sm:p-5 flex flex-col gap-4">
          {/* Task Header */}
          <div className="flex justify-between items-start gap-3">
            <h4 className="text-base sm:text-lg font-bold text-foreground break-words flex-1 group-hover:text-[#062a4d] transition-colors">
              {task.title}
            </h4>
            <div className={`flex items-center gap-1 ${priorityConfig.color} flex-shrink-0`}>
              <PriorityIcon className="h-4 w-4" />
              <span className="text-xs font-semibold capitalize">{task.priority}</span>
            </div>
          </div>

          {/* Task Description */}
          {task.description && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 border-l-4 border-[#062a4d]/20 pl-3">
              {task.description}
            </p>
          )}

          {/* Task Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            {task.assignee && (
              <div className="flex items-center gap-2 px-2 py-1 bg-muted/50 rounded-lg">
                <User className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground truncate">{task.assignee}</span>
              </div>
            )}
            {task.due_date && (
              <div className="flex items-center gap-2 px-2 py-1 bg-muted/50 rounded-lg">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">{new Date(task.due_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

function TaskOverlay({task}: {task: Task}) {
  function getPriorityConfig(priority: "low" | "medium" | "high"): { color: string; icon: any; bg: string } {
    switch (priority) {
      case "high":
        return { color: "text-red-600 dark:text-red-400", icon: AlertCircle, bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50" };
      case "medium":
        return { color: "text-amber-600 dark:text-amber-400", icon: Clock, bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50" };
      case "low":
        return { color: "text-emerald-600 dark:text-emerald-400", icon: CheckCircle2, bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50" };
      default:
        return { color: "text-amber-600 dark:text-amber-400", icon: Clock, bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50" };
    }
  }

  const priorityConfig = getPriorityConfig(task.priority);
  const PriorityIcon = priorityConfig.icon;

  return (
    <Card className={`rounded-2xl shadow-2xl transition-shadow duration-300 backdrop-blur-sm border-2 bg-card/95 border-border/50 ${priorityConfig.bg} rotate-3 scale-105`}>
      <CardContent className="p-5 flex flex-col gap-4">
        {/* Task Header */}
        <div className="flex justify-between items-start gap-3">
          <h4 className="text-lg font-bold text-foreground break-words flex-1">
            {task.title}
          </h4>
          <div className={`flex items-center gap-1 ${priorityConfig.color} flex-shrink-0`}>
            <PriorityIcon className="h-4 w-4" />
            <span className="text-xs font-semibold capitalize">{task.priority}</span>
          </div>
        </div>

        {/* Task Description */}
        {task.description && (
          <p className="text-sm text-muted-foreground leading-relaxed border-l-4 border-[#062a4d]/20 pl-3">
            {task.description}
          </p>
        )}

        {/* Task Meta */}
        <div className="flex flex-col gap-2">
          {task.assignee && (
            <div className="flex items-center gap-2 px-2 py-1 bg-muted/50 rounded-lg">
              <User className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground truncate">{task.assignee}</span>
            </div>
          )}
          {task.due_date && (
            <div className="flex items-center gap-2 px-2 py-1 bg-muted/50 rounded-lg">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">{new Date(task.due_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
 );
}

export default function BoardPage() {
  const { id } = useParams<{ id: string }>()
  const { board, updateBoard, createColumn, updateColumn, columns, createRealTask, setColumns, moveTask} = useBoard(id)

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newColor, setNewColor] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const [isCreatingColumn, setIsCreatingColumn] = useState(false)
  const [isEditingColumn, setIsEditingColumn] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState("")

 const [editingColumnTitle, setEditingColumnTitle] = useState("")
 const [editingColumn, setEditingColumn] = useState<ColumnWithTasks | null>(null)

 const [filters, setFilters] = useState({
  priority: [] as string[],
  dueDate: null as string | null
 })

  const [activeTask, setActiveTask] = useState<Task | null>(null)


  const sensors = useSensors(useSensor(
    PointerSensor, {
      activationConstraint: {
        distance: 8,
      }
    }
  ))

  function handleFilterChange(
    type: "priority" | "dueDate",
    value: string | string[] | null
  ) {

    setFilters((prev) => ({
      ...prev, 
      [type]: value
    }))
  }

  function clearFilters() {
     setFilters({
       priority: [] as string[],
       dueDate: null as string | null
    })
  }

  async function handleUpdateBoard(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim() || !board) return

    try {
      await updateBoard(board.id, {
        title: newTitle.trim(),
        color: newColor || board.color,
      })
      setIsEditingTitle(false)
    } catch {}
  }


  async function createTask(taskData: {
     title: string;
    description?: string;
    assignee?: string;
    due_date?: string;
    priority: "low" | "medium" | "high";
  }) {
    const targetColumn = columns[0]
    if(!targetColumn) {
      throw new Error("No column available to add task")
    }

    await createRealTask(targetColumn.id, taskData)
  }
  async function handleCreateTask(e: any) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const taskData = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      assignee: (formData.get("assignee") as string) || undefined,
      due_date: (formData.get("dueDate") as string) || undefined,
      priority: (formData.get("priority") as | "low" | "medium" | "high") || "medium",
    }

    if (taskData.title.trim()) {
      await createTask(taskData)

      const trigger = document.querySelector('[data-state="open') as HTMLElement
      if (trigger) trigger.click()
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const taskId = event.active.id as string;
    const task = columns
    .flatMap((col) => col.tasks)
    .find((task) => task.id === taskId)

    if(task) {
      setActiveTask(task)
    }

  }

  function handleDragOver(event: DragOverEvent) {

    const { active, over } = event
    if(!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const sourceColumn = columns.find((col) => 
      col.tasks.some((task) => task.id === activeId))

    const targetColumn = columns.find((col) => 
      col.tasks.some((task) => task.id === overId))

    if(!sourceColumn || !targetColumn) return;

    if(sourceColumn.id === targetColumn.id) {

      const activeIndex = sourceColumn.tasks.findIndex(
        (task) => task.id === activeId
      )

       const overIndex = targetColumn.tasks.findIndex(
        (task) => task.id === overId
      )

      if(activeIndex !== overIndex) {
        setColumns((prev: ColumnWithTasks[]) => {
          const newColumns = [...prev]
          const column = newColumns.find((col) => col.id === sourceColumn.id)
          if(column) {
            const tasks = [...column.tasks]
            const [removed] = tasks.splice(activeIndex, 1)
            tasks.splice(overIndex, 0, removed)
            column.tasks = tasks
          }
          return newColumns;
        })
      }
    }

  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if(!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    const targetColumn = columns.find((col) =>
       col.id === overId)

    if(targetColumn) {

      const sourceColumn = columns.find((col) =>
         col.tasks.some((task) => task.id === taskId))

      if(sourceColumn && sourceColumn.id !== targetColumn.id) {
        await moveTask(taskId, targetColumn.id, targetColumn.tasks.length)
      }
    }

     else {
        // Check to see if were dropping on another task
        const sourceColumn = columns.find((col) =>
           col.tasks.some((task) => task.id === taskId))

         const targetColumn = columns.find((col) =>
           col.tasks.some((task) => task.id === overId))

         if (sourceColumn && targetColumn) {

          const oldIndex = sourceColumn.tasks.findIndex(
            (task) => task.id === taskId)

          const newIndex = sourceColumn.tasks.findIndex(
            (task) => task.id === overId)

          if (oldIndex !== newIndex) {
            await moveTask(taskId, targetColumn.id, newIndex)
          }
         }
      }
  }

  async function handleCreateColumn(e: React.FormEvent) {
    e.preventDefault()

    if(!newColumnTitle.trim()) return;

    await createColumn(newColumnTitle.trim()) 

    setNewColumnTitle("")
    setIsCreatingColumn(false)
  }

    async function handleUpdateColumn(e: React.FormEvent) {
    e.preventDefault()

    if(!editingColumnTitle.trim() || !editingColumn) return;

    await updateColumn(editingColumn.id, editingColumnTitle.trim())

    setEditingColumnTitle("")
    setIsEditingColumn(false)
    setEditingColumn(null)

  }

  function handleEditColumn(column: ColumnWithTasks) {

    setIsEditingColumn(true)
    setEditingColumn(column)
    setEditingColumnTitle(column.title)
  }

    const filteredColumns = columns.map((column) => ({
      ...column,
      tasks: column.tasks.filter((task) => {
        // Filter by priority

        if (
          filters.priority.length > 0 && 
          !filters.priority.includes(task.priority)
        ) {
          return false;
        }

        // Filter by due date

        if (filters.dueDate && task.due_date) {
          const taskDate = new Date(task.due_date).toDateString();
          const filterDate = new Date(filters.dueDate).toDateString()

          if (taskDate !== filterDate) {
            return false;
          }
        }
        return true;
      })
    }))

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar
        boardTitle={board?.title}
        onEditBoard={() => {
          setNewTitle(board?.title ?? "")
          setNewColor(board?.color ?? "")
          setIsEditingTitle(true)
        }}
        onFilterClick={() => setIsFilterOpen(true)}
        filterCount={Object.values(filters).reduce(
          (count, v) => 
            count + (Array.isArray(v) ? v.length : v !== null ? 1 : 0),
          0
        )}
      />

      <Dialog open={isEditingTitle} onOpenChange={setIsEditingTitle}>
        <DialogContent className="sm:max-w-lg w-full rounded-2xl shadow-2xl border-border bg-background backdrop-blur-sm">
          <DialogHeader className="pb-6 border-b border-border/50">
            <DialogTitle className="text-2xl font-bold text-foreground">Edit Board</DialogTitle>
            <p className="text-sm text-muted-foreground">Customize your board settings</p>
          </DialogHeader>

          <form onSubmit={handleUpdateBoard} className="space-y-6 pt-6">
            <div className="space-y-3">
              <Label htmlFor="boardTitle" className="text-sm font-semibold text-foreground">Board Title</Label>
              <Input
                id="boardTitle"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter board title..."
                required
                className="rounded-xl bg-background border-border focus:border-[#062a4d] focus:ring-[#062a4d]/20"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground">Board Color</Label>
              <div className="grid grid-cols-5 gap-3 p-4 bg-muted/30 rounded-xl">
                {["bg-blue-500","bg-pink-500","bg-green-500","bg-yellow-500","bg-red-500","bg-purple-500","bg-indigo-500","bg-orange-500","bg-teal-500","bg-[#062a4d]"].map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={color}
                    className={`w-10 h-10 rounded-2xl border-2 transition-all transform hover:scale-110 hover:shadow-lg ${color} ${
                      color === newColor ? "ring-4 ring-[#062a4d]/30 border-[#062a4d] scale-110" : "border-border hover:border-[#062a4d]/50"
                    }`}
                    onClick={() => setNewColor(color)}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
              <Button type="button" variant="outline" onClick={() => setIsEditingTitle(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl bg-[#062a4d] hover:bg-[#062a4d]/90 text-white">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="sm:max-w-md w-full rounded-2xl border-border bg-background shadow-2xl backdrop-blur-sm">
          <DialogHeader className="pb-6 border-b border-border/50">
            <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
              <div className="p-2 bg-[#062a4d]/10 rounded-xl">
                <Target className="h-5 w-5 text-[#062a4d]" />
              </div>
              Filter Tasks
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Refine your view by priority and due date
            </p>
          </DialogHeader>

          <div className="space-y-6 pt-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground">Priority Level</Label>
              <div className="grid grid-cols-3 gap-2">
                {["low", "medium", "high"].map((priority, key) => {
                  const isSelected = filters.priority.includes(priority);
                  const priorityConfig = {
                    low: { color: "border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100", icon: CheckCircle2 },
                    medium: { color: "border-amber-500 bg-amber-50 text-amber-700 hover:bg-amber-100", icon: Clock },
                    high: { color: "border-red-500 bg-red-50 text-red-700 hover:bg-red-100", icon: AlertCircle }
                  }[priority as "low" | "medium" | "high"];
                  const IconComponent = priorityConfig.icon;
                  
                  return (
                    <Button
                      onClick={() => {
                        const newPriorities = filters.priority.includes(priority)
                         ? filters.priority.filter((p) => p !== priority)
                         : [...filters.priority, priority];
                         handleFilterChange("priority", newPriorities);
                      }}
                      key={key}
                      type="button"
                      variant="outline"
                      className={`capitalize px-3 py-2 text-sm rounded-xl transition-all ${
                        isSelected 
                          ? `${priorityConfig.color} border-2` 
                          : "hover:bg-muted border-border"
                      }`}
                    >
                      <IconComponent className="h-3 w-3 mr-2" />
                      {priority}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground">Due Date</Label>
              <Input
                value={filters.dueDate || ""}
                onChange={(e) => handleFilterChange("dueDate", e.target.value || null)}
                type="date" 
                className="w-full rounded-xl bg-background border-border focus:border-[#062a4d] focus:ring-[#062a4d]/20" 
              />
            </div>

            <div className="flex gap-3 pt-6 border-t border-border/50">
              <Button 
                onClick={clearFilters} 
                type="button" 
                variant="outline" 
                className="flex-1 rounded-xl"
              >
                Clear Filters
              </Button>
              <Button 
                type="button" 
                className="flex-1 rounded-xl bg-[#062a4d] hover:bg-[#062a4d]/90 text-white" 
                onClick={() => setIsFilterOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#062a4d]/10 rounded-2xl">
                <Target className="h-6 w-6 text-[#062a4d]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Board Overview</h2>
                <p className="text-sm text-muted-foreground">Manage your tasks efficiently</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-muted/50 rounded-xl">
                <span className="text-sm font-medium text-muted-foreground">Total Tasks</span>
                <div className="text-2xl font-bold text-[#062a4d]">
                  {columns.reduce((sum, col) => sum + col.tasks.length, 0)}
                </div>
              </div>
              <div className="px-4 py-2 bg-muted/50 rounded-xl">
                <span className="text-sm font-medium text-muted-foreground">Columns</span>
                <div className="text-2xl font-bold text-foreground">{columns.length}</div>
              </div>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#062a4d] hover:bg-[#062a4d]/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 rounded-xl px-6 py-3">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] w-full rounded-2xl bg-background border-border">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-foreground">Create New Task</DialogTitle>
                <p className="text-sm text-muted-foreground">Add a task to organize your workflow</p>
              </DialogHeader>

              <form className="space-y-6" onSubmit={handleCreateTask}>
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-semibold text-foreground">Title*</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    placeholder="Enter task title" 
                    required 
                    className="rounded-xl bg-background border-border focus:border-[#062a4d] focus:ring-[#062a4d]/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold text-foreground">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    placeholder="Enter task description" 
                    rows={3} 
                    className="rounded-xl bg-background border-border focus:border-[#062a4d] focus:ring-[#062a4d]/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assignee" className="text-sm font-semibold text-foreground">Assignee</Label>
                    <Input 
                      id="assignee" 
                      name="assignee" 
                      placeholder="Who should do this?" 
                      className="rounded-xl bg-background border-border focus:border-[#062a4d] focus:ring-[#062a4d]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-sm font-semibold text-foreground">Priority</Label>
                    <Select name="priority" defaultValue="medium">
                      <SelectTrigger className="rounded-xl bg-background border-border focus:border-[#062a4d] focus:ring-[#062a4d]/20">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border rounded-xl shadow-2xl">
                        {["low", "medium", "high"].map((priority, key) => (
                          <SelectItem
                            key={key}
                            value={priority}
                            className="capitalize text-sm px-4 py-3 hover:bg-muted focus:bg-muted rounded-lg m-1"
                          >
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate" className="text-sm font-semibold text-foreground">Due Date</Label>
                  <Input 
                    type="date" 
                    id="dueDate" 
                    name="dueDate" 
                    className="rounded-xl bg-background border-border focus:border-[#062a4d] focus:ring-[#062a4d]/20"
                  />
                </div>

                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full rounded-xl bg-[#062a4d] hover:bg-[#062a4d]/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 py-3"
                  >
                    Create Task
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

{/* Board Columns */}
        <DndContext
          sensors={sensors}
          collisionDetection={rectIntersection}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="relative">
            <div
              className="flex flex-col lg:flex-row gap-6 lg:overflow-x-auto lg:pb-6 p-6 
                         bg-gradient-to-br from-card/30 via-card/50 to-card/80 
                         backdrop-blur-sm rounded-3xl border-2 border-border/30
                         shadow-2xl min-h-[600px]
                         lg:[&::-webkit-scrollbar]:h-3
                         lg:[&::-webkit-scrollbar-track]:bg-muted/30 lg:[&::-webkit-scrollbar-track]:rounded-full
                         lg:[&::-webkit-scrollbar-thumb]:bg-gradient-to-r lg:[&::-webkit-scrollbar-thumb]:from-[#062a4d]/60 lg:[&::-webkit-scrollbar-thumb]:to-[#062a4d]/40
                         lg:[&::-webkit-scrollbar-thumb]:rounded-full lg:[&::-webkit-scrollbar-thumb]:border-2 lg:[&::-webkit-scrollbar-thumb]:border-background
                         transition-all duration-500 ease-in-out hover:shadow-3xl
                         space-y-6 lg:space-y-0"
            >
              {filteredColumns.map((column, key) => (
                <DropableColumn
                  key={key}
                  column={column}
                  onCreateTask={handleCreateTask}
                  onEditColumn={handleEditColumn}
                >
                  <SortableContext
                    items={column.tasks.map((task) => task.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {column.tasks.map((task, key) => (
                        <SortableTask task={task} key={key} />
                      ))}
                    </div>
                  </SortableContext>
                </DropableColumn>
              ))}

              {/* Add Column Button */}
              <button
                onClick={() => setIsCreatingColumn(true)}
                className="min-w-[280px] sm:min-w-[320px] h-fit px-6 py-8 rounded-2xl
                           bg-gradient-to-br from-muted/50 to-muted/80 backdrop-blur-sm
                           hover:from-[#062a4d]/10 hover:to-[#062a4d]/20 
                           border-2 border-dashed border-border hover:border-[#062a4d]/50
                           text-muted-foreground hover:text-[#062a4d]
                           cursor-pointer flex flex-col items-center justify-center gap-3 font-medium
                           transition-all duration-300 focus:outline-none
                           focus:ring-4 focus:ring-[#062a4d]/20 hover:scale-105 hover:shadow-xl group"
              >
                <div className="p-3 bg-background rounded-2xl group-hover:bg-[#062a4d]/10 transition-colors">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="font-semibold">Add another list</p>
                  <p className="text-xs opacity-70">Organize more tasks</p>
                </div>
              </button>

              <DragOverlay>
                {activeTask ? <TaskOverlay task={activeTask} /> : null}
              </DragOverlay>
            </div>
          </div>
        </DndContext>
      </main>
    </div>

   {/* Create Column Dialog */}
<Dialog open={isCreatingColumn} onOpenChange={setIsCreatingColumn}>
  <DialogContent className="sm:max-w-md w-full rounded-2xl shadow-2xl border-border bg-background backdrop-blur-sm">
    <DialogHeader className="pb-6 border-b border-border/50">
      <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
        <div className="p-2 bg-[#062a4d]/10 rounded-xl">
          <Plus className="h-5 w-5 text-[#062a4d]" />
        </div>
        Create New Column
      </DialogTitle>
      <p className="text-sm text-muted-foreground">
        Add a new column to organize your tasks more efficiently
      </p>
    </DialogHeader>

    <form onSubmit={handleCreateColumn} className="space-y-6 pt-6">
      <div className="space-y-3">
        <Label htmlFor="columnTitle" className="text-sm font-semibold text-foreground">
          Column Title
        </Label>
        <Input
          id="columnTitle"
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
          placeholder="Enter column title..."
          required
          className="rounded-xl bg-background border-border focus:border-[#062a4d] focus:ring-[#062a4d]/20"
        />
      </div>

      <div className="flex gap-3 pt-6 border-t border-border/50">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsCreatingColumn(false)}
          className="flex-1 rounded-xl"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 rounded-xl bg-[#062a4d] hover:bg-[#062a4d]/90 text-white"
        >
          Create Column
        </Button>
      </div>
    </form>
  </DialogContent>
</Dialog>

<Dialog open={isEditingColumn} onOpenChange={setIsEditingColumn}>
  <DialogContent className="sm:max-w-md w-full rounded-2xl shadow-2xl border-border bg-background backdrop-blur-sm">
    <DialogHeader className="pb-6 border-b border-border/50">
      <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
        <div className="p-2 bg-[#062a4d]/10 rounded-xl">
          <MoreHorizontal className="h-5 w-5 text-[#062a4d]" />
        </div>
        Edit Column
      </DialogTitle>
      <p className="text-sm text-muted-foreground">
        Update the title of your column
      </p>
    </DialogHeader>

    <form onSubmit={handleUpdateColumn} className="space-y-6 pt-6">
      <div className="space-y-3">
        <Label htmlFor="editColumnTitle" className="text-sm font-semibold text-foreground">
          Column Title
        </Label>
        <Input
          id="editColumnTitle"
          value={editingColumnTitle}
          onChange={(e) => setEditingColumnTitle(e.target.value)}
          placeholder="Enter column title..."
          required
          className="rounded-xl bg-background border-border focus:border-[#062a4d] focus:ring-[#062a4d]/20"
        />
      </div>

      <div className="flex gap-3 pt-6 border-t border-border/50">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsEditingColumn(false)
            setEditingColumnTitle("")
            setEditingColumn(null)
          }}
          className="flex-1 rounded-xl"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 rounded-xl bg-[#062a4d] hover:bg-[#062a4d]/90 text-white"
        >
          Save Changes
        </Button>
      </div>
    </form>
  </DialogContent>
</Dialog>
    </>
  )
}
