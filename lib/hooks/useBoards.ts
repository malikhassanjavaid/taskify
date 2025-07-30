"use client"
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { Board, Column } from "../supabase/model"
import { boardDataService, boardService } from "../services"
import { useSupabase } from "../supabase/SupabaseProvider"

export function useBoards() {
    const { user } = useUser()
    const {supabase} = useSupabase()
    const [boards, setBoards] = useState<Board[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
         if(user) {
            loadBoards()
         }
        }, [user,supabase])

    async function loadBoards() {
        
        if(!user) return;

        try {
          setLoading(true)
          setError(null)
          const data = await boardService.getBoards(supabase!, user.id)
          setBoards(data)
        } catch (err) {
           setError(err instanceof Error ? err.message: "Failed to load boards")
        } finally {
           setLoading(false)
        }
    }

    async function createBoard(boardData: {
        title: string,
        description?: string,
        color?: string
    }) {

        if(!user) throw new Error("User not authen")

        try {
            const newBoard = await boardDataService.createBoardwithDefaultColumns(
                supabase!,
                {
                ...boardData,
                userId: user.id,
            });
            setBoards((prev) => [newBoard, ...prev])
        } catch (err) {
            setError(err instanceof Error ? err.message: "Failed to create board")
        }

    }

   return {boards, loading, error, createBoard}
}


export function useBoard(boardId: string) {
    const {supabase} = useSupabase()
    const [board, setBoard] = useState<Board | null>(null)
    const [columns, setColumns] = useState<Column[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
         if(boardId) {
            loadBoard()
         }
        }, [boardId,supabase])

    async function loadBoard() {
        
        if(!boardId) return;

        try {
          setLoading(true)
          setError(null)
          const data = await boardDataService.getBoardwithColumns(supabase!, boardId)
          setBoard(data.board)
          setColumns(data.columns)
        } catch (err) {
           setError(err instanceof Error ? err.message: "Failed to load boards")
        } finally {
           setLoading(false)
        }
    }

    async function updateBoard(boardId: string, updates: Partial<Board>) {

        try {
          const updatedBoard = await boardService.updateBoard(supabase!, boardId, updates)
          setBoard(updatedBoard)
          return updatedBoard
        } catch (err) {
           setError(err instanceof Error ? err.message: "Failed to update the boards")
        }
    }

     return {board, columns, loading, error ,updateBoard}
}
