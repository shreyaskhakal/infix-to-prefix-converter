import React from 'react';
import { Sparkles, Code2, Cpu, UserCheck } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 p-4">
      {/* Hero Header */}
      <div className="text-center flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-xl shadow-indigo-500/20">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
          Interactive Infix-to-Prefix DSA Lab
        </h2>
        <p className="text-sm text-slate-400 max-w-xl">
          An interactive Data Structures & Algorithms visualizer built to demonstrate exactly how stack frames transform mathematical expressions into Polish Prefix notation.
        </p>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 flex flex-col gap-2 shadow-xl">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
            <Cpu className="w-4 h-4" />
            <span>Real Deterministic Conversion Engine</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            No mock outputs or hardcoded shortcuts. The mathematical engine executes an immutable 5-stage pipeline with strict LIFO stack invariant monitoring, character-precise syntax validation, and precedence/associativity arbitration.
          </p>
        </div>

        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 flex flex-col gap-2 shadow-xl">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Code2 className="w-4 h-4" />
            <span>Time-Machine Playback Visualizer</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Step forward, step backward, or auto-play through every micro-operation. The "Why Did This Happen?" educational reason engine explains each push, pop, and precedence comparison in plain, accessible language.
          </p>
        </div>
      </div>

      {/* Author & Repository Card */}
      <div className="bg-gradient-to-br from-indigo-950/40 to-slate-950/90 rounded-2xl border border-indigo-900/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-500/30">
            SK
          </div>
          <div>
            <div className="text-base font-bold text-slate-100 flex items-center gap-1.5">
              <span>Shreyas Khakal</span>
              <UserCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs text-slate-400">Author & Lead Full-Stack Software Engineer</p>
          </div>
        </div>

        <a
          href="https://github.com/shreyaskhakal/infix-to-prefix-converter"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors shadow-lg"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span>View on GitHub</span>
        </a>
      </div>

      {/* Technology Specifications */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 flex flex-col gap-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Engine Architecture & Stack</h4>
        <div className="flex flex-wrap gap-2 text-xs">
          {['React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Vitest', 'Clean Architecture', 'Zero-eval', 'Offline First'].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 font-mono"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
