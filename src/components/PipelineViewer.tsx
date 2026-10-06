import React from 'react';
import { CheckCircle2, Workflow } from 'lucide-react';
import type { PipelineState } from '../types';

interface PipelineViewerProps {
  pipeline: PipelineState;
  activeStage?: number; // 1 to 6
}

export const PipelineViewer: React.FC<PipelineViewerProps> = ({
  pipeline,
  activeStage = 4,
}) => {
  const stages = [
    {
      num: 1,
      title: '1. Infix Expression',
      description: 'Original mathematical input',
      value: pipeline.infix,
      badge: 'Input',
    },
    {
      num: 2,
      title: '2. Reverse Tokens',
      description: 'Reversing operand/operator order',
      value: pipeline.reversedInfix,
      badge: 'Reverse',
    },
    {
      num: 3,
      title: '3. Swap Parentheses',
      description: 'Swap "(" with ")" for stack validity',
      value: pipeline.modifiedInfix,
      badge: 'Transform',
    },
    {
      num: 4,
      title: '4. Stack Processing',
      description: 'Convert modified expression to postfix',
      value: pipeline.intermediatePostfix,
      badge: 'Stack Active',
    },
    {
      num: 5,
      title: '5. Reverse Postfix',
      description: 'Reverse intermediate token sequence',
      value: pipeline.reversedPostfix,
      badge: 'Reverse',
    },
    {
      num: 6,
      title: '6. Final Prefix',
      description: 'Operator precedes operands',
      value: pipeline.finalPrefix,
      badge: 'Prefix Result',
    },
  ];

  return (
    <div className="bg-slate-900/50 dark:bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Workflow className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-100">Conversion Pipeline</h3>
            <p className="text-[11px] text-slate-400">Complete 6-Phase Transformation Architecture</p>
          </div>
        </div>

        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/80 px-2.5 py-1 rounded-full">
          Phase {activeStage} of 6
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {stages.map((stage) => {
          const isCurrent = stage.num === activeStage;
          const isCompleted = stage.num < activeStage;
          return (
            <div
              key={stage.num}
              className={`relative rounded-xl p-3.5 border transition-all ${
                isCurrent
                  ? 'bg-indigo-950/40 border-indigo-500/80 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/40'
                  : isCompleted
                  ? 'bg-slate-950/30 border-slate-800 opacity-85'
                  : 'bg-slate-950/20 border-slate-800/60 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-indigo-400 animate-pulse' : 'bg-slate-600'}`} />
                  )}
                  {stage.title}
                </span>

                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    isCurrent
                      ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {stage.badge}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 mb-2">{stage.description}</p>

              <div className="bg-slate-950/90 rounded-lg p-2 font-mono text-xs text-slate-100 overflow-x-auto whitespace-nowrap border border-slate-800/80 flex items-center justify-between">
                <span className="text-indigo-300 font-semibold">{stage.value || '—'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
