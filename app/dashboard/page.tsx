"use client"

import Navbar from "@/components/Navbar";
import { useUser } from "@clerk/nextjs";

export default function Dashboard() {
  const { user } = useUser();

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
        </div>
      </main>
    </div>
  );
}

