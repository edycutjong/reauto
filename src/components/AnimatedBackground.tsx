"use client";

import { motion } from "framer-motion";

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-slate-950 print:hidden">
      {/* Moving Grid */}
      <div 
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ef4444 1px, transparent 1px),
            linear-gradient(to bottom, #ef4444 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
        }}
      >
        <motion.div
          className="w-full h-[200%] absolute top-0 left-0"
          animate={{
            y: ["0%", "-50%"]
          }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 30
          }}
          style={{
            backgroundImage: `
              linear-gradient(to right, #ef4444 1px, transparent 1px),
              linear-gradient(to bottom, #ef4444 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Floating Orbs */}
      <motion.div 
        className="absolute top-[10%] left-[10%] w-[50vw] h-[50vw] bg-red-600/5 rounded-full blur-[120px]"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-[0%] right-[0%] w-[40vw] h-[40vw] bg-orange-600/5 rounded-full blur-[100px]"
        animate={{
          x: [0, -80, 0],
          y: [0, -100, 0],
          scale: [1, 1.3, 1]
        }}
        transition={{ repeat: Infinity, duration: 20, ease: "easeInOut", delay: 2 }}
      />
      <motion.div 
        className="absolute top-[30%] right-[20%] w-[30vw] h-[30vw] bg-rose-600/5 rounded-full blur-[90px]"
        animate={{
          x: [0, 50, 0],
          y: [0, -50, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ repeat: Infinity, duration: 15, ease: "easeInOut", delay: 4 }}
      />
    </div>
  );
};
