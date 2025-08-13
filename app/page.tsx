"use client";

import Navbar from "@/components/Navbar";
import { SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { CheckCircle, Users, Zap } from "lucide-react";

export default function HomePage() {
  const { isSignedIn } = useUser();

  const features = [
    {
      icon: CheckCircle,
      title: "Task Management",
      description: "Create, organize, and track tasks with intuitive boards"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together seamlessly with your team members"
    },
    {
      icon: Zap,
      title: "Boost Productivity",
      description: "Streamline workflows and achieve more in less time"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl font-bold leading-tight mb-6"
            >
              Organize Your Work with{" "}
              <span className="text-[#062a4d] dark:text-primary">Taskify</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              The simple yet powerful task management tool that helps teams stay organized, 
              focused, and productive.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {isSignedIn ? (
                <a
                  href="/dashboard"
                  className="inline-flex items-center px-8 py-4 bg-[#062a4d] dark:bg-primary text-white dark:text-primary-foreground text-lg font-semibold rounded-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Go to Dashboard
                </a>
              ) : (
                <SignUpButton mode="modal">
                  <button className="inline-flex items-center px-8 py-4 bg-[#062a4d] dark:bg-primary text-white dark:text-primary-foreground text-lg font-semibold rounded-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                    Get Started for Free
                  </button>
                </SignUpButton>
              )}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-muted/20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything you need to stay productive
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Simple tools that make a big difference in how you manage tasks and collaborate with your team.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center p-8 rounded-xl bg-card border border-border hover:shadow-lg transition-all duration-300"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#062a4d]/10 dark:bg-primary/10 mb-6">
                    <feature.icon className="w-8 h-8 text-[#062a4d] dark:text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to get organized?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of teams already using Taskify to streamline their workflow.
            </p>
            {!isSignedIn && (
              <SignUpButton mode="modal">
                <button className="inline-flex items-center px-8 py-4 bg-[#062a4d] dark:bg-primary text-white dark:text-primary-foreground text-lg font-semibold rounded-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                  Start Free Today
                </button>
              </SignUpButton>
            )}
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-border bg-muted/20">
        <div className="max-w-6xl mx-auto py-8 px-6 text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Taskify. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
