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
        return 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]';
      case 'pop':
      case 'pop_paren':
        return 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/40 shadow-[0_0_8px_rgba(239,68,68,0.2)]';
      case 'output':
        return 'bg-[#06B6D4]/15 text-[#06B6D4] border-[#06B6D4]/40 shadow-[0_0_8px_rgba(6,182,212,0.2)]';
      case 'pop_remaining':
        return 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]';
      default:
        return 'bg-[#6366F1]/15 text-[#C0C1FF] border-[#6366F1]/40';
    }
  };

  return (
    <div className="bg-[#111318] rounded-lg border border-[#27272A] p-5 shadow-xl flex flex-col gap-4 text-[#F8FAFC]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-[#6366F1]/15 text-[#C0C1FF] flex items-center justify-center border border-[#6366F1]/30">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[#F8FAFC]">Step Logic & Why Engine</h3>
            <p className="text-[10px] text-[#71717A] font-mono">DETERMINISTIC REASONING TELEMETRY</p>
          </div>
        </div>

        <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-[#18181B] text-[#71717A] border border-[#27272A]">
          STEP <strong className="text-[#06B6D4]">{stepNumber}</strong> / {totalSteps}
        </span>
      </div>

      {/* Action and Token Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Token Being Processed */}
        <div className="bg-[#09090B] rounded p-3 border border-[#27272A] flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#71717A]">CURRENT_TOKEN</span>
          <span className="font-mono text-base font-bold px-3 py-0.5 rounded bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/40 shadow-[0_0_8px_rgba(6,182,212,0.2)]">
            {currentToken || '—'}
          </span>
        </div>

        {/* Action Taken */}
        <div className="bg-[#09090B] rounded p-3 border border-[#27272A] flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#71717A]">ACTION_TYPE</span>
          <span className={`text-xs font-bold font-mono px-3 py-1 rounded border ${getActionBadgeColor()}`}>
            {action}
          </span>
        </div>
      </div>

      {/* Context-Aware "Why Did This Happen?" Box */}
      <div className="bg-[#18181B] rounded p-4 border border-[#6366F1]/30 shadow-[0_0_16px_rgba(99,102,241,0.08)] flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#C0C1FF]">
          <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" />
          <span className="font-mono tracking-wider">WHY DID THIS HAPPEN?</span>
        </div>

        <p className="text-sm text-[#F8FAFC] leading-relaxed font-sans">
          {explanation}
        </p>

        {/* Rule Applied Callout */}
        {ruleApplied && (
          <div className="mt-1 pt-2 border-t border-[#27272A] flex items-start gap-2 text-xs text-[#A5B4FC] font-mono">
            <span className="font-bold text-[#F59E0B] shrink-0">RULE:</span>
            <span>{ruleApplied}</span>
          </div>
        )}

        {/* Comparison Details if available */}
        {comparisons && (
          <div className="mt-1 p-2 rounded bg-[#09090B] border border-[#27272A] font-mono text-xs text-[#F8FAFC] flex items-center gap-2">
            <span className="text-[#71717A]">PRECEDENCE_CHECK:</span>
            <span className="text-[#F59E0B] font-semibold">{comparisons}</span>
          </div>
        )}
      </div>

      {/* Output Buffer Stream */}
      <div className="bg-[#09090B] rounded p-3.5 border border-[#27272A] flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#71717A] flex items-center gap-1 font-mono text-[11px]">
            <Terminal className="w-3.5 h-3.5 text-[#06B6D4]" />
            INTERMEDIATE_OUTPUT_STREAM
          </span>
          <span className="text-[10px] text-[#71717A] font-mono">
            LENGTH: {outputBuffer.length}
          </span>
        </div>

        <div className="bg-[#18181B] rounded p-2.5 font-mono text-sm text-[#06B6D4] overflow-x-auto whitespace-nowrap border border-[#27272A] tracking-wide font-bold">
          {outputBuffer.length > 0 ? outputBuffer.join(' ') : <span className="text-[#71717A] font-normal italic">Empty buffer</span>}
        </div>
      </div>
    </div>
  );
};
