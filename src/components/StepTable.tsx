import React, { useState } from 'react';
import { Table, Download, Search } from 'lucide-react';
import type { AlgorithmStep } from '../types';

interface StepTableProps {
  steps: AlgorithmStep[];
  currentStepIndex: number;
  onSelectStep: (index: number) => void;
}

export const StepTable: React.FC<StepTableProps> = ({
  steps,
  currentStepIndex,
  onSelectStep,
}) => {
  const [filter, setFilter] = useState('');

  const filteredSteps = steps.filter((s) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    const tok = (s.currentToken || s.token || '').toLowerCase();
    const act = (s.action || '').toLowerCase();
    const exp = (s.explanation || s.reason || '').toLowerCase();
    return tok.includes(q) || act.includes(q) || exp.includes(q);
  });

  const exportCSV = () => {
    if (steps.length === 0) return;
    const header = 'Step,Token,Action,Stack,Output,Explanation\n';
    const rows = steps.map(s => {
      const tok = s.currentToken || s.token || '';
      const st = (s.stackSnapshot || s.stack || []).join(' ');
      const out = (s.outputBuffer || s.output || []).join(' ');
      const exp = (s.explanation || s.reason || '').replace(/"/g, '""');
      return `"${s.stepNumber}","${tok}","${s.action}","${st}","${out}","${exp}"`;
    }).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `infix_prefix_steps_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#111318] rounded-lg border border-[#27272A] p-5 shadow-xl flex flex-col gap-4 text-[#F8FAFC]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#27272A]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-[#06B6D4]/15 text-[#06B6D4] flex items-center justify-center border border-[#06B6D4]/30">
            <Table className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[#F8FAFC]">Execution Trace Matrix</h3>
            <p className="text-[10px] text-[#71717A] font-mono">TABULAR STEP TRANSITIONS &bull; CLICK ROW TO SEEK</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#71717A] absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter by token/action..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs font-mono bg-[#09090B] border border-[#27272A] rounded text-[#F8FAFC] placeholder-[#71717A] focus:outline-none focus:border-[#6366F1]"
            />
          </div>

          <button
            onClick={exportCSV}
            disabled={steps.length === 0}
            title="Export CSV"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium bg-[#18181B] hover:bg-[#201F22] text-[#F8FAFC] border border-[#27272A] hover:border-[#3F3F46] transition-colors disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto max-h-[380px] rounded border border-[#27272A]">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-[#09090B] text-[#71717A] font-mono uppercase text-[10px] tracking-wider sticky top-0 z-10 border-b border-[#27272A]">
            <tr>
              <th className="py-2.5 px-3">STEP</th>
              <th className="py-2.5 px-3">TOKEN</th>
              <th className="py-2.5 px-3">ACTION</th>
              <th className="py-2.5 px-3">STACK_FRAME</th>
              <th className="py-2.5 px-3">OUTPUT_STREAM</th>
              <th className="py-2.5 px-4">REASONING</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272A]/50 font-sans">
            {filteredSteps.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#71717A] italic font-mono text-xs">
                  NO_TRACE_RECORDS_FOUND
                </td>
              </tr>
            ) : (
              filteredSteps.map((step) => {
                const originalIndex = steps.indexOf(step);
                const isActive = originalIndex === currentStepIndex;
                const tok = step.currentToken || step.token || '';
                const st = step.stackSnapshot || step.stack || [];
                const out = step.outputBuffer || step.output || [];
                const exp = step.explanation || step.reason || '';

                return (
                  <tr
                    key={step.stepNumber}
                    onClick={() => onSelectStep(originalIndex)}
                    className={`cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-[#18181B] text-[#F8FAFC] font-medium border-l-2 border-l-[#06B6D4]'
                        : 'hover:bg-[#131315] text-[#71717A] hover:text-[#F8FAFC]'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-[#06B6D4]">
                      {step.stepNumber}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold">
                      <span className="px-1.5 py-0.5 rounded bg-[#09090B] border border-[#27272A] text-[#F8FAFC]">
                        {tok}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-[#F8FAFC]">
                      {step.action}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#F59E0B]">
                      [{st.join(', ')}]
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#10B981]">
                      {out.join(' ')}
                    </td>
                    <td className="py-2.5 px-4 text-[#71717A] max-w-xs truncate font-mono text-[11px]" title={exp}>
                      {exp}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
