import React from 'react';
import { HelpCircle, Sparkles, Terminal, Activity } from 'lucide-react';
import type { AlgorithmStep } from '../types';

interface OperationPanelProps {
  currentStep?: AlgorithmStep;
  totalSteps: number;
}

export const OperationPanel: React.FC<OperationPanelProps> = ({
  currentStep,
  totalSteps,
}) => {
  if (!currentStep) {
    return (
      <div className="bg-slate-900/50 dark:bg-slate-900/80 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center text-center text-slate-500">
        <Activity className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-sm">No conversion in progress. Enter an expression to begin.</p>
      </div>
    );
  }

  const stepNumber = currentStep.stepNumber;
  const currentToken = currentStep.currentToken || currentStep.token;
  const action = currentStep.action;
  const actionType = currentStep.actionType || currentStep.operationType?.toLowerCase() || 'none';
  const outputBuffer = currentStep.outputBuffer || currentStep.output || [];
  const explanation = currentStep.explanation || currentStep.reason || '';
  const ruleApplied = currentStep.ruleApplied;
  const comparisons = currentStep.comparisons;

  // Action badge colors
  const getActionBadgeColor = () => {
    switch (actionType) {
      case 'push':
      case 'push_paren':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'pop':
      case 'pop_paren':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'output':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'pop_remaining':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
    }
  };

  return (
    <div className="bg-slate-900/50 dark:bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-100">Step Explanation & Logic</h3>
            <p className="text-[11px] text-slate-400">Deterministic DSA State Engine</p>
          </div>
        </div>

        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          Step {stepNumber} of {totalSteps}
        </span>
      </div>

      {/* Action and Token Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Token Being Processed */}
        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Scanned Token</span>
          <span className="font-mono text-base font-bold px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
            {currentToken || '—'}
          </span>
        </div>

        {/* Action Taken */}
        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Action Taken</span>
          <span className={`text-xs font-bold font-mono px-3 py-1 rounded-lg border ${getActionBadgeColor()}`}>
            {action}
          </span>
        </div>
      </div>

      {/* Context-Aware "Why Did This Happen?" Box */}
      <div className="bg-gradient-to-br from-indigo-950/40 to-slate-950/80 rounded-xl p-4 border border-indigo-900/40 flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Why Did This Happen?</span>
        </div>

        <p className="text-sm text-slate-200 leading-relaxed font-sans">
          {explanation}
        </p>

        {/* Rule Applied Callout */}
        {ruleApplied && (
          <div className="mt-1 pt-2 border-t border-indigo-900/30 flex items-start gap-2 text-xs text-indigo-300/90 font-mono">
            <span className="font-bold text-amber-400 shrink-0">Rule:</span>
            <span>{ruleApplied}</span>
          </div>
        )}

        {/* Comparison Details if available */}
        {comparisons && (
          <div className="mt-1 p-2 rounded-lg bg-black/30 border border-indigo-950 font-mono text-xs text-slate-300 flex items-center gap-2">
            <span className="text-slate-400">Precedence Check:</span>
            <span className="text-amber-300 font-semibold">{comparisons}</span>
          </div>
        )}
      </div>

      {/* Output Buffer Stream */}
      <div className="bg-slate-950/70 rounded-xl p-3.5 border border-slate-800 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1 font-medium">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            Intermediate Postfix Stream
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            Length: {outputBuffer.length}
          </span>
        </div>

        <div className="bg-slate-900/90 rounded-lg p-2.5 font-mono text-sm text-cyan-300 overflow-x-auto whitespace-nowrap border border-slate-800 tracking-wide font-bold">
          {outputBuffer.length > 0 ? outputBuffer.join(' ') : <span className="text-slate-600 font-normal italic">Empty buffer</span>}
        </div>
      </div>
    </div>
  );
};
