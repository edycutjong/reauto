"use client";

import Link from "next/link";
import { motion, type Easing } from "framer-motion";
import { AnimatedBackground } from "@/components/AnimatedBackground";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as Easing } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-red-500/30 overflow-hidden relative">
      <AnimatedBackground />

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-2xl mx-auto space-y-8"
        >
          <motion.div variants={fadeUp} className="space-y-4">
            <h1 className="text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-red-500 via-orange-500 to-amber-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.3)] glitch-effect" data-text="404">
              404
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 font-light">
              Exploit Trace Not Found.
            </p>
            <p className="text-slate-500 max-w-md mx-auto">
              The forensic data you are looking for does not exist on this chain, or the target has been obscured.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="pt-8">
            <Link
              href="/"
              className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-full border border-white/10 transition-all hover:scale-105 active:scale-95 group"
            >
              <span>Return to Dashboard</span>
              <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
