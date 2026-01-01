import Link from "next/link";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 drop-shadow-lg">
          VENDORA
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-700 mb-4 font-semibold">
          E-commerce Admin Dashboard
        </p>

        <p className="max-w-2xl text-base md:text-lg text-gray-600 mb-12 leading-relaxed">
          Manage products, inventory, analytics and sales through a modern,
          secure, server-rendered admin platform built with Next.js.
        </p>

        <Link
          href="/login"
          className="px-10 md:px-12 py-4 rounded-full bg-linear-to-r from-purple-600 to-indigo-600 text-white text-base md:text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
        >
          Admin Login
        </Link>
      </div>
    </div>
  );
}
