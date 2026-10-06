import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Layers, ShieldAlert } from 'lucide-react';

interface StackVisualizerProps {
  stackSnapshot: string[];
  actionType: string;
  maxStackSize?: number;
  totalPushes?: number;
  totalPops?: number;
}

export const StackVisualizer: React.FC<StackVisualizerProps> = ({
  stackSnapshot,
  actionType,
  maxStackSize = 0,
  totalPushes = 0,
  totalPops = 0,
}) => {
  // Elements ordered from top to bottom for display (index 0 is top)
  const reversedStack = [...stackSnapshot].reverse();
  const isPush = actionType.includes('push');
  const isPop = actionType.includes('pop');

  return (
    <div className="flex flex-col h-full bg-slate-900/50 dark:bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-100">Operator Stack</h3>
            <p className="text-[11px] text-slate-400">Strict LIFO Storage Container</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
            Depth: <strong className="text-indigo-400">{stackSnapshot.length}</strong>
          </span>
        </div>
      </div>

      {/* Stack Beaker Visualization Area */}
      <div className="relative flex-1 min-h-[260px] flex flex-col justify-end items-center my-4 p-4 border-2 border-dashed border-slate-800 rounded-xl bg-slate-950/60 overflow-hidden">
        {/* Background depth grid lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#312e81_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

        {stackSnapshot.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <ShieldAlert className="w-8 h-8 mb-2 opacity-40 text-slate-400" />
            <p className="text-xs font-medium">Stack is currently empty</p>
            <p className="text-[10px] text-slate-600 mt-0.5">Ready to receive operators / parentheses</p>
          </div>
        ) : (
          <div className="w-full max-w-[220px] flex flex-col justify-end gap-2 z-10">
            <AnimatePresence initial={false}>
              {reversedStack.map((item, index) => {
                const isTop = index === 0;
                return (
                  <motion.div
                    key={`${item}-${reversedStack.length - index}`}
                    initial={{ opacity: 0, y: -24, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                    className={`relative flex items-center justify-between px-4 py-2.5 rounded-xl font-mono text-base font-bold shadow-md transition-all ${
                      isTop
                        ? isPush
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white ring-2 ring-emerald-400/50 shadow-emerald-500/20'
                          : isPop
                          ? 'bg-gradient-to-r from-rose-600 to-pink-500 text-white ring-2 ring-rose-400/50'
                          : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white ring-2 ring-indigo-400/50 shadow-indigo-500/20'
                        : 'bg-slate-800/90 text-slate-200 border border-slate-700/60'
                    }`}
                  >
                    <span className="text-xs text-slate-400 font-sans font-medium">
                      Idx {reversedStack.length - 1 - index}
                    </span>

                    <span className="text-xl tracking-wider">{item}</span>

                    {isTop ? (
                      <span className="flex items-center gap-1 text-[10px] font-sans font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-black/30">
                        TOP <ArrowLeft className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="w-10" />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Base of beaker */}
            <div className="w-full h-2.5 bg-slate-800 rounded-b-md border-t border-slate-700/80 mt-1 flex items-center justify-center">
              <div className="w-12 h-1 bg-slate-600 rounded-full" />
            </div>
          </div>
        )}
      </div>

      {/* Stack Telemetry Metrics */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
        <div className="bg-slate-950/40 rounded-lg p-2 text-center border border-slate-800/60">
          <div className="text-[10px] text-slate-400">Peak Depth</div>
          <div className="text-sm font-bold font-mono text-indigo-400">{maxStackSize}</div>
        </div>
        <div className="bg-slate-950/40 rounded-lg p-2 text-center border border-slate-800/60">
          <div className="text-[10px] text-slate-400">Pushes</div>
          <div className="text-sm font-bold font-mono text-emerald-400">{totalPushes}</div>
        </div>
        <div className="bg-slate-950/40 rounded-lg p-2 text-center border border-slate-800/60">
          <div className="text-[10px] text-slate-400">Pops</div>
          <div className="text-sm font-bold font-mono text-rose-400">{totalPops}</div>
        </div>
      </div>
    </div>
  );
};
