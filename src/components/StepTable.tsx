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
    <div className="bg-slate-900/50 dark:bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Table className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-100">Step-by-Step Trace Matrix</h3>
            <p className="text-[11px] text-slate-400">Click any row to jump time-machine to that step</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter steps..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-950/70 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={exportCSV}
            disabled={steps.length === 0}
            title="Export CSV"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto max-h-[380px] rounded-xl border border-slate-800/80">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] tracking-wider sticky top-0 z-10 border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3">#</th>
              <th className="py-2.5 px-3">Token</th>
              <th className="py-2.5 px-3">Action</th>
              <th className="py-2.5 px-3">Stack</th>
              <th className="py-2.5 px-3">Output Buffer</th>
              <th className="py-2.5 px-4">Reasoning</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {filteredSteps.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500 italic">
                  No trace records to display.
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
                        ? 'bg-indigo-950/60 text-white font-medium ring-1 ring-inset ring-indigo-500/50'
                        : 'hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-indigo-400">
                      {step.stepNumber}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                        {tok}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium">
                      {step.action}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-amber-300">
                      [{st.join(', ')}]
                    </td>
                    <td className="py-2.5 px-3 font-mono text-cyan-300">
                      {out.join(' ')}
                    </td>
                    <td className="py-2.5 px-4 text-slate-400 max-w-xs truncate" title={exp}>
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
