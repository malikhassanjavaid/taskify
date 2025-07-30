"use client"

import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useBoard } from "@/lib/hooks/useBoards"
import { useParams } from "next/navigation"
import { useState } from "react"

export default function BoardPage() {
  const { id } = useParams<{ id: string }>()
  const { board, updateBoard } = useBoard(id)

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newColor, setNewColor] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

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

      {/* --- Edit Dialog --- */}
      <Dialog open={isEditingTitle} onOpenChange={setIsEditingTitle}>
        <DialogContent className="sm:max-w-lg w-full rounded-xl shadow-xl border p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Edit Board</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdateBoard} className="space-y-6">
            {/* Board Title */}
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

            {/* Board Color */}
            <div className="space-y-2">
              <Label>Board Color</Label>
              <div className="flex flex-wrap items-center gap-3">
                {[
                  "bg-blue-500",
                  "bg-pink-500",
                  "bg-green-500",
                  "bg-yellow-500",
                  "bg-red-500",
                  "bg-purple-500",
                  "bg-indigo-500",
                  "bg-orange-500",
                  "bg-teal-500",
                  "bg-gray-500",
                ].map((color) => (
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

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditingTitle(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- Filter Dialog --- */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="sm:max-w-md w-full rounded-xl border shadow-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-semibold">Filter Tasks</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Filter tasks by priority, assignee, or due date
            </p>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Priority */}
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

            {/* Due Date */}
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input type="date" className="w-full" />
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4">
              <Button type="button" variant="outline" className="w-full sm:w-auto">
                Clear Filter
              </Button>
              <Button
                type="button"
                className="w-full sm:w-auto"
                onClick={() => setIsFilterOpen(false)}
              >
                Apply Filter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
