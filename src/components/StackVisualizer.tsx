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
    <div className="flex flex-col h-full bg-[#111318] rounded-lg border border-[#27272A] p-5 shadow-xl text-[#F8FAFC]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-[#6366F1]/15 text-[#C0C1FF] flex items-center justify-center border border-[#6366F1]/30">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[#F8FAFC]">Operator Stack</h3>
            <p className="text-[10px] text-[#71717A] font-mono">LIFO RECURSIVE FRAMES &bull; TOP POINTER</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded bg-[#18181B] text-[#71717A] font-mono border border-[#27272A]">
            DEPTH: <strong className="text-[#06B6D4]">{stackSnapshot.length}</strong>
          </span>
        </div>
      </div>

      {/* Stack Open Beaker Visualization Area */}
      <div className="relative flex-1 min-h-[260px] flex flex-col justify-end items-center my-4 p-4 border-x border-b border-[#27272A] rounded-b bg-[#09090B] overflow-hidden">
        {/* Background depth grid lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        {stackSnapshot.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-6 text-[#71717A]">
            <ShieldAlert className="w-8 h-8 mb-2 opacity-40 text-[#71717A]" />
            <p className="text-xs font-mono font-medium">STACK_IS_EMPTY</p>
            <p className="text-[10px] text-[#71717A] mt-0.5">Ready for operators & parentheses</p>
          </div>
        ) : (
          <div className="w-full max-w-[240px] flex flex-col justify-end gap-1.5 z-10">
            <AnimatePresence initial={false}>
              {reversedStack.map((item, index) => {
                const isTop = index === 0;
                return (
                  <motion.div
                    key={`${item}-${reversedStack.length - index}`}
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -16, scale: 0.9 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className={`relative flex items-center justify-between px-3.5 py-2 rounded font-mono text-sm font-bold shadow-md transition-all ${
                      isTop
                        ? isPush
                          ? 'bg-[#10B981]/20 text-[#6EE7B7] border border-[#10B981] shadow-[0_0_12px_rgba(16,185,129,0.3)] ring-1 ring-[#10B981]/40'
                          : isPop
                          ? 'bg-[#EF4444]/20 text-[#FCA5A5] border border-[#EF4444] shadow-[0_0_12px_rgba(239,68,68,0.3)] ring-1 ring-[#EF4444]/40'
                          : 'bg-[#6366F1]/20 text-[#C0C1FF] border border-[#6366F1] shadow-[0_0_12px_rgba(99,102,241,0.25)] ring-1 ring-[#6366F1]/40'
                        : 'bg-[#18181B] text-[#F8FAFC] border border-[#27272A]'
                    }`}
                  >
                    <span className="text-[10px] text-[#71717A] font-mono">
                      [#{reversedStack.length - 1 - index}]
                    </span>

                    <span className="text-base tracking-wider">{item}</span>

                    {isTop ? (
                      <span className="flex items-center gap-1 text-[9px] font-mono font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-[#09090B] text-[#C0C1FF] border border-[#6366F1]/50">
                        TOP_OF_STACK <ArrowLeft className="w-2.5 h-2.5" />
                      </span>
                    ) : (
                      <span className="w-12" />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Base of beaker */}
            <div className="w-full h-2 bg-[#27272A] rounded-b mt-1 flex items-center justify-center">
              <div className="w-16 h-0.5 bg-[#3F3F46] rounded-full" />
            </div>
          </div>
        )}
      </div>

      {/* Stack Telemetry Metrics */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#27272A]">
        <div className="bg-[#09090B] rounded p-2 text-center border border-[#27272A]">
          <div className="text-[10px] font-mono text-[#71717A]">PEAK_DEPTH</div>
          <div className="text-sm font-bold font-mono text-[#C0C1FF]">{maxStackSize}</div>
        </div>
        <div className="bg-[#09090B] rounded p-2 text-center border border-[#27272A]">
          <div className="text-[10px] font-mono text-[#71717A]">PUSHES</div>
          <div className="text-sm font-bold font-mono text-[#10B981]">{totalPushes}</div>
        </div>
        <div className="bg-[#09090B] rounded p-2 text-center border border-[#27272A]">
          <div className="text-[10px] font-mono text-[#71717A]">POPS</div>
          <div className="text-sm font-bold font-mono text-[#EF4444]">{totalPops}</div>
        </div>
      </div>
    </div>
  );
};
