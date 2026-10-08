import React, { useState } from 'react';
import { GitCompare, Lightbulb, AlertCircle } from 'lucide-react';
import { InfixToPrefixConverter } from '../algorithms/converter';
import type { ConversionResult } from '../types';

export const WhatIfView: React.FC = () => {
  const [exprA, setExprA] = useState('A + B * C');
  const [exprB, setExprB] = useState('(A + B) * C');

  const getResult = (expr: string): { res: ConversionResult | null; err: string | null } => {
    try {
      const res = InfixToPrefixConverter.convert(expr);
      return { res, err: null };
    } catch (e: any) {
      return { res: null, err: e.message || 'Invalid expression' };
    }
  };

  const aData = getResult(exprA);
  const bData = getResult(exprB);

  const presets = [
    { label: 'Parentheses Override', a: 'A + B * C', b: '(A + B) * C' },
    { label: 'Right-Associative Exponent', a: 'A ^ B ^ C', b: '(A ^ B) ^ C' },
    { label: 'Division & Addition', a: 'A / B + C', b: 'A / (B + C)' },
    { label: 'Multi-term Hierarchy', a: 'A + B * C - D', b: '(A + B) * (C - D)' },
  ];

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 p-4 text-[#F8FAFC]">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#6366F1]/15 text-[#C0C1FF] flex items-center justify-center border border-[#6366F1]/30">
            <GitCompare className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-[#F8FAFC]">What-If Comparison Lab</h2>
        </div>
        <p className="text-xs text-[#71717A] font-mono">
          PARALLEL AST EXPERIMENTATION &bull; PRECEDENCE & PARENTHESIS BINDING DYNAMICS
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-mono text-[#71717A] uppercase font-semibold">PRESETS:</span>
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              setExprA(p.a);
              setExprB(p.b);
            }}
            className="px-2.5 py-1 rounded text-xs font-mono font-medium bg-[#18181B] hover:bg-[#201F22] text-[#F8FAFC] transition-colors border border-[#27272A] hover:border-[#3F3F46]"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expression A */}
        <div className="bg-[#111318] rounded-lg border border-[#27272A] p-5 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-[#27272A]">
            <span className="text-xs font-mono font-bold text-[#C0C1FF] uppercase tracking-wider">EXPRESSION_A</span>
            <span className="text-[10px] text-[#71717A] font-mono">BASELINE_PARSING</span>
          </div>

          <input
            type="text"
            value={exprA}
            onChange={(e) => setExprA(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#09090B] border border-[#27272A] rounded font-mono text-base text-[#F8FAFC] focus:outline-none focus:border-[#6366F1] transition-colors"
            placeholder="e.g. A + B * C"
          />

          {aData.err ? (
            <div className="p-3 rounded bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#FCA5A5] text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{aData.err}</span>
            </div>
          ) : aData.res ? (
            <div className="flex flex-col gap-3">
              <div className="bg-[#09090B] p-3.5 rounded border border-[#27272A]">
                <div className="text-[10px] text-[#71717A] font-mono uppercase font-semibold">PREFIX_RESULT</div>
                <div className="font-mono text-lg font-bold text-[#C0C1FF] mt-0.5">{aData.res.prefix}</div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="bg-[#09090B] p-2 rounded border border-[#27272A]">
                  <div className="text-[10px] text-[#71717A]">STEPS</div>
                  <div className="font-mono font-bold text-[#F8FAFC]">{aData.res.stats.totalSteps}</div>
                </div>
                <div className="bg-[#09090B] p-2 rounded border border-[#27272A]">
                  <div className="text-[10px] text-[#71717A]">PEAK_DEPTH</div>
                  <div className="font-mono font-bold text-[#C0C1FF]">{aData.res.stats.maxStackSize}</div>
                </div>
                <div className="bg-[#09090B] p-2 rounded border border-[#27272A]">
                  <div className="text-[10px] text-[#71717A]">PUSH/POP</div>
                  <div className="font-mono font-bold text-[#10B981]">{aData.res.stats.pushes}/{aData.res.stats.pops}</div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Expression B */}
        <div className="bg-[#111318] rounded-lg border border-[#27272A] p-5 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-[#27272A]">
            <span className="text-xs font-mono font-bold text-[#06B6D4] uppercase tracking-wider">EXPRESSION_B</span>
            <span className="text-[10px] text-[#71717A] font-mono">PARENTESIZED_VARIANT</span>
          </div>

          <input
            type="text"
            value={exprB}
            onChange={(e) => setExprB(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#09090B] border border-[#27272A] rounded font-mono text-base text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4] transition-colors"
            placeholder="e.g. (A + B) * C"
          />

          {bData.err ? (
            <div className="p-3 rounded bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#FCA5A5] text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{bData.err}</span>
            </div>
          ) : bData.res ? (
            <div className="flex flex-col gap-3">
              <div className="bg-[#09090B] p-3.5 rounded border border-[#27272A]">
                <div className="text-[10px] text-[#71717A] font-mono uppercase font-semibold">PREFIX_RESULT</div>
                <div className="font-mono text-lg font-bold text-[#06B6D4] mt-0.5">{bData.res.prefix}</div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="bg-[#09090B] p-2 rounded border border-[#27272A]">
                  <div className="text-[10px] text-[#71717A]">STEPS</div>
                  <div className="font-mono font-bold text-[#F8FAFC]">{bData.res.stats.totalSteps}</div>
                </div>
                <div className="bg-[#09090B] p-2 rounded border border-[#27272A]">
                  <div className="text-[10px] text-[#71717A]">PEAK_DEPTH</div>
                  <div className="font-mono font-bold text-[#06B6D4]">{bData.res.stats.maxStackSize}</div>
                </div>
                <div className="bg-[#09090B] p-2 rounded border border-[#27272A]">
                  <div className="text-[10px] text-[#71717A]">PUSH/POP</div>
                  <div className="font-mono font-bold text-[#10B981]">{bData.res.stats.pushes}/{bData.res.stats.pops}</div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Structural Comparison Insight */}
      {aData.res && bData.res && (
        <div className="bg-[#18181B] rounded-lg border border-[#6366F1]/30 p-5 flex flex-col gap-3 shadow-[0_0_16px_rgba(99,102,241,0.08)]">
          <div className="flex items-center gap-2 text-[#C0C1FF] font-semibold text-sm">
            <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
            <span className="font-mono tracking-wider">STRUCTURAL_DISCREPANCY_INSIGHT</span>
          </div>

          <p className="text-xs sm:text-sm text-[#F8FAFC] leading-relaxed">
            {aData.res.prefix === bData.res.prefix ? (
              <span>
                Both expressions produced the identical prefix representation (<code className="text-[#C0C1FF] font-mono font-bold">{aData.res.prefix}</code>). The parentheses did not change the natural operator precedence hierarchy.
              </span>
            ) : (
              <span>
                Parentheses or operator differences caused the prefix expression to change from{' '}
                <code className="text-[#C0C1FF] font-mono font-bold px-1.5 py-0.5 rounded bg-[#09090B] border border-[#27272A]">{aData.res.prefix}</code> to{' '}
                <code className="text-[#06B6D4] font-mono font-bold px-1.5 py-0.5 rounded bg-[#09090B] border border-[#27272A]">{bData.res.prefix}</code>. In Expression B, the inner sub-expression was forced into the stack first, binding its operator prior to outside operations!
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};
