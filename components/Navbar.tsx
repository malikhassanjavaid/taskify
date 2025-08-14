"use client"

import Image from "next/image"
import Link from "next/link"
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs"
import { ArrowLeft, ArrowRight, Filter, MoreHorizontal, Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "./ui/badge"
import { useState } from "react"

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isDashboardPage = pathname === "/dashboard"
  const isBoardPage = pathname.startsWith("/boards/")

  if (isDashboardPage) {
    return (
      <nav className="bg-background/95 border-b border-border shadow-sm w-full backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-all duration-200 hover:scale-105">
            <div className="relative">
              <Image 
                src="/taskify.png" 
                alt="Taskify Logo" 
                width={36} 
                height={36} 
                className="sm:w-10 sm:h-10 drop-shadow-sm"
              />
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-[#062a4d] dark:text-foreground">
              Taskify
            </span>
          </Link>

          {/* User Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {isSignedIn && (
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs sm:text-sm text-muted-foreground block">
                    Welcome back
                  </span>
                  <span className="text-sm sm:text-base font-medium text-foreground">
                    {user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress}
                  </span>
                </div>
              </div>
            )}
            <div className="flex items-center">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 sm:w-10 sm:h-10 ring-2 ring-border hover:ring-[#062a4d]/30 transition-all duration-200 hover:scale-105"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </nav>
    )
  }

  if (isBoardPage) {
    return (
      <header className="w-full border-b border-border bg-background/95 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Left Section */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              {/* Back Button */}
              <Link
                href="/dashboard"
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted rounded-lg transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>

              {/* Divider */}
              <div className="hidden sm:block h-5 sm:h-6 w-px bg-border" />

              {/* Logo + Board Title */}
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <Link href="/" className="flex-shrink-0">
                  <Image 
                    src="/taskify.png" 
                    alt="Taskify Logo" 
                    width={28} 
                    height={28} 
                    className="sm:w-8 sm:h-8 drop-shadow-sm"
                  />
                </Link>
                <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                  <h1 className="font-semibold text-sm sm:text-base lg:text-lg text-foreground truncate max-w-[120px] sm:max-w-[200px] lg:max-w-xs">
                    {boardTitle}
                  </h1>
                  {onEditBoard && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-shrink-0 h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-muted transition-all duration-200 hover:scale-105 cursor-pointer"
                      onClick={onEditBoard}
                    >
                      <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground hover:text-foreground" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Filter Button */}
              {onFilterClick && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center  cursor-pointer gap-1 sm:gap-2 text-xs sm:text-sm bg-background hover:bg-muted transition-all duration-200 px-2 sm:px-3 py-1 sm:py-2"
                  onClick={onFilterClick}
                >
                  <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Filter</span>
                  {filterCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 px-1.5 sm:px-2 py-0.5 text-xs rounded-full bg-[#062a4d] text-white"
                    >
                      {filterCount}
                    </Badge>
                  )}
                </Button>
              )}

              {/* User Button */}
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-7 h-7 sm:w-8 sm:h-8 ring-2 ring-border hover:ring-[#062a4d]/30 transition-all duration-200 hover:scale-105"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <nav className="bg-background/95 backdrop-blur-md border-b border-border shadow-sm w-full sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-all duration-200 hover:scale-105">
            <div className="relative">
              <Image 
                src="/taskify.png" 
                alt="Taskify Logo" 
                width={36} 
                height={36} 
                className="sm:w-10 sm:h-10 drop-shadow-sm"
              />
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-[#062a4d] dark:text-foreground">
              Taskify
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-3 lg:gap-4">
            {isSignedIn ? (
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="hidden md:block text-right">
                  <span className="text-xs lg:text-sm text-muted-foreground block">
                    Welcome
                  </span>
                  <span className="text-sm lg:text-base font-medium text-foreground">
                    {user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress}
                  </span>
                </div>
                <Link href="/dashboard">
                  <Button 
                    size="sm" 
                    className="bg-[#062a4d] hover:bg-[#062a4d]/90 text-white cursor-pointer flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 text-sm lg:text-base px-3 lg:px-4"
                  >
                    Dashboard <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 lg:gap-3">
                <SignInButton>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-sm lg:text-base cursor-pointer hover:bg-muted transition-all duration-200 px-3 lg:px-4"
                  >
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button 
                    size="sm" 
                    className="text-sm lg:text-base bg-[#062a4d] hover:bg-[#062a4d]/90 text-white cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 px-3 lg:px-4"
                  >
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-muted transition-all duration-200"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-4 pb-4 border-t border-border pt-4 animate-in slide-in-from-top-2 duration-300 bg-background/95 backdrop-blur-sm rounded-lg">
            {isSignedIn ? (
              <div className="flex flex-col gap-3 p-3">
                <div className="text-center pb-2 border-b border-border">
                  <span className="text-xs text-muted-foreground block">
                    Welcome back
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress}
                  </span>
                </div>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button 
                    size="sm" 
                    className="w-full bg-[#062a4d] hover:bg-[#062a4d]/90 text-white flex items-center justify-center gap-2 transition-all duration-200"
                  >
                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3 p-3">
                <SignInButton>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="w-full text-sm hover:bg-muted transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button 
                    size="sm" 
                    className="w-full text-sm bg-[#062a4d] hover:bg-[#062a4d]/90 text-white transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
