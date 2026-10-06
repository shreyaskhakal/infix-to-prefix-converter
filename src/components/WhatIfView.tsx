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
    <div className="max-w-6xl mx-auto flex flex-col gap-6 p-4">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <GitCompare className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-100">What-If Comparison Lab</h2>
        </div>
        <p className="text-xs text-slate-400">
          Compare two expressions side-by-side to understand how operator precedence and parentheses structurally alter stack evaluation.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-medium">Quick Presets:</span>
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              setExprA(p.a);
              setExprB(p.b);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/60"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expression A */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Expression A</span>
            <span className="text-[11px] text-slate-400 font-mono">Standard / Baseline</span>
          </div>

          <input
            type="text"
            value={exprA}
            onChange={(e) => setExprA(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl font-mono text-base text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
            placeholder="e.g. A + B * C"
          />

          {aData.err ? (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{aData.err}</span>
            </div>
          ) : aData.res ? (
            <div className="flex flex-col gap-3">
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Prefix Output</div>
                <div className="font-mono text-lg font-bold text-indigo-300 mt-0.5">{aData.res.prefix}</div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <div className="text-[10px] text-slate-400">Steps</div>
                  <div className="font-mono font-bold text-slate-200">{aData.res.stats.totalSteps}</div>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <div className="text-[10px] text-slate-400">Peak Stack</div>
                  <div className="font-mono font-bold text-indigo-400">{aData.res.stats.maxStackSize}</div>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <div className="text-[10px] text-slate-400">Pushes/Pops</div>
                  <div className="font-mono font-bold text-emerald-400">{aData.res.stats.pushes}/{aData.res.stats.pops}</div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Expression B */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Expression B</span>
            <span className="text-[11px] text-slate-400 font-mono">Variant / Parenthesized</span>
          </div>

          <input
            type="text"
            value={exprB}
            onChange={(e) => setExprB(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl font-mono text-base text-slate-100 focus:outline-none focus:border-cyan-500 transition-colors"
            placeholder="e.g. (A + B) * C"
          />

          {bData.err ? (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{bData.err}</span>
            </div>
          ) : bData.res ? (
            <div className="flex flex-col gap-3">
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Prefix Output</div>
                <div className="font-mono text-lg font-bold text-cyan-300 mt-0.5">{bData.res.prefix}</div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <div className="text-[10px] text-slate-400">Steps</div>
                  <div className="font-mono font-bold text-slate-200">{bData.res.stats.totalSteps}</div>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <div className="text-[10px] text-slate-400">Peak Stack</div>
                  <div className="font-mono font-bold text-cyan-400">{bData.res.stats.maxStackSize}</div>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <div className="text-[10px] text-slate-400">Pushes/Pops</div>
                  <div className="font-mono font-bold text-emerald-400">{bData.res.stats.pushes}/{bData.res.stats.pops}</div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Structural Comparison Insight */}
      {aData.res && bData.res && (
        <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/40 to-slate-950/80 rounded-2xl border border-indigo-900/50 p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Structural Discrepancy Insight</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {aData.res.prefix === bData.res.prefix ? (
              <span>
                Both expressions produced the identical prefix representation (<code className="text-indigo-400 font-mono">{aData.res.prefix}</code>). The parentheses did not change the natural operator precedence hierarchy.
              </span>
            ) : (
              <span>
                Parentheses or operator differences caused the prefix expression to change from{' '}
                <code className="text-indigo-300 font-mono font-bold px-1.5 py-0.5 rounded bg-black/40">{aData.res.prefix}</code> to{' '}
                <code className="text-cyan-300 font-mono font-bold px-1.5 py-0.5 rounded bg-black/40">{bData.res.prefix}</code>. In Expression B, the inner sub-expression was forced into the stack first, binding its operator prior to outside operations!
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};
