"use client";

import Navbar from "@/components/Navbar";
import { SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function HomePage() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold leading-tight mb-4"
        >
          Organize Your Work with <span className="text-amber-500">Taskify</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-600 max-w-2xl mb-6"
        >
          Taskify helps you manage tasks effortlessly. Create boards, track progress, and collaborate — all in one simple tool.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {isSignedIn ? (
            <a
              href="/dashboard"
              className="px-6 py-3 bg-green-500 text-white text-lg rounded-lg shadow-lg hover:bg-green-600 transition"
            >
              Go to Dashboard
            </a>
          ) : (
            <SignUpButton mode="modal">
              <button className="px-6 py-3 bg-amber-500 text-white text-lg rounded-lg shadow-lg hover:bg-amber-600 transition">
                Get Started for Free
              </button>
            </SignUpButton>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-500 border-t border-gray-200">
        © {new Date().getFullYear()} Taskify. All rights reserved.
      </footer>
    </div>
  );
}
