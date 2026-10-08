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
    <div className="bg-[#111318] rounded-lg border border-[#27272A] p-5 shadow-xl text-[#F8FAFC]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#27272A] mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-[#06B6D4]/15 text-[#06B6D4] flex items-center justify-center border border-[#06B6D4]/30">
            <Workflow className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[#F8FAFC]">Conversion Pipeline</h3>
            <p className="text-[10px] text-[#71717A] font-mono">6-PHASE MATHEMATICAL STATE MACHINE</p>
          </div>
        </div>

        <span className="text-xs font-mono text-[#06B6D4] bg-[#06B6D4]/10 border border-[#06B6D4]/30 px-2.5 py-1 rounded">
          PHASE {activeStage} OF 6
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {stages.map((stage) => {
          const isCurrent = stage.num === activeStage;
          const isCompleted = stage.num < activeStage;
          return (
            <div
              key={stage.num}
              className={`relative rounded p-3.5 border transition-all ${
                isCurrent
                  ? 'bg-[#18181B] border-[#06B6D4] shadow-[0_0_14px_rgba(6,182,212,0.2)] ring-1 ring-[#06B6D4]/30'
                  : isCompleted
                  ? 'bg-[#131315] border-[#27272A] opacity-90'
                  : 'bg-[#09090B] border-[#27272A]/70 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  ) : (
                    <span className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-[#06B6D4] animate-pulse' : 'bg-[#3F3F46]'}`} />
                  )}
                  {stage.title}
                </span>

                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                    isCurrent
                      ? 'bg-[#06B6D4]/20 text-[#06B6D4] border border-[#06B6D4]/40'
                      : isCompleted
                      ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                      : 'bg-[#18181B] text-[#71717A] border border-[#27272A]'
                  }`}
                >
                  {stage.badge}
                </span>
              </div>

              <p className="text-[11px] text-[#71717A] mb-2">{stage.description}</p>

              <div className="bg-[#09090B] rounded p-2 font-mono text-xs text-[#F8FAFC] overflow-x-auto whitespace-nowrap border border-[#27272A] flex items-center justify-between">
                <span className="text-[#C0C1FF] font-semibold">{stage.value || '—'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
