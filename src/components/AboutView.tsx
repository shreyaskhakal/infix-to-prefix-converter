import React from 'react';
import { Sparkles, Code2, Cpu, UserCheck } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 p-4">
      {/* Hero Header */}
      <div className="text-center flex flex-col items-center gap-3 pt-4">
        <div className="w-12 h-12 rounded bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10">
          <Sparkles className="w-6 h-6 text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100">
          Interactive Infix-to-Prefix DSA Lab
        </h2>
        <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
          An interactive Data Structures & Algorithms visualizer built to demonstrate exactly how stack frames transform mathematical expressions into Polish Prefix notation.
        </p>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-surface-subtle rounded border border-border-hairline p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider font-mono">
            <Cpu className="w-4 h-4" />
            <span>Real Deterministic Conversion Engine</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            No mock outputs or hardcoded shortcuts. The mathematical engine executes an immutable 5-stage pipeline with strict LIFO stack invariant monitoring, character-precise syntax validation, and precedence/associativity arbitration.
          </p>
        </div>

        <div className="bg-surface-subtle rounded border border-border-hairline p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider font-mono">
            <Code2 className="w-4 h-4" />
            <span>Time-Machine Playback Visualizer</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Step forward, step backward, or auto-play through every micro-operation. The &quot;Why Did This Happen?&quot; educational reason engine explains each push, pop, and precedence comparison in plain, accessible language.
          </p>
        </div>
      </div>

      {/* Author & Repository Card */}
      <div className="bg-surface-subtle rounded border border-border-hairline p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-500/30 font-mono">
            SK
          </div>
          <div>
            <div className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <span>Shreyas Khakal</span>
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-xs text-slate-400">Author & Lead Full-Stack Software Engineer</p>
          </div>
        </div>

        <a
          href="https://github.com/shreyaskhakal/infix-to-prefix-converter"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded bg-surface-elevated hover:bg-zinc-800 text-slate-200 font-semibold text-xs border border-border-hairline transition-colors"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span>View on GitHub</span>
        </a>
      </div>

      {/* Technology Specifications */}
      <div className="bg-surface-subtle rounded border border-border-hairline p-4 flex flex-col gap-2.5">
        <h4 className="label-caps text-slate-400">Engine Architecture & Stack</h4>
        <div className="flex flex-wrap gap-1.5 text-xs">
          {['React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Vitest', 'Clean Architecture', 'Zero-eval', 'Offline First'].map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded bg-canvas-root text-slate-300 border border-border-hairline font-mono text-[11px]"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

