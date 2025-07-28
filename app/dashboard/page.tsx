"use client"

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useBoards } from "@/lib/hooks/useBoards";
import { useUser } from "@clerk/nextjs";
import { Plus } from "lucide-react";

export default function Dashboard() {

  const { user } = useUser();
  const { createBoard } = useBoards()

  const handleCreateBoard = async () => {
    await createBoard({title: "New Board"})
    
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 py-10">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome, {user?.firstName ?? user?.emailAddresses[0].emailAddress}!
          </h1>
          <p className="text-gray-700 mt-2">
            Here's what's happening with your boards today.
          </p>
          <Button className="w-full sm:w-auto" onClick={handleCreateBoard}>
             <Plus className="h-4 w-4 mr-2"/>
             Create Board
          </Button>
        </div>
      </main>
    </div>
  );
}

