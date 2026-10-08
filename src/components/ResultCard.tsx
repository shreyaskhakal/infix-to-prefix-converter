import React, { useState } from 'react';
import { Copy, Check, Download, Zap, CheckCircle2 } from 'lucide-react';
import type { ConversionResult } from '../types';

interface ResultCardProps {
  result: ConversionResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [copiedPrefix, setCopiedPrefix] = useState(false);
  const [copiedPostfix, setCopiedPostfix] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [isPrefixSpaced, setIsPrefixSpaced] = useState(true);
  const [isPostfixSpaced, setIsPostfixSpaced] = useState(true);

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

  const downloadCSV = () => {
    const metaHeader = 'Property,Value\n';
    const metaRows = [
      `Infix Expression,"${result.infix.replace(/"/g, '""')}"`,
      `Prefix Output,"${result.prefix.replace(/"/g, '""')}"`,
      `Postfix Intermediate,"${result.postfix.replace(/"/g, '""')}"`,
      `Total Steps,${result.stats.totalSteps}`,
      `Peak Stack Depth,${result.stats.maxStackSize}`,
      `Stack Pushes,${result.stats.pushes}`,
      `Stack Pops,${result.stats.pops}`,
      `Timestamp,"${new Date().toISOString()}"`,
    ].join('\n');

    const stepsHeader = '\n\nStep,Stage,Token,Action,Stack,Output,Reason\n';
    const stepRows = result.steps
      .map((s) => {
        const tok = s.currentToken || s.token || '';
        const st = (s.stackSnapshot || s.stack || []).join(' ');
        const out = (s.outputBuffer || s.output || []).join(' ');
        const exp = (s.explanation || s.reason || '').replace(/"/g, '""');
        return `${s.stepNumber},"${s.stage}","${tok}","${s.action}","${st}","${out}","${exp}"`;
      })
      .join('\n');

    const csvContent = metaHeader + metaRows + stepsHeader + stepRows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dsa_conversion_${result.prefix.replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTokens = (expr: string, spaced: boolean) => {
    if (!expr) return '';
    const clean = expr.trim();
    if (spaced) {
      return clean.includes(' ') ? clean : clean.split('').join(' ');
    } else {
      return clean.replace(/\s+/g, '');
    }
  };

  const displayedPrefix = formatTokens(result.prefix, isPrefixSpaced);
  const displayedPostfix = formatTokens(result.postfix, isPostfixSpaced);
  const prefixTokenCount = result.prefix.trim().split(/\s+/).filter(Boolean).length;
  const postfixTokenCount = result.postfix.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="bg-[#111318] rounded-lg border border-[#27272A] p-5 shadow-xl flex flex-col gap-4 text-[#F8FAFC]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#27272A]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-[#10B981]/15 text-[#10B981] flex items-center justify-center border border-[#10B981]/30">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[#F8FAFC]">Conversion Results</h3>
            <p className="text-[10px] text-[#71717A] font-mono">DETERMINISTIC MATHEMATICAL RE-ENCODING</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium bg-[#18181B] hover:bg-[#201F22] text-[#F8FAFC] border border-[#27272A] hover:border-[#3F3F46] transition-colors"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedAll ? '✓ Copied' : 'Copy All'}
          </button>

          <button
            onClick={downloadCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium bg-[#18181B] hover:bg-[#201F22] text-[#F8FAFC] border border-[#27272A] hover:border-[#3F3F46] transition-colors"
            title="Export CSV Report"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>

          <button
            onClick={downloadReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium bg-[#18181B] hover:bg-[#201F22] text-[#F8FAFC] border border-[#27272A] hover:border-[#3F3F46] transition-colors"
            title="Export JSON Report"
          >
            <Download className="w-3.5 h-3.5" />
            JSON
          </button>
        </div>
      </div>

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Infix */}
        <div className="bg-[#09090B] rounded border border-[#27272A] p-3.5 flex flex-col justify-between gap-2">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-semibold text-[#71717A] uppercase tracking-wider">
                Infix (Source)
              </span>
              <span className="text-[10px] font-mono text-[#71717A]">
                {result.infix.length} chars
              </span>
            </div>
            <div className="font-mono text-base font-bold text-[#F8FAFC] mt-1 break-all" title={result.infix}>
              {result.infix}
            </div>
          </div>
          <div className="text-[10px] text-[#71717A] font-mono">
            Standard operator-between-operands syntax
          </div>
        </div>

        {/* Prefix (Highlighted) */}
        <div className="bg-[#18181B] rounded border border-[#6366F1]/50 p-3.5 flex flex-col justify-between gap-2 shadow-[0_0_16px_rgba(99,102,241,0.12)]">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold text-[#C0C1FF] uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#6366F1]" />
                  Prefix
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#6366F1]/20 text-[#C0C1FF] border border-[#6366F1]/30">
                  Polish Notation
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPrefixSpaced(!isPrefixSpaced)}
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#09090B] text-[#71717A] hover:text-[#F8FAFC] border border-[#27272A]"
                  title="Toggle raw vs spaced representation"
                >
                  {isPrefixSpaced ? 'Spaced' : 'Raw'}
                </button>
                <button
                  onClick={() => copyToClipboard(displayedPrefix, setCopiedPrefix)}
                  className="text-[#C0C1FF] hover:text-white transition-colors"
                  title="Copy Prefix"
                >
                  {copiedPrefix ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div className="font-mono text-lg font-bold text-[#C0C1FF] mt-1 break-all tracking-wide" title={displayedPrefix}>
              {displayedPrefix}
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#71717A] font-mono">
            <span>{copiedPrefix ? <strong className="text-[#10B981]">✓ Copied</strong> : 'Operator precedes operands'}</span>
            <span>{prefixTokenCount} tokens</span>
          </div>
        </div>

        {/* Postfix */}
        <div className="bg-[#09090B] rounded border border-[#27272A] p-3.5 flex flex-col justify-between gap-2">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold text-[#06B6D4] uppercase tracking-wider">
                  Postfix
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30">
                  Reverse Polish
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPostfixSpaced(!isPostfixSpaced)}
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#18181B] text-[#71717A] hover:text-[#F8FAFC] border border-[#27272A]"
                  title="Toggle raw vs spaced representation"
                >
                  {isPostfixSpaced ? 'Spaced' : 'Raw'}
                </button>
                <button
                  onClick={() => copyToClipboard(displayedPostfix, setCopiedPostfix)}
                  className="text-[#06B6D4] hover:text-white transition-colors"
                  title="Copy Postfix"
                >
                  {copiedPostfix ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div className="font-mono text-base font-bold text-[#06B6D4] mt-1 break-all tracking-wide" title={displayedPostfix}>
              {displayedPostfix}
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#71717A] font-mono">
            <span>{copiedPostfix ? <strong className="text-[#10B981]">✓ Copied</strong> : 'Operands precede operator'}</span>
            <span>{postfixTokenCount} tokens</span>
          </div>
        </div>
      </div>

      {/* Execution Telemetry Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#27272A] text-xs text-[#71717A] font-mono">
        <div className="flex flex-wrap items-center gap-4">
          <span>STEPS: <strong className="text-[#F8FAFC]">{result.stats.totalSteps}</strong></span>
          <span>PEAK_STACK_DEPTH: <strong className="text-[#F8FAFC]">{result.stats.maxStackSize}</strong></span>
          <span>PUSHES: <strong className="text-[#10B981]">{result.stats.pushes}</strong></span>
          <span>POPS: <strong className="text-[#EF4444]">{result.stats.pops}</strong></span>
        </div>
        <div className="text-[10px] text-[#71717A]">
          STATUS: <span className="text-[#10B981]">O(N)_OPTIMAL</span>
        </div>
      </div>
    </div>
  );
};
