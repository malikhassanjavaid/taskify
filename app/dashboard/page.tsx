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
import { Loader2, Plus, Rocket, Activity, Grid3X3, List, Filter, Search, Calendar, Clock, TrendingUp, Grid3x3 } from "lucide-react"
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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 w-8 h-8 text-[#062a4d]" />
          <p className="text-muted-foreground">Loading your boards...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="p-6 max-w-md mx-4">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Boards</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
        {/* Welcome Header */}
        <div className="mb-6 sm:mb-8 lg:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 leading-tight">
                Welcome back, {user?.firstName || 'User'}!
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground">
                Here's what's happening with your boards today.
              </p>
            </div>
            <div className="flex items-center justify-between sm:justify-start gap-3 lg:gap-4">
              <div className="text-left sm:text-right">
                <p className="text-xs sm:text-sm text-muted-foreground">Today</p>
                <p className="text-sm sm:text-base font-semibold text-foreground">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: window.innerWidth > 640 ? 'long' : 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-[#062a4d] flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 lg:mb-12">
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-[#062a4d]/5 to-[#062a4d]/10 border-[#062a4d]/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 truncate">Total Boards</p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{boards.length}</p>
                  <p className="text-xs text-muted-foreground">All your projects</p>
                </div>
                <div className="p-2 sm:p-3 bg-[#062a4d]/10 rounded-lg sm:rounded-xl flex-shrink-0 ml-2">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#062a4d]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-4 sm:p-6 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 border-emerald-500/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 truncate">Active Projects</p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{boards.length}</p>
                  <p className="text-xs text-muted-foreground">Currently working on</p>
                </div>
                <div className="p-2 sm:p-3 bg-emerald-500/10 rounded-lg sm:rounded-xl flex-shrink-0 ml-2">
                  <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-4 sm:p-6 bg-gradient-to-br from-violet-500/5 to-violet-500/10 border-violet-500/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] sm:col-span-2 lg:col-span-1">
            <CardContent className="p-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 truncate">Recent Activity</p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{recentActivityCount}</p>
                  <p className="text-xs text-muted-foreground">Updated this week</p>
                </div>
                <div className="p-2 sm:p-3 bg-violet-500/10 rounded-lg sm:rounded-xl flex-shrink-0 ml-2">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Boards Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 gap-4 lg:gap-6">
          <div className="space-y-4 flex-1">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Your Boards</h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Manage your projects and tasks efficiently
              </p>
            </div>
            
            {isFreeUser && (
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-lg">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse flex-shrink-0"></div>
                <span className="text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-600">
                  Free Plan — {boards.length}/1 boards used
                </span>
              </div>
            )}

            {/* Search Bar */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search boards..."
                className="pl-10 w-full bg-background border-border focus:border-[#062a4d] focus:ring-[#062a4d]/20 text-sm"
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({...prev, search: e.target.value}))}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3 lg:flex-shrink-0">
            <div className="flex items-center bg-gray-100 rounded-xl p-1 order-2 sm:order-1 shadow-sm">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List />
                </Button>
              </div>
            <div className="flex gap-2 sm:gap-3 order-1 sm:order-2">
              <Button 
                variant="outline" 
                onClick={() => setIsFilterOpen(true)}
                className="flex-1 sm:flex-none border-border hover:bg-muted text-sm"
                size="sm"
              >
                <Filter className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Filter</span>
                <span className="sm:hidden">Filter</span>
              </Button>

              <Button 
                onClick={handleCreateBoard}
                className="flex-1 sm:flex-none bg-[#062a4d] hover:bg-[#062a4d]/90 text-white shadow-sm hover:shadow-md transition-all duration-200 text-sm"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Create Board</span>
                <span className="sm:hidden">Create</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Boards Section */}
        {boards.length === 0 ? (
          <Card className="p-6 sm:p-8 lg:p-12 text-center border-dashed border-2">
            <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-full flex items-center justify-center">
                <Plus className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">No boards yet</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4">
                  Get started by creating your first board to organize your tasks and projects.
                </p>
                <Button 
                  onClick={handleCreateBoard}
                  className="bg-[#062a4d] hover:bg-[#062a4d]/90 text-white w-full sm:w-auto"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Board
                </Button>
              </div>
            </div>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3">
            {filteredBoards.map((board, key) => (
              <Link href={`/boards/${board.id}`} key={key}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border hover:border-[#062a4d]/30 bg-card h-full">
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <div className={`w-3 h-3 sm:w-4 sm:h-4 ${board.color} rounded-full shadow-sm flex-shrink-0`} />
                    <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">
                      Active
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <CardTitle className="text-base sm:text-lg font-semibold text-foreground group-hover:text-[#062a4d] transition-colors line-clamp-2">
                        {board.title}
                      </CardTitle>
                      {board.description && (
                        <CardDescription className="text-muted-foreground line-clamp-2 text-sm">
                          {board.description}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 text-xs text-muted-foreground pt-3 border-t border-border/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">Created {new Date(board.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">Last updated {new Date(board.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {/* Add New Board Card */}
            <Card className="border-2 border-dashed border-border hover:border-[#062a4d]/50 hover:bg-muted/20 transition-all duration-300 cursor-pointer group h-full min-h-[200px] flex items-center justify-center">
              <div
                onClick={handleCreateBoard}
                className="flex flex-col items-center justify-center text-center p-4"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#062a4d]/10 group-hover:bg-[#062a4d]/20 rounded-full flex items-center justify-center mb-3 sm:mb-4 transition-colors">
                  <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-[#062a4d]" />
                </div>
                <p className="text-sm sm:text-base font-medium text-foreground group-hover:text-[#062a4d] transition-colors">
                  Create New Board
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Start organizing your tasks
                </p>
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredBoards.map((board, key) => (
                <div key={key} className={key > 0 ? "mt-3" : ""}>
              <Link href={`/boards/${board.id}`}>
                <Card className="group hover:shadow-lg mb-2 hover:border-[#062a4d]/30 transition-all duration-300 cursor-pointer hover:scale-[1.01] bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className={`w-3 h-3 sm:w-4 sm:h-4 ${board.color} rounded-full flex-shrink-0 mt-1 sm:mt-0 shadow-sm`} />
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-[#062a4d] transition-colors truncate mb-1">
                            {board.title}
                          </h3>
                          {board.description && (
                            <p className="text-xs sm:text-sm text-muted-foreground truncate mb-2">
                              {board.description}
                            </p>
                          )}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>Created {new Date(board.created_at).toLocaleDateString()}</span>
                            </div>
                            <span className="hidden sm:inline text-border">•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Updated {new Date(board.updated_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs border-emerald-200 dark:border-emerald-800">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              </div>
            ))}

            {/* Add New Board in List View */}
            <Card className="border-2 border-dashed border-border hover:border-[#062a4d]/50 hover:bg-muted/20 transition-all duration-300 cursor-pointer group">
              <CardContent
                onClick={handleCreateBoard}
                className="flex items-center justify-center gap-3 py-6 sm:py-8 text-center"
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#062a4d]/10 group-hover:bg-[#062a4d]/20 rounded-full flex items-center justify-center transition-colors">
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-[#062a4d]" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-medium text-foreground group-hover:text-[#062a4d] transition-colors">
                    Create New Board
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Start organizing your tasks</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Filter Dialog */}

<Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
  <DialogContent className="w-full max-w-lg rounded-xl bg-background border-border shadow-2xl">
    <DialogHeader className="space-y-2 border-b border-border pb-4">
      <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
        <Filter className="w-5 h-5 text-[#062a4d]" />
        Filter Boards
      </DialogTitle>
      <p className="text-sm text-muted-foreground">
        Filter boards by title, date range, or other criteria.
      </p>
    </DialogHeader>

    <div className="space-y-6 py-4">
      <div className="space-y-3">
        <Label htmlFor="search" className="text-foreground font-medium">
          Search
        </Label>
        <Input
          id="search"
          placeholder="Search board titles..."
          className="bg-background border-border focus:border-[#062a4d] focus:ring-[#062a4d]/20"
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({...prev, search: e.target.value}))}
        />
      </div>
      
      <div className="space-y-3">
        <Label className="text-foreground font-medium">Date Range</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Start Date</Label>
            <Input
              type="date"
              className="bg-background border-border focus:border-[#062a4d] focus:ring-[#062a4d]/20"
              value={filters.dateRange.start || ""}
              onChange={(e) => setFilters((prev) =>
                 ({...prev, dateRange: {
                  ...prev.dateRange,
                  start: e.target.value || null
                }
                }))}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">End Date</Label>
            <Input
              type="date"
              className="bg-background border-border focus:border-[#062a4d] focus:ring-[#062a4d]/20"
              value={filters.dateRange.end || ""}
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
      
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-border">
        <Button 
          variant="outline" 
          onClick={clearFilters} 
          className="w-full sm:w-auto border-border hover:bg-muted"
        >
          Clear Filters
        </Button>
        <Button 
          onClick={() => setIsFilterOpen(false)} 
          className="w-full sm:w-auto bg-[#062a4d] hover:bg-[#062a4d]/90 text-white"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>

<Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
  <DialogContent className="w-full max-w-lg p-0 overflow-hidden rounded-2xl shadow-2xl border-border">
    <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/20 p-8 text-center border-b border-amber-200/20">
      <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <Rocket className="w-8 h-8 text-amber-600" />
      </div>
      <DialogTitle className="text-2xl font-bold text-foreground mb-2">
        Upgrade Your Plan
      </DialogTitle>
      <p className="text-muted-foreground">
        Free users can create only 1 board. Unlock unlimited boards with Pro.
      </p>
    </div>

    <div className="p-6 space-y-6 bg-background">
      <div className="text-center">
        <p className="text-foreground mb-4">
          Upgrade to <span className="font-semibold text-amber-600">Pro</span> and enjoy:
        </p>
        <div className="space-y-3 text-left">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-muted-foreground">Unlimited boards</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-muted-foreground">Priority customer support</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-muted-foreground">Access to upcoming premium features</span>
          </div>
        </div>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row gap-3 p-6 bg-muted/20 border-t border-border">
      <Button
        onClick={() => setShowUpgradeDialog(false)}
        variant="outline"
        className="w-full sm:w-auto border-border hover:bg-muted"
      >
        Cancel
      </Button>
      <Button
        onClick={() => router.push("/pricing")}
        className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-sm hover:shadow-md transition-all"
      >
        View Plans
      </Button>
    </div>  
  </DialogContent>
</Dialog>

    </div>
  )
}
