"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";

interface Props {
  boardTitle?: string;
  onEditBoard?: () => void;

}

export default function Navbar({boardTitle, onEditBoard}: Props) {
  const { isSignedIn, user } = useUser();
  const pathname = usePathname()

  const isDashboardPage = pathname === "/dashboard"
  const isBoardPage = pathname.startsWith("/boards/")

  if(isDashboardPage) {
    return(
       <nav className="bg-white shadow-sm w-full">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Logo & Title */}
        <div className="flex items-center">
          <Image src="/taskify.png" alt="Taskify Logo" width={40} height={40} />
          <span className="text-xl sm:text-2xl font-bold text-[#062a4d]">Taskify</span>
        </div>
        {/* Right-side */}
        <div className="flex items-center space-x-3">
         <UserButton/>
        </div>
      </div>
    </nav>
    )
  }

    if(isBoardPage) {
    return (
          <header className="w-full border-b border-gray-200 bg-white dark:bg-gray-950 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      {/* Left section: Back + Divider + Logo + Title */}
      <div className="flex items-center space-x-4">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="flex items-center space-x-1 text-sm text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to dashboard</span>
        </Link>

        {/* Divider */}
        <div className="h-4 sm:h-6 w-px bg-gray-300" />

        {/* Logo + Board Title */}
        <div className="flex items-center space-x-3">
          <Image src="/taskify.png" alt="Taskify Logo" width={36} height={36} />
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-lg text-gray-900 dark:text-white">
              {boardTitle}
            </span>
            {onEditBoard && (
              <Button
                variant="ghost"
                size="sm"
                className="p-1"
                onClick={onEditBoard}
              >
                <MoreHorizontal className="w-4 h-4 text-gray-500 hover:text-black transition" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  </header>
    )
    }

  return (
    <nav className="bg-white shadow-sm w-full">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Logo & Title */}
        <div className="flex items-center">
          <Image src="/taskify.png" alt="Taskify Logo" width={40} height={40} />
          <span className="text-xl sm:text-2xl font-bold text-[#062a4d]">Taskify</span>
        </div>
        {/* Right-side */}
        <div className="flex items-center space-x-3">
          {isSignedIn ? (
            <>
              <span className="hidden sm:inline text-sm text-gray-600">
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
  );
}
