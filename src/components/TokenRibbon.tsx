import React from 'react';
import { Eye } from 'lucide-react';
import type { Token } from '../types';

interface TokenRibbonProps {
  tokens: Token[];
  currentStepIndex?: number;
  currentTokenValue?: string;
}

export const TokenRibbon: React.FC<TokenRibbonProps> = ({
  tokens,
  currentTokenValue,
}) => {
  return (
    <div className="bg-slate-900/50 dark:bg-slate-900/80 rounded-2xl border border-slate-800 p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Eye className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-200">Reversed Token Stream</h4>
            <p className="text-[10px] text-slate-400">Tokens being scanned left-to-right</p>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          Total Tokens: <span className="text-slate-200 font-bold">{tokens.length}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto py-2 px-1 scrollbar-thin scrollbar-thumb-slate-700">
        {tokens.map((tok, idx) => {
          const isCurrent = tok.value === currentTokenValue;
          const isOperator = tok.type === 'OPERATOR';
          const isParen = tok.type === 'LEFT_PAREN' || tok.type === 'RIGHT_PAREN';

          return (
            <div
              key={`${tok.value}-${idx}`}
              className={`flex-shrink-0 flex flex-col items-center gap-1 transition-all duration-200 ${
                isCurrent
                  ? 'scale-110 z-10'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div
                className={`min-w-[42px] px-3 py-2 rounded-xl text-center font-mono text-sm font-bold shadow-md border transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-b from-indigo-500 to-indigo-700 text-white border-indigo-400 ring-4 ring-indigo-500/30 shadow-indigo-500/30'
                    : isOperator
                    ? 'bg-slate-800 text-amber-300 border-amber-500/30'
                    : isParen
                    ? 'bg-slate-800 text-purple-300 border-purple-500/30'
                    : 'bg-slate-800 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {tok.value}
              </div>

              <span className="text-[9px] font-mono text-slate-400">
                #{idx}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
