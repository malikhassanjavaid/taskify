"use client"

import Navbar from "@/components/Navbar"
import StatCard from "@/components/StatCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useplan } from "@/lib/contexts/PlanContext"
import { useBoards } from "@/lib/hooks/useBoards"
import { Board } from "@/lib/supabase/model"
import { useUser } from "@clerk/nextjs"
import { Loader2, Plus, Rocket, Activity, Grid3X3, List, Filter, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Dashboard() {
  const { user } = useUser()
  const { isFreeUser } = useplan()
  const { createBoard, boards, loading, error } = useBoards()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
  const [showUpgradeDialog, setShowUpgradeDialog] = useState<boolean>(false)

  const router = useRouter()

  const [filters, setFilters] = useState({
    search: "",
    dateRange: {
      start: null as string | null,
      end: null as string | null,
    }
  })

  const canCreateBoard = !isFreeUser || boards.length < 1;
  const filteredBoards = boards.filter((board: Board) => {
    const matchesSearch = board.title.toLowerCase().includes(filters.search.toLowerCase())

    const matchesDateRange = 
    (!filters.dateRange.start || new Date(board.created_at) >= new Date(filters.dateRange.start))
    && (!filters.dateRange.end || new Date(board.created_at) <= new Date(filters.dateRange.end))

    return matchesSearch && matchesDateRange;
  })

  function clearFilters() {
    setFilters({
    search: "",
    dateRange: {
      start: null as string | null,
      end: null as string | null,
    }
  })
  }
  const handleCreateBoard = async () => {
    if (!canCreateBoard) {

      setShowUpgradeDialog(true);
      return;
    }
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
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Boards</h2>
    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
      Manage your projects and tasks efficiently
    </p>
   {isFreeUser && (
 <span className="mt-3 inline-block text-sm font-semibold text-amber-900 bg-gradient-to-r from-amber-300 to-amber-400 px-5 py-1.5 rounded-full shadow-md border border-amber-300 tracking-wide hover:shadow-lg transition-all duration-200">
  Free Plan — {boards.length}/1 boards used
</span>

)}
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

            <Button variant="outline" onClick={() => setIsFilterOpen(true)}>
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
              onChange={(e) => setFilters((prev) => ({...prev, search: e.target.value}))}
            />
            <Search className="text-white h-5 w-5" />
          </div>
        </div>

        {/* Boards Section */}
        {boards.length === 0 ? (
  <div className="text-gray-500 text-center mt-12">No boards yet</div>
) : viewMode === "grid" ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {filteredBoards.map((board, key) => (
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

      {/* Filter Dialog */}

<Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
  <DialogContent className="w-full max-w-lg p-6 rounded-xl bg-white shadow-lg">
    {/* Header */}
    <DialogHeader className="space-y-1 border-b pb-3">
      <DialogTitle className="text-xl font-semibold text-black">
        Filter Boards
      </DialogTitle>
      <p className="text-sm text-gray-500">
        Filter boards by title, date, or task count.
      </p>
    </DialogHeader>

    {/* Body */}
    <div className="space-y-5 mt-4">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search" className="text-black font-medium">
          Search
        </Label>
        <Input
          id="search"
          placeholder="Search board titles..."
          className="rounded-md border-gray-300 focus:ring-2 focus:ring-black w-full"
          onChange={(e) => setFilters((prev) => ({...prev, search: e.target.value}))}
        />
      </div>
      {/* Date Range */}
      <div className="space-y-2">
        <Label className="text-black font-medium">Date Range</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-sm text-gray-600">Start Date</Label>
            <Input
              type="date"
              className="rounded-md border-gray-300 focus:ring-2 focus:ring-black w-full"
              onChange={(e) => setFilters((prev) =>
                 ({...prev, dateRange: {
                  ...prev.dateRange,
                  start: e.target.value || null
                }
                }))}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-sm text-gray-600">End Date</Label>
            <Input
              type="date"
              className="rounded-md border-gray-300 focus:ring-2 focus:ring-black w-full"
               onChange={(e) => setFilters((prev) =>
                 ({...prev, dateRange: {
                  ...prev.dateRange,
                  end: e.target.value || null
                }
                }))}
            />
          </div>
        </div>
      </div>
      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={clearFilters} className="rounded-md px-5 w-full sm:w-auto">
          Clear Filters
        </Button>
        <Button onClick={() => setIsFilterOpen(false)} className="rounded-md px-5 w-full sm:w-auto">
          Apply Filters
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>

<Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
  <DialogContent className="w-full max-w-lg p-0 overflow-hidden rounded-2xl shadow-2xl border border-amber-200">
    
    {/* Header */}
    <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-6 text-center">
      <DialogTitle className="text-2xl font-bold text-white">
        Upgrade Your Plan
      </DialogTitle>
      <p className="text-sm text-amber-50 mt-2">
        Free users can create only 1 board. Unlock unlimited boards with Pro.
      </p>
    </div>

    {/* Body */}
    <div className="p-6 space-y-4 bg-white">
      <p className="text-gray-700 text-sm text-center">
        Upgrade now to <span className="font-semibold text-amber-600">Pro</span> and enjoy:
      </p>
      <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
        <li>Unlimited boards</li>
        <li>Priority customer support</li>
        <li>Access to upcoming premium features</li>
      </ul>
    </div>

    {/* Actions */}
   <div className="flex flex-col sm:flex-row justify-end gap-3 p-6 bg-gray-50 border-t border-gray-200">
  <Button
    onClick={() => setShowUpgradeDialog(false)}
    variant="outline"
    className="w-full sm:w-auto rounded-lg border-gray-300 hover:bg-gray-100"
  >
    Cancel
  </Button>
  <Button
    onClick={() => router.push("/pricing")}
    className="w-full sm:w-auto rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-md transition-all"
  >
    View Plans
  </Button>
</div>  
  </DialogContent>
</Dialog>

    </div>
  )
}
