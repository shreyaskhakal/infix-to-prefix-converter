import React, { useState } from 'react';
import { Copy, Check, Download, Zap, CheckCircle2 } from 'lucide-react';
import type { ConversionResult } from '../types';

interface ResultCardProps {
  result: ConversionResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [copiedPrefix, setCopiedPrefix] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const copyToClipboard = (text: string, setFn: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setFn(true);
    setTimeout(() => setFn(false), 2000);
  };

  const copyAll = () => {
    const text = `Infix:   ${result.infix}\nPrefix:  ${result.prefix}\nPostfix: ${result.postfix}\nSteps:   ${result.stats.totalSteps}\nPeak Stack Depth: ${result.stats.maxStackSize}`;
    copyToClipboard(text, setCopiedAll);
  };

  const downloadReport = () => {
    const jsonStr = JSON.stringify(result, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dsa_conversion_${result.prefix.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900/50 dark:bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-100">Conversion Results</h3>
            <p className="text-[11px] text-slate-400">Deterministic Mathematical Representation</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedAll ? 'Copied' : 'Copy All'}
          </button>

          <button
            onClick={downloadReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            JSON
          </button>
        </div>
      </div>

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Infix */}
        <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800 flex flex-col gap-1">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Infix Input
          </div>
          <div className="font-mono text-base font-bold text-slate-100 truncate" title={result.infix}>
            {result.infix}
          </div>
        </div>

        {/* Prefix (Highlighted) */}
        <div className="bg-gradient-to-r from-indigo-950/50 to-purple-950/50 rounded-xl p-3.5 border border-indigo-500/40 shadow-lg shadow-indigo-500/10 flex flex-col gap-1 relative group">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Prefix Result
            </div>
            <button
              onClick={() => copyToClipboard(result.prefix, setCopiedPrefix)}
              className="text-indigo-400 hover:text-indigo-200 transition-colors"
              title="Copy Prefix"
            >
              {copiedPrefix ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="font-mono text-lg font-bold text-indigo-300 truncate tracking-wide" title={result.prefix}>
            {result.prefix}
          </div>
        </div>

        {/* Postfix */}
        <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800 flex flex-col gap-1">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Postfix Form
          </div>
          <div className="font-mono text-base font-bold text-cyan-400 truncate" title={result.postfix}>
            {result.postfix}
          </div>
        </div>
      </div>

      {/* Execution Telemetry Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span>Total Steps: <strong className="text-slate-200 font-mono">{result.stats.totalSteps}</strong></span>
          <span>Peak Stack Depth: <strong className="text-slate-200 font-mono">{result.stats.maxStackSize}</strong></span>
          <span>Stack Pushes: <strong className="text-slate-200 font-mono">{result.stats.pushes}</strong></span>
          <span>Stack Pops: <strong className="text-slate-200 font-mono">{result.stats.pops}</strong></span>
        </div>
        <div className="text-[11px] text-slate-500">
          Conversion completed in &lt;1ms
        </div>
      </div>
    </div>
  );
};
