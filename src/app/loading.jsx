"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex min-h-screen flex-col items-center justify-center bg-gray-50/80 backdrop-blur-md dark:bg-gray-950/80">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Icon Container */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-2xl shadow-indigo-500/20"
        >
          {/* Inner frosted glass effect */}
          <div className="absolute inset-[2px] rounded-[1.4rem] bg-gray-50/90 dark:bg-gray-950/90 flex items-center justify-center backdrop-blur-xl">
            <BookOpen className="h-10 w-10 text-indigo-500 dark:text-indigo-400" strokeWidth={1.5} />
          </div>
          
          {/* Outer rotating rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-2 rounded-[2rem] border border-indigo-500/30 dark:border-indigo-400/20"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 rounded-[2.5rem] border border-purple-500/20 dark:border-purple-400/10 border-dashed"
          />
        </motion.div>
        
        {/* Text and dots */}
        <div className="flex flex-col items-center gap-2">
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500"
          >
            Loading Wisdom
          </motion.h3>
          
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -5, 0],
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
                className="h-2 w-2 rounded-full bg-indigo-500 dark:bg-indigo-400"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
