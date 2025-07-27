// components/Navbar.tsx
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
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
