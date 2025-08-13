import Navbar from "@/components/Navbar";
import { PricingTable } from "@clerk/nextjs";

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex flex-col items-center px-6 py-12">
        {/* Header */}
        <div className="text-center max-w-2xl mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-[#062a4d] dark:text-white">
            Choose Your Plan
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Select the perfect plan for your needs and unlock premium features.
          </p>
        </div>

        {/* Pricing Table */}
        <div className="w-full max-w-4xl">
          <PricingTable newSubscriptionRedirectUrl="/dashboard" />
        </div>
      </main>
    </div>
  );
}
