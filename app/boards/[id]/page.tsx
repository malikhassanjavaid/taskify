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
import { Calendar, MoreHorizontal, Plus, User } from "lucide-react"
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
  className={`flex flex-col h-full p-4 rounded-xl shadow-md w-full max-w-full transition-all duration-300
    bg-white dark:bg-gray-900 
    ${isOver ? "ring-4 ring-blue-400 shadow-lg scale-[1.02] bg-blue-50 dark:bg-gray-800" : "hover:shadow-lg"}
  `}
>
  {/* Column Header */}
  <div className="flex items-center justify-between border-b pb-3 mb-4">
    <div className="flex items-center gap-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
        {column.title}
      </h3>
      <Badge variant="secondary" className="px-2 py-1 text-xs font-medium">
        {column.tasks.length}
      </Badge>
    </div>
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <MoreHorizontal className="h-5 w-5 text-gray-500" />
    </Button>
  </div>

  {/* Column Content */}
  <div className="flex flex-col gap-4 flex-1">
    {children}

    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 text-sm font-medium border-dashed hover:border-solid transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] w-full rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Task</DialogTitle>
          <p className="text-sm text-muted-foreground">Add a task to the board</p>
        </DialogHeader>

        <form className="space-y-5" onSubmit={onCreateTask}>
          {/* Title */}
          <div className="space-y-1">
            <Label htmlFor="title">Title*</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter task title"
              required
              className="rounded-lg"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter task description"
              rows={3}
              className="rounded-lg"
            />
          </div>

          {/* Assignee & Priority */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-1">
              <Label htmlFor="assignee">Assignee</Label>
              <Input
                id="assignee"
                name="assignee"
                placeholder="Who should do this?"
                className="h-10 rounded-lg"
              />
            </div>

            <div className="flex-1 space-y-1">
              <Label htmlFor="priority">Priority</Label>
              <Select name="priority" defaultValue="medium">
                <SelectTrigger className="h-10 w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                  {["low", "medium", "high"].map((priority, key) => (
                    <SelectItem
                      key={key}
                      value={priority}
                      className="capitalize text-sm px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-1">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              type="date"
              id="dueDate"
              name="dueDate"
              className="rounded-lg"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full rounded-lg shadow-sm hover:shadow-md transition"
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
    opacity: isDragging ? 0.5 : 1,
  };

  function getPriorityColor(priority: "low" | "medium" | "high"): string {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-yellow-500";
    }
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={styles}
      className="w-full cursor-grab active:cursor-grabbing"
    >
      <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-900">
        <CardContent className="p-5 flex flex-col gap-4">
          {/* Task Header */}
          <div className="flex justify-between items-start">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 break-words">
              {task.title}
            </h4>
            <div
              className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${getPriorityColor(
                task.priority
              )}`}
            />
          </div>

          {/* Task Description */}
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {task.description || "No description."}
          </p>

          {/* Task Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            {task.assignee && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="truncate">{task.assignee}</span>
              </div>
            )}
            {task.due_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>{task.due_date}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TaskOverlay({task}: {task: Task}) {

  function getPriorityColor(priority: "low" | "medium" | "high"): string {
    switch(priority) {
      case "high": 
      return "bg-red-500";
      case "medium": 
      return "bg-yellow-500"
      case "low": 
      return "bg-green-500"
      default: 
      return "bg-yellow-500"
    }
  }
  return (
    <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-900">
      <CardContent className="p-5 flex flex-col gap-4">
        
        {/* Task Header */}
        <div className="flex justify-between items-start">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 break-words">
            {task.title}
          </h4>
          <div
            className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${getPriorityColor(
              task.priority
            )}`}
          />
        </div>

        {/* Task Description */}
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {task.description || "No description."}
        </p>

        {/* Task Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          {task.assignee && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="truncate">{task.assignee}</span>
            </div>
          )}
          {task.due_date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{task.due_date}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
 );
}

export default function BoardPage() {
  const { id } = useParams<{ id: string }>()
  const { board, updateBoard, columns, createRealTask, setColumns, moveTask} = useBoard(id)

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newColor, setNewColor] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const sensors = useSensors(useSensor(
    PointerSensor, {
      activationConstraint: {
        distance: 8,
      }
    }
  ))

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
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <Navbar
        boardTitle={board?.title}
        onEditBoard={() => {
          setNewTitle(board?.title ?? "")
          setNewColor(board?.color ?? "")
          setIsEditingTitle(true)
        }}
        onFilterClick={() => setIsFilterOpen(true)}
        filterCount={2}
      />

      <Dialog open={isEditingTitle} onOpenChange={setIsEditingTitle}>
        <DialogContent className="sm:max-w-lg w-full rounded-xl shadow-xl border p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Edit Board</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdateBoard} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="boardTitle">Board Title</Label>
              <Input
                id="boardTitle"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter board title..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Board Color</Label>
              <div className="flex flex-wrap items-center gap-3">
                {["bg-blue-500","bg-pink-500","bg-green-500","bg-yellow-500","bg-red-500","bg-purple-500","bg-indigo-500","bg-orange-500","bg-teal-500","bg-gray-500"].map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={color}
                    className={`w-8 h-8 rounded-full border-2 border-white transition-all transform hover:scale-110 ${color} ${
                      color === newColor ? "ring-2 ring-offset-2 ring-black" : ""
                    }`}
                    onClick={() => setNewColor(color)}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditingTitle(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="sm:max-w-md w-full rounded-xl border shadow-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-semibold">Filter Tasks</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Filter tasks by priority, assignee, or due date
            </p>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <div className="flex flex-wrap gap-2">
                {["low", "medium", "high"].map((priority, key) => (
                  <Button
                    key={key}
                    type="button"
                    variant="outline"
                    className="capitalize px-4 py-1.5 text-sm"
                  >
                    {priority}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input type="date" className="w-full" />
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4">
              <Button type="button" variant="outline" className="w-full sm:w-auto">
                Clear Filter
              </Button>
              <Button type="button" className="w-full sm:w-auto" onClick={() => setIsFilterOpen(false)}>
                Apply Filter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xl font-semibold">
            <span>Total Tasks: </span>
            <span className="text-primary">
              {columns.reduce((sum, col) => sum + col.tasks.length, 0)}
            </span>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] w-full">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <p className="text-sm text-muted-foreground">Add a task to the board</p>
              </DialogHeader>

              <form className="space-y-4" onSubmit={handleCreateTask}>
                <div className="space-y-1">
                  <Label htmlFor="title">Title*</Label>
                  <Input id="title" name="title" placeholder="Enter task title" required />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="Enter task description" rows={3} />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="assignee">Assignee</Label>
                    <Input id="assignee" name="assignee" placeholder="Who should do this?" className="h-10" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <Label htmlFor="priority">Priority</Label>
                    <Select name="priority" defaultValue="medium">
                      <SelectTrigger className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                        {["low", "medium", "high"].map((priority, key) => (
                          <SelectItem
                            key={key}
                            value={priority}
                            className="capitalize text-sm px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-200 dark:focus:bg-gray-600"
                          >
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input type="date" id="dueDate" name="dueDate" />
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full">
                    Create Task
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Board Column */}
      <DndContext 
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        >
        <div
  className="flex flex-col lg:flex-row lg:space-x-6 lg:overflow-x-auto
             lg:pb-6 lg:px-4 lg:-mx-4
             bg-gradient-to-b from-gray-50 via-white to-gray-50
             dark:from-gray-900 dark:via-gray-950 dark:to-gray-900
             rounded-xl border border-gray-200 dark:border-gray-800
             shadow-inner p-4
             lg:[&::-webkit-scrollbar]:h-2
             lg:[&::-webkit-scrollbar-track]:bg-gray-200 dark:lg:[&::-webkit-scrollbar-track]:bg-gray-800
             lg:[&::-webkit-scrollbar-thumb]:bg-gradient-to-r lg:[&::-webkit-scrollbar-thumb]:from-blue-400 lg:[&::-webkit-scrollbar-thumb]:to-purple-500
             lg:[&::-webkit-scrollbar-thumb]:rounded-full
             transition-all duration-300 ease-in-out
             space-y-4 lg:space-y-0"
>
  {columns.map((column, key) => (
    <DropableColumn
      key={key}
      column={column}
      onCreateTask={handleCreateTask}
      onEditColumn={() => {}}
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

  <DragOverlay>
    {activeTask ? <TaskOverlay task={activeTask}/> : null}
  </DragOverlay>
</div>
</DndContext>
      </main>
    </div>
  )
}
