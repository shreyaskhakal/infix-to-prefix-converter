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
    <div className="bg-[#111318] rounded-lg border border-[#27272A] p-4 shadow-xl text-[#F8FAFC]">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#27272A]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#06B6D4]/15 text-[#06B6D4] flex items-center justify-center border border-[#06B6D4]/30">
            <Eye className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#F8FAFC]">Token Stream Tape</h4>
            <p className="text-[10px] text-[#71717A] font-mono">LOOKAHEAD HEAD SCANNING LEFT-TO-RIGHT</p>
          </div>
        </div>

        <div className="text-[11px] text-[#71717A] font-mono">
          TOTAL_TOKENS: <span className="text-[#06B6D4] font-bold">{tokens.length}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto py-2 px-1 scrollbar-thin">
        {tokens.map((tok, idx) => {
          const isCurrent = tok.value === currentTokenValue;
          const isOperator = tok.type === 'OPERATOR' || tok.type === 'UNARY_OPERATOR';
          const isParen = tok.type === 'LEFT_PAREN' || tok.type === 'RIGHT_PAREN';

          return (
            <div
              key={`${tok.value}-${idx}`}
              className={`flex-shrink-0 flex flex-col items-center gap-1 transition-all duration-200 ${
                isCurrent
                  ? 'scale-105 z-10'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div
                className={`min-w-[36px] h-[28px] px-2.5 rounded inline-flex items-center justify-center font-mono text-xs font-bold transition-all ${
                  isCurrent
                    ? 'bg-[#06B6D4]/15 text-[#22D3EE] border border-[#06B6D4] shadow-[0_0_12px_rgba(6,182,212,0.35)] ring-1 ring-[#06B6D4]/40'
                    : isOperator
                    ? 'bg-[#6366F1]/12 text-[#A5B4FC] border border-[#6366F1]/40'
                    : isParen
                    ? 'bg-[#18181B] text-[#71717A] border border-[#27272A]'
                    : 'bg-[#10B981]/12 text-[#6EE7B7] border border-[#10B981]/40'
                }`}
              >
                {tok.value}
              </div>

              <span className="text-[9px] font-mono text-[#71717A]">
                [{idx}]
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
