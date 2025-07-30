"use client"

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBoard } from "@/lib/hooks/useBoards";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function BoardPage() {

    const { id } = useParams<{id: string}>()
    const { board, updateBoard } = useBoard(id)

    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [newTitle, setNewTitle] = useState("")
    const [newColor, setNewColor] = useState("")

    async function handleUpdateBoard(e: React.FormEvent) {
       e.preventDefault()

       if(!newTitle.trim() || !board) return;

       try {
        await updateBoard(board.id, {
            title: newTitle.trim(),
            color: newColor || board.color,
        })
        setIsEditingTitle(false)
       } catch {}
    }

    return (
        <div>
            <Navbar 
            boardTitle={board?.title}
            onEditBoard={() => {
                setNewTitle(board?.title ?? "")
                setNewColor(board?.color ?? "")
                setIsEditingTitle(true)
            }} />

            <Dialog open={isEditingTitle} onOpenChange={setIsEditingTitle}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Edit Board</DialogTitle>
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
        <div className="flex items-center gap-3">
          {["bg-blue-500", "bg-pink-500", "bg-green-500", "bg-yellow-500"].map((color) => (
            <button
              key={color}
              type="button"
              className={`w-8 h-8 rounded-full border border-white transition-shadow ${color} ${
                color === newColor ? "ring-2 ring-offset-2 ring-black" : ""
              }`}
              onClick={() => setNewColor(color)}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsEditingTitle(false)}
        >
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  </DialogContent>
</Dialog>

        </div>
    )
}