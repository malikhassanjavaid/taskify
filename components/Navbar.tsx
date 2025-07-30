"use client"

import Image from "next/image"
import Link from "next/link"
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs"
import { ArrowLeft, ArrowRight, Filter, MoreHorizontal } from "lucide-react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "./ui/badge"

interface Props {
  boardTitle?: string
  onEditBoard?: () => void
  onFilterClick?: () => void
  filterCount?: number
}

export default function Navbar({
  boardTitle,
  onEditBoard,
  onFilterClick,
  filterCount = 0,
}: Props) {
  const { isSignedIn, user } = useUser()
  const pathname = usePathname()

  const isDashboardPage = pathname === "/dashboard"
  const isBoardPage = pathname.startsWith("/boards/")

  if (isDashboardPage) {
    return (
      <nav className="bg-white dark:bg-gray-950 shadow-sm w-full">
        <div className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 gap-2">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image src="/taskify.png" alt="Taskify Logo" width={36} height={36} />
            <span className="text-lg sm:text-2xl font-bold text-[#062a4d]">
              Taskify
            </span>
          </div>
          {/* User */}
          <div className="flex items-center space-x-3">
            <UserButton />
          </div>
        </div>
      </nav>
    )
  }

  if (isBoardPage) {
    return (
      <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            {/* Back Button */}
            <Link
              href="/dashboard"
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to dashboard</span>
            </Link>

            {/* Divider */}
            <div className="hidden sm:block h-6 w-px bg-gray-300 dark:bg-gray-700" />

            {/* Logo + Board Title */}
            <div className="flex items-center gap-3">
              <Image src="/taskify.png" alt="Taskify Logo" width={36} height={36} />
              <div className="flex items-center gap-1">
                <span className="font-semibold text-lg text-gray-900 dark:text-white truncate max-w-[140px] sm:max-w-xs">
                  {boardTitle}
                </span>
                {onEditBoard && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-1"
                    onClick={onEditBoard}
                  >
                    <MoreHorizontal className="w-4 h-4 text-gray-500 hover:text-black dark:hover:text-white transition" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Filter Button */}
          {onFilterClick && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all w-full sm:w-auto"
              onClick={onFilterClick}
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
              {filterCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 px-2 py-0.5 text-xs rounded-full"
                >
                  {filterCount}
                </Badge>
              )}
            </Button>
          )}
        </div>
      </header>
    )
  }

  return (
    <nav className="bg-white dark:bg-gray-950 shadow-sm w-full">
      <div className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 gap-2">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src="/taskify.png" alt="Taskify Logo" width={36} height={36} />
          <span className="text-lg sm:text-2xl font-bold text-[#062a4d]">
            Taskify
          </span>
        </div>

        {/* Right-side */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3">
          {isSignedIn ? (
            <>
              <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">
                Welcome, {user.firstName ?? user.emailAddresses[0].emailAddress}
              </span>
              <Link href="/dashboard">
                <Button size="sm" className="text-xs sm:text-sm flex items-center gap-1">
                  Go to Dashboard <ArrowRight size={16} />
                </Button>
              </Link>
            </>
          ) : (
            <>
              <SignInButton>
                <Button size="sm" className="text-xs sm:text-sm" variant="ghost">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button size="sm" className="text-xs sm:text-sm">
                  Sign Up
                </Button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
