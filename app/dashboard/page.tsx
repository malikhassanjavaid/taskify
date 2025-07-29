"use client"

import Navbar from "@/components/Navbar"
import StatCard from "@/components/StatCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useBoards } from "@/lib/hooks/useBoards"
import { useUser } from "@clerk/nextjs"
import { Loader2, Plus, Rocket, Activity, Grid3X3, List, Filter, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function Dashboard() {
  const { user } = useUser()
  const { createBoard, boards, loading, error } = useBoards()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const handleCreateBoard = async () => {
    await createBoard({ title: "New Board" })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-700">
        <Loader2 className="animate-spin mr-2" />
        <span>Loading your boards...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-600">
        <div>
          <h2 className="text-xl font-semibold">Error Loading Boards</h2>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  const recentActivityCount = boards.filter((board) => {
    const updatedAt = new Date(board.updated_at)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    return updatedAt > oneWeekAgo
  }).length

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Welcome Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Welcome, {user?.firstName ?? user?.emailAddresses[0].emailAddress}!
          </h1>
          <p className="text-gray-600 mb-4">Here's what's happening with your boards today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <StatCard
            title="Total Boards"
            value={boards.length}
            icon={<Image src="/taskify.png" alt="Logo" width={40} height={40} />}
          />
          <StatCard
            title="Active Projects"
            value={boards.length}
            icon={<Rocket className="h-6 w-6 text-purple-500" />}
          />
          <StatCard
            title="Recent Activity"
            value={recentActivityCount}
            icon={<Activity className="h-6 w-6 text-green-500" />}
          />
        </div>

        {/* Boards Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Your Boards</h2>
            <p className="text-sm text-gray-600">Manage your projects and tasks efficiently</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>

            <Button onClick={handleCreateBoard}>
              <Plus className="h-4 w-4 mr-2" />
              Create Board
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex items-center bg-[#4a4a4a] rounded-full px-4 py-2 w-full max-w-md">
            <input
              type="text"
              placeholder="Search boards..."
              className="flex-grow bg-transparent outline-none text-white placeholder-white"
            />
            <Search className="text-white h-5 w-5" />
          </div>
        </div>

        {/* Boards Section */}
        {boards.length === 0 ? (
  <div className="text-gray-500 text-center mt-12">No boards yet</div>
) : viewMode === "grid" ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {boards.map((board, key) => (
      <Link href={`/boards/${board.id}`} key={key}>
        <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className={`w-4 h-4 ${board.color} rounded`} />
            <Badge variant="secondary">New</Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <CardTitle>{board.title}</CardTitle>
            <CardDescription>{board.description}</CardDescription>
            <div className="text-xs text-gray-500 space-x-4">
              <span>Created {new Date(board.created_at).toLocaleDateString()}</span>
              <span>Updated {new Date(board.updated_at).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    ))}

    {/* Add New Board Card */}
    <div className="border border-dashed rounded-lg hover:shadow-sm transition cursor-pointer">
      <div
        onClick={handleCreateBoard}
        className="flex flex-col items-center justify-center h-full py-12 text-center text-muted-foreground hover:text-black transition"
      >
        <Plus className="h-6 w-6 mb-2" />
        <p className="font-medium text-sm">Create New Board</p>
      </div>
    </div>
  </div>
) : (
  <div className="space-y-4">
    {boards.map((board, key) => (
      <div key={key} className={key > 0 ? "mt-4" : ""}>
      <Link href={`/boards/${board.id}`}>
        <Card className="hover:shadow-sm transition-all duration-300 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className={`w-4 h-4 ${board.color} rounded`} />
            <Badge variant="secondary">New</Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <CardTitle>{board.title}</CardTitle>
            <CardDescription>{board.description}</CardDescription>
            <div className="text-xs text-gray-500 space-x-4">
              <span>Created {new Date(board.created_at).toLocaleDateString()}</span>
              <span>Updated {new Date(board.updated_at).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
      </div>
    ))}

    {/* Add New Board in List View */}
    <Card className="hover:bg-gray-100 transition cursor-pointer">
      <CardContent
        onClick={handleCreateBoard}
        className="flex items-center gap-3 py-6 justify-center text-muted-foreground hover:text-black"
      >
        <Plus className="h-5 w-5" />
        <p className="font-medium text-sm">Create New Board</p>
      </CardContent>
    </Card>
  </div>
)}
      </main>
    </div>
  )
}
