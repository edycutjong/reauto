"use client";

import { StatusBar } from "@/components/StatusBar";
import { Footer } from "@/components/Footer";

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

export default function Home() {
  const [view, setView] = useState<'gallery' | 'trace' | 'report'>('gallery');
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

  return (
    <>
      <StatusBar />
    <main className="min-h-screen flex flex-col bg-slate-950 text-slate-300">
      <header className="border-b border-red-500/30 bg-slate-900/80 p-4 px-8 flex justify-between items-center backdrop-blur shadow-[0_0_20px_rgba(239,68,68,0.1)]">
        <div className="font-mono text-red-500 font-black tracking-widest text-xl flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          REAUTO
        </div>
        <div className="text-xs font-mono text-slate-500">POWERED BY GOLDRUSH API</div>
      </header>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          
          {view === 'gallery' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-xl backdrop-blur relative overflow-hidden">
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
                    className="flex-1 bg-slate-950 border border-slate-800 focus:border-red-500 p-4 rounded font-mono text-white outline-none"
                  />
                  <button type="submit" disabled={!txHash} className="bg-red-600 hover:bg-red-500 disabled:bg-slate-800 text-white px-8 py-4 rounded font-bold transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                    Trace Funds
                  </button>
                </form>
              </div>

              <div>
                <h2 className="text-xl text-white font-bold mb-4 font-mono">Famous Exploits Database</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {EXPLOITS.map(exploit => (
                    <button 
                      key={exploit.id}
                      onClick={() => handleTrace(exploit)}
                      className="bg-slate-900/50 border border-slate-800 hover:border-red-500/50 p-6 rounded-xl text-left transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] group"
                    >
                      <div className="text-sm font-mono text-red-500 mb-2">{exploit.amount} STOLEN</div>
                      <div className="text-xl text-white font-bold mb-4 group-hover:text-red-400 transition-colors">{exploit.name}</div>
                      <div className="flex gap-2">
                        {exploit.chains.map(chain => (
                          <span key={chain} className="bg-slate-950 border border-slate-800 px-2 py-1 text-xs font-mono rounded text-slate-400">{chain}</span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === 'trace' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <button onClick={() => setView('gallery')} className="text-slate-500 hover:text-white font-mono text-sm mb-2 flex items-center gap-2">
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
                  className="bg-red-600 hover:bg-red-500 disabled:bg-slate-800 text-white px-6 py-2 rounded font-bold transition-colors flex items-center gap-2"
                >
                  Generate Death Certificate
                </button>
              </div>

              <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl relative overflow-hidden min-h-[500px] flex items-center justify-center p-8">
                {loading ? (
                  <div className="text-center font-mono text-red-400 animate-pulse">
                    <div className="text-4xl mb-4">⟳</div>
                    <div>Aggregating cross-chain traces via GoldRush...</div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <div className="text-slate-500 font-mono text-sm mb-8 absolute top-8 left-8">CROSS-CHAIN SANKEY VISUALIZATION</div>
                    
                    {/* Simulated Sankey/Trace Graph */}
                    <div className="flex w-full max-w-4xl justify-between items-center relative">
                      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500/20 -z-10"></div>
                      
                      <div className="bg-slate-950 border-2 border-red-500 p-4 rounded-xl text-center w-48 relative shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                        <div className="text-xs font-mono text-red-400 mb-1">SOURCE TX</div>
                        <div className="text-white font-bold">{traceData?.sourceTx || "Wormhole Bridge"}</div>
                        <div className="text-xs text-slate-500 mt-2 font-mono">{traceData?.amount || "120,000 wETH"}</div>
                      </div>

                      <div className="space-y-4">
                        {traceData?.launderSteps?.map((step, i) => (
                          <div key={i} className="bg-slate-950 border border-slate-700 p-3 rounded-lg text-center w-40 relative">
                            <div className="text-xs text-slate-400 mb-1 font-mono">{step.type}</div>
                            <div className="text-white">{step.name}</div>
                          </div>
                        )) || (
                          <>
                            <div className="bg-slate-950 border border-slate-700 p-3 rounded-lg text-center w-40 relative">
                              <div className="text-xs text-slate-400 mb-1 font-mono">LAUNDERING</div>
                              <div className="text-white">Tornado Cash</div>
                            </div>
                            <div className="bg-slate-950 border border-slate-700 p-3 rounded-lg text-center w-40 relative">
                              <div className="text-xs text-slate-400 mb-1 font-mono">SWAP</div>
                              <div className="text-white">Jupiter (SOL)</div>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="space-y-8">
                        {traceData?.cashOuts?.map((out, i) => (
                          <div key={i} className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center w-48 relative">
                            <div className="text-xs font-mono text-red-400 mb-1">CASH OUT / IDLE</div>
                            <div className="text-white font-bold">{out.name}</div>
                            <div className="text-xs text-slate-500 mt-2 font-mono">{out.detail}</div>
                          </div>
                        )) || (
                          <>
                            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center w-48 relative">
                              <div className="text-xs font-mono text-red-400 mb-1">CASH OUT</div>
                              <div className="text-white font-bold">Binance Deposit</div>
                              <div className="text-xs text-slate-500 mt-2 font-mono">Wallet: 0x9a...3f</div>
                            </div>
                            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center w-48 relative">
                              <div className="text-xs font-mono text-red-400 mb-1">IDLE FUNDS</div>
                              <div className="text-white font-bold">Cold Storage</div>
                              <div className="text-xs text-slate-500 mt-2 font-mono">Wallet: 0x2b...1c</div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {view === 'report' && (
            <div className="animate-in zoom-in-95 duration-500 max-w-3xl mx-auto">
              <button onClick={() => setView('trace')} className="text-slate-500 hover:text-white font-mono text-sm mb-6 flex items-center gap-2">
                ← Back to Trace
              </button>
              
              <div className="bg-slate-900 border-2 border-red-500/30 p-10 rounded-xl relative overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.1)]">
                <div className="absolute top-0 right-0 p-8 text-6xl opacity-10">☠️</div>
                <div className="text-red-500 font-mono font-bold tracking-widest text-sm mb-2">OFFICIAL AUTOPSY</div>
                <h1 className="text-4xl text-white font-black mb-8">{activeExploit?.name}</h1>

                <div className="grid grid-cols-2 gap-6 mb-8 font-mono text-sm">
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg">
                    <div className="text-slate-500 mb-1">Total Loss</div>
                    <div className="text-2xl text-red-500 font-bold">{activeExploit?.amount}</div>
                  </div>
                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg">
                      <div className="text-slate-500 mb-1">Attack Vector</div>
                      <div className="text-xl text-white font-bold">{reportData?.vector || "Signature Forgery"}</div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-white font-bold mb-2 font-mono">EXECUTIVE SUMMARY</h3>
                      <p className="text-slate-400 leading-relaxed text-sm">
                        {reportData?.summary || "The attacker bypassed signature verification on the Wormhole bridge by injecting a forged sysvar account. This allowed the malicious contract to mint 120,000 wrapped ETH on Solana out of thin air. The funds were immediately bridged back to Ethereum mainnet."}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-white font-bold mb-4 font-mono">LAUNDERING TIMELINE</h3>
                      <div className="space-y-4 border-l-2 border-slate-800 ml-2 pl-4 text-sm">
                        {reportData?.timeline?.map((item, i) => (
                          <div key={i} className="relative">
                            <div className={`absolute w-3 h-3 rounded-full left-[-23px] top-1 ${i === 0 ? 'bg-red-500' : 'bg-slate-700'}`}></div>
                            <div className={`font-mono mb-1 ${i === 0 ? 'text-red-400' : 'text-slate-500'}`}>{item.time}</div>
                            <div className="text-slate-300">{item.description}</div>
                          </div>
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
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-800 flex justify-between items-center">
                  <div className="text-xs font-mono text-slate-500">GENERATED BY REAUTO AI</div>
                  <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded text-sm font-bold transition-colors">
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
      <Footer />
    </>
  );
}
