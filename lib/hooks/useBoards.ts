import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import { Board } from "../supabase/model"
import { boardDataService } from "../services"
import { useSupabase } from "../supabase/SupabaseProvider"

export function useBoards() {
    const { user } = useUser()
    const {supabase} = useSupabase()
    const [boards, setBoards] = useState<Board[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

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
