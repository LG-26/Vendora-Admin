"use client";

import { useState } from "react";
import AnimatedBackground from "@/components/AnimatedBackground";
import LoginModal from "@/components/LoginModal";

export default function HomePage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 drop-shadow-lg animate-fadeIn">
          VENDORA
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-700 mb-4 font-semibold animate-fadeIn" style={{ animationDelay: "0.2s" }}>
          E-commerce Admin Dashboard
        </p>

        <p className="max-w-2xl text-base md:text-lg text-gray-600 mb-12 leading-relaxed animate-fadeIn" style={{ animationDelay: "0.4s" }}>
          Manage products, inventory, analytics and sales through a modern,
          secure, server-rendered admin platform built with Next.js.
        </p>

        <button
          onClick={() => setIsLoginOpen(true)}
          className="px-10 md:px-12 py-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-base md:text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 animate-fadeIn"
          style={{ animationDelay: "0.6s" }}
        >
          Admin Login
        </button>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}
