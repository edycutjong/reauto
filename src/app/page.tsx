"use client";

import { AnimatedBackground } from "@/components/AnimatedBackground";
import { StatusBar } from "@/components/StatusBar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence, type Easing } from "framer-motion";

import React, { useState } from 'react';
import { covalentGoldRushService, ExploitTrace, AutopsyReport } from '@/lib/covalent';

interface Exploit {
  id: string;
  name: string;
  amount: string;
  chains: string[];
}

const EXPLOITS = [
  { id: 'wormhole', name: 'Wormhole Exploit', amount: '$320M', chains: ['Solana', 'Ethereum', 'BSC'] },
  { id: 'ronin', name: 'Ronin Bridge', amount: '$625M', chains: ['Ronin', 'Ethereum'] },
  { id: 'euler', name: 'Euler Finance', amount: '$197M', chains: ['Ethereum'] },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as Easing } },
};

export default function Home() {
  const [view, setView] = useState<'landing' | 'gallery' | 'trace' | 'report'>('landing');
  const [txHash, setTxHash] = useState('');
  const [activeExploit, setActiveExploit] = useState<Exploit | null>(null);
  const [loading, setLoading] = useState(false);

  const [traceData, setTraceData] = useState<ExploitTrace | null>(null);
  const [reportData, setReportData] = useState<AutopsyReport | null>(null);

  const handleTrace = async (exploit: Exploit = { id: '', name: 'Custom Analysis', amount: 'Unknown', chains: ['Multi'] }) => {
    setActiveExploit(exploit);
    setLoading(true);
    setView('trace');
    const data = await covalentGoldRushService.traceExploit(txHash || "0x_pending_hash");
    setTraceData(data);
    setLoading(false);
  };

  const handleReport = async () => {
    const data = await covalentGoldRushService.generateAutopsyReport(activeExploit?.id || "custom");
    setReportData(data);
    setView('report');
  };

  const handleDemoToJudge = () => {
    const demoExploit = EXPLOITS[0];
    setTxHash('0x40dfec226a7605d8bca800d07db27d885a0827282b');
    handleTrace(demoExploit);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <AnimatedBackground />
      <div className="scan-line noise-overlay relative z-10">
      <StatusBar />
    <main className="min-h-screen flex flex-col text-slate-300 relative">
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="border-b border-red-500/30 bg-slate-900/60 p-4 px-8 flex justify-between items-center backdrop-blur-xl shadow-[0_0_30px_rgba(239,68,68,0.1)] print:hidden sticky top-0 z-50"
      >
        <button onClick={() => setView('landing')} className="font-mono text-red-500 hover:text-red-400 font-black tracking-widest text-xl flex items-center gap-2 transition-colors glitch-text">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          REAUTO
        </button>
        <div className="text-xs font-mono text-slate-500 status-flash">POWERED BY GOLDRUSH API</div>
      </motion.header>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          
          <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div
              key="landing"
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
              variants={stagger}
              className="flex flex-col items-center justify-center min-h-[70vh] text-center"
            >
              <motion.div variants={fadeUp} className="relative mb-8">
                <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full animate-pulse"></div>
                <div className="w-24 h-24 bg-slate-900 border-2 border-red-500/50 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.3)] flex items-center justify-center relative z-10 mx-auto glow-pulse">
                  <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                </div>
              </motion.div>
              
              <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl text-white font-black mb-6 tracking-tight">
                AI-Powered <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 via-orange-500 to-red-500 bg-size-[200%_auto] animate-[gradient-shift_3s_ease-in-out_infinite]">Exploit Forensics</span>
              </motion.h1>
              
              <motion.p variants={fadeUp} className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
                Trace stolen funds across multiple chains instantly. Visualize attack vectors and generate comprehensive AI death certificates using the GoldRush API.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <button 
                  onClick={() => setView('gallery')}
                  className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_40px_rgba(239,68,68,0.7)] hover:scale-105 active:scale-95 w-full sm:w-auto"
                >
                  Launch App
                </button>
                <button 
                  onClick={handleDemoToJudge}
                  className="bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-red-500/50 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 w-full sm:w-auto hover:scale-105 active:scale-95 backdrop-blur"
                >
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Demo for Judges
                </button>
              </motion.div>

              {/* Floating tech badges */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mt-16 justify-center">
                {['Next.js 16', 'React 19', 'GoldRush API', 'Tailwind v4', 'Framer Motion'].map((tech, i) => (
                  <span key={tech} className="text-xs font-mono px-3 py-1.5 rounded-full border border-slate-800 bg-slate-900/50 text-slate-500 hover:text-red-400 hover:border-red-500/30 transition-all cursor-default" style={{ animationDelay: `${i * 0.1}s` }}>
                    {tech}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          )}

          {view === 'gallery' && (
            <motion.div
              key="gallery"
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
              variants={stagger}
              className="space-y-8"
            >
              <motion.div variants={fadeUp} className="bg-slate-900/60 border border-slate-800 p-8 rounded-xl backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl"></div>
                <h1 className="text-3xl text-white font-bold mb-4 relative z-10">Cross-Chain Exploit Forensics</h1>
                <p className="text-slate-400 max-w-2xl relative z-10 mb-6">
                  Paste a transaction hash to instantly trace stolen funds across multiple chains, visualized through a unified GoldRush graph, and summarize the attack via an AI Death Certificate.
                </p>
                
                <form onSubmit={(e) => { e.preventDefault(); handleTrace(); }} className="flex gap-4 relative z-10">
                  <input 
                    type="text" 
                    placeholder="Enter suspicious TX Hash (e.g. 0x...)" 
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    className="flex-1 bg-slate-950/80 border border-slate-800 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.15)] p-4 rounded font-mono text-white outline-none transition-all backdrop-blur"
                  />
                  <button type="submit" disabled={!txHash} className="bg-red-600 hover:bg-red-500 disabled:bg-slate-800 disabled:opacity-50 text-white px-8 py-4 rounded font-bold transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] hover:scale-105 active:scale-95">
                    Trace Funds
                  </button>
                </form>
              </motion.div>

              <motion.div variants={fadeUp}>
                <h2 className="text-xl text-white font-bold mb-4 font-mono">Famous Exploits Database</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {EXPLOITS.map((exploit, i) => (
                    <motion.button
                      key={exploit.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                      onClick={() => handleTrace(exploit)}
                      className="bg-slate-900/50 border border-slate-800 hover:border-red-500/50 p-6 rounded-xl text-left transition-all hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] group threat-pulse backdrop-blur hover:scale-[1.03] active:scale-[0.98]"
                    >
                      <div className="text-sm font-mono text-red-500 mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                        {exploit.amount} STOLEN
                      </div>
                      <div className="text-xl text-white font-bold mb-4 group-hover:text-red-400 transition-colors">{exploit.name}</div>
                      <div className="flex gap-2">
                        {exploit.chains.map(chain => (
                          <span key={chain} className="bg-slate-950 border border-slate-800 px-2 py-1 text-xs font-mono rounded text-slate-400">{chain}</span>
                        ))}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {view === 'trace' && (
            <motion.div
              key="trace"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40, transition: { duration: 0.3 } }}
              transition={{ duration: 0.5 }}
              className="h-full flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <button onClick={() => setView('gallery')} className="text-slate-500 hover:text-white font-mono text-sm mb-2 flex items-center gap-2 transition-colors">
                    ← Back to Gallery
                  </button>
                  <h1 className="text-2xl text-white font-bold flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                    Tracing: {activeExploit?.name}
                  </h1>
                </div>
                <button 
                  onClick={handleReport}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-500 disabled:bg-slate-800 text-white px-6 py-2 rounded font-bold transition-all flex items-center gap-2 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:scale-105 active:scale-95"
                >
                  Generate Death Certificate
                </button>
              </div>

              <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl relative overflow-hidden min-h-[500px] flex items-center justify-center p-8 backdrop-blur-xl">
                {loading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center font-mono text-red-400"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      className="text-4xl mb-4 inline-block"
                    >⟳</motion.div>
                    <div className="animate-pulse">Aggregating cross-chain traces via GoldRush...</div>
                  </motion.div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <div className="text-slate-500 font-mono text-sm mb-8 absolute top-8 left-8">CROSS-CHAIN SANKEY VISUALIZATION</div>
                    
                    <div className="flex w-full max-w-4xl justify-between items-center relative">
                      <div className="absolute top-1/2 left-0 w-full h-0.5 -z-10 data-flow-line"></div>
                      
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-950 border-2 border-red-500 p-4 rounded-xl text-center w-48 relative shadow-[0_0_20px_rgba(239,68,68,0.3)] glow-pulse"
                      >
                        <div className="text-xs font-mono text-red-400 mb-1">SOURCE TX</div>
                        <div className="text-white font-bold">{traceData?.sourceTx || "Wormhole Bridge"}</div>
                        <div className="text-xs text-slate-500 mt-2 font-mono">{traceData?.amount || "120,000 wETH"}</div>
                      </motion.div>

                      <div className="space-y-4">
                        {traceData?.launderSteps?.map((step, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.15 }}
                            className="bg-slate-950 border border-slate-700 p-3 rounded-lg text-center w-40 relative hover:border-red-500/40 transition-colors"
                          >
                            <div className="text-xs text-slate-400 mb-1 font-mono">{step.type}</div>
                            <div className="text-white">{step.name}</div>
                          </motion.div>
                        )) || (
                          <>
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-slate-950 border border-slate-700 p-3 rounded-lg text-center w-40 relative">
                              <div className="text-xs text-slate-400 mb-1 font-mono">LAUNDERING</div>
                              <div className="text-white">Tornado Cash</div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="bg-slate-950 border border-slate-700 p-3 rounded-lg text-center w-40 relative">
                              <div className="text-xs text-slate-400 mb-1 font-mono">SWAP</div>
                              <div className="text-white">Jupiter (SOL)</div>
                            </motion.div>
                          </>
                        )}
                      </div>

                      <div className="space-y-8">
                        {traceData?.cashOuts?.map((out, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + i * 0.15 }}
                            className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center w-48 relative"
                          >
                            <div className="text-xs font-mono text-red-400 mb-1">CASH OUT / IDLE</div>
                            <div className="text-white font-bold">{out.name}</div>
                            <div className="text-xs text-slate-500 mt-2 font-mono">{out.detail}</div>
                          </motion.div>
                        )) || (
                          <>
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center w-48 relative">
                              <div className="text-xs font-mono text-red-400 mb-1">CASH OUT</div>
                              <div className="text-white font-bold">Binance Deposit</div>
                              <div className="text-xs text-slate-500 mt-2 font-mono">Wallet: 0x9a...3f</div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.65 }} className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center w-48 relative">
                              <div className="text-xs font-mono text-red-400 mb-1">IDLE FUNDS</div>
                              <div className="text-white font-bold">Cold Storage</div>
                              <div className="text-xs text-slate-500 mt-2 font-mono">Wallet: 0x2b...1c</div>
                            </motion.div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {view === 'report' && (
            <motion.div
              key="report"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              <button onClick={() => setView('trace')} className="text-slate-500 hover:text-white font-mono text-sm mb-6 flex items-center gap-2 print:hidden transition-colors">
                ← Back to Trace
              </button>
              
              <div className="bg-slate-900/60 border-2 border-red-500/30 p-10 rounded-xl relative overflow-hidden shadow-[0_0_60px_rgba(239,68,68,0.1)] backdrop-blur-xl">
                <div className="absolute top-0 right-0 p-8 text-6xl opacity-10">☠️</div>
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-red-500 font-mono font-bold tracking-widest text-sm mb-2">OFFICIAL AUTOPSY</motion.div>
                <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl text-white font-black mb-8">{activeExploit?.name}</motion.h1>

                <div className="grid grid-cols-2 gap-6 mb-8 font-mono text-sm">
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-slate-950/80 border border-slate-800 p-4 rounded-lg">
                    <div className="text-slate-500 mb-1">Total Loss</div>
                    <div className="text-2xl text-red-500 font-bold">{activeExploit?.amount}</div>
                  </motion.div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-slate-950/80 border border-slate-800 p-4 rounded-lg">
                      <div className="text-slate-500 mb-1">Attack Vector</div>
                      <div className="text-xl text-white font-bold">{reportData?.vector || "Signature Forgery"}</div>
                    </motion.div>
                  </div>

                  <div className="space-y-6">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                      <h3 className="text-white font-bold mb-2 font-mono">EXECUTIVE SUMMARY</h3>
                      <p className="text-slate-400 leading-relaxed text-sm">
                        {reportData?.summary || "The attacker bypassed signature verification on the Wormhole bridge by injecting a forged sysvar account. This allowed the malicious contract to mint 120,000 wrapped ETH on Solana out of thin air. The funds were immediately bridged back to Ethereum mainnet."}
                      </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                      <h3 className="text-white font-bold mb-4 font-mono">LAUNDERING TIMELINE</h3>
                      <div className="space-y-4 border-l-2 border-slate-800 ml-2 pl-4 text-sm">
                        {reportData?.timeline?.map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + i * 0.1 }}
                            className="relative"
                          >
                            <div className={`absolute w-3 h-3 rounded-full left-[-23px] top-1 ${i === 0 ? 'bg-red-500' : 'bg-slate-700'}`}></div>
                            <div className={`font-mono mb-1 ${i === 0 ? 'text-red-400' : 'text-slate-500'}`}>{item.time}</div>
                            <div className="text-slate-300">{item.description}</div>
                          </motion.div>
                        )) || (
                          <>
                            <div className="relative">
                              <div className="absolute w-3 h-3 bg-red-500 rounded-full left-[-23px] top-1"></div>
                              <div className="text-red-400 font-mono mb-1">T+00:00</div>
                              <div className="text-slate-300">Exploit executed on Solana. 120k wETH minted.</div>
                            </div>
                            <div className="relative">
                              <div className="absolute w-3 h-3 bg-slate-700 rounded-full left-[-23px] top-1"></div>
                              <div className="text-slate-500 font-mono mb-1">T+00:23</div>
                              <div className="text-slate-300">Funds bridged to Ethereum mainnet.</div>
                            </div>
                            <div className="relative">
                              <div className="absolute w-3 h-3 bg-slate-700 rounded-full left-[-23px] top-1"></div>
                              <div className="text-slate-500 font-mono mb-1">T+02:45</div>
                              <div className="text-slate-300">30,000 ETH deposited into Tornado Cash in 100 ETH increments.</div>
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-800 flex justify-between items-center print:hidden">
                  <div className="text-xs font-mono text-slate-500">GENERATED BY REAUTO AI</div>
                  <button onClick={handlePrint} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded text-sm font-bold transition-all hover:scale-105 active:scale-95">
                    Download PDF
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          </AnimatePresence>

        </div>
      </div>
    </main>
      <Footer />
      </div>
    </>
  );
}
