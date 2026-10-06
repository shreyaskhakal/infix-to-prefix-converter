import { useState, useEffect, useRef } from 'react';
import { AlertCircle, Zap } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { StackVisualizer } from './components/StackVisualizer';
import { PipelineViewer } from './components/PipelineViewer';
import { TokenRibbon } from './components/TokenRibbon';
import { OperationPanel } from './components/OperationPanel';
import { PlaybackControls } from './components/PlaybackControls';
import { StepTable } from './components/StepTable';
import { ResultCard } from './components/ResultCard';
import { WhatIfView } from './components/WhatIfView';
import { PracticeView } from './components/PracticeView';
import { QuizView } from './components/QuizView';
import { LearnView } from './components/LearnView';
import { AboutView } from './components/AboutView';
import { HistoryDrawer } from './components/HistoryDrawer';

import { InfixToPrefixConverter } from './algorithms/converter';
import { ExpressionValidator } from './algorithms/validator';
import { EXAMPLE_EXPRESSIONS } from './data/constants';
import type { ConversionResult, HistoryItem } from './types';

export function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('dsa_theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  const [activeTab, setActiveTab] = useState('converter');
  const [inputExpression, setInputExpression] = useState('A + B * C');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Time-machine playback state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(800); // ms per step

  // History & drawer
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('dsa_conversion_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Timer reference for auto-play
  const playTimerRef = useRef<number | null>(null);

  // Apply theme class to documentElement
  useEffect(() => {
    localStorage.setItem('dsa_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('dsa_conversion_history', JSON.stringify(history));
  }, [history]);

  // Initial conversion on mount
  useEffect(() => {
    handleConvert('A + B * C', false);
  }, []);

  // Playback timer loop
  useEffect(() => {
    if (isPlaying && result) {
      playTimerRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= result.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }

    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, result, playbackSpeed]);

  const handleConvert = (expr: string = inputExpression, saveHistory: boolean = true) => {
    setIsPlaying(false);
    setValidationError(null);

    // Validate syntax first
    const val = ExpressionValidator.validate(expr);
    if (!val.isValid) {
      setValidationError(val.error);
      return;
    }

    try {
      const res = InfixToPrefixConverter.convert(expr);
      setResult(res);
      setCurrentStepIndex(0);

      if (saveHistory) {
        const newItem: HistoryItem = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          infix: res.infix,
          prefix: res.prefix,
          postfix: res.postfix,
          timestamp: Date.now(),
        };
        setHistory((prev) => [newItem, ...prev.slice(0, 24)]);
      }
    } catch (err: any) {
      setValidationError(err.message || 'An unexpected conversion error occurred.');
    }
  };

  const handleClear = () => {
    setInputExpression('');
    setResult(null);
    setValidationError(null);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const loadExample = (ex: string) => {
    setInputExpression(ex);
    handleConvert(ex, true);
  };

  const currentStep = result && result.steps[currentStepIndex] ? result.steps[currentStepIndex] : undefined;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      {/* Main Content Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'converter' && (
          <div className="flex flex-col gap-6">
            {/* Input & Examples Section */}
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                    <span>Infix → Prefix Converter</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      Stack Lab
                    </span>
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Enter any mathematical expression with operators (+, -, *, /, %, ^), parentheses, and variables.
                  </p>
                </div>

                {/* Example Quick Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">Examples:</span>
                  {EXAMPLE_EXPRESSIONS.slice(0, 5).map((ex) => (
                    <button
                      key={ex.expression}
                      onClick={() => loadExample(ex.expression)}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors whitespace-nowrap"
                    >
                      {ex.expression}
                    </button>
                  ))}
                </div>
              </div>

              {/* Expression Input Form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleConvert(inputExpression, true);
                }} 
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputExpression}
                    onChange={(e) => setInputExpression(e.target.value)}
                    placeholder="Enter infix expression, e.g. (A + B) * C"
                    className="w-full px-4 py-3.5 bg-slate-950 border border-slate-700/80 rounded-xl font-mono text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
                  />
                  {inputExpression && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="absolute right-3 top-3.5 text-xs text-slate-500 hover:text-slate-300 px-2 py-0.5 rounded bg-slate-800"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 flex items-center justify-center gap-2 transition-all"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Convert</span>
                </button>
              </form>

              {/* Validation Error Alert */}
              {validationError && (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-200 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in duration-200">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <strong className="font-semibold text-rose-300">Invalid Expression Syntax</strong>
                    <span>{validationError}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Results Card */}
            {result && (
              <>
                <ResultCard result={result} />

                {/* 6-Phase Pipeline Viewer */}
                <PipelineViewer 
                  pipeline={result.pipeline} 
                  activeStage={currentStep?.stageNumber || 4}
                />

                {/* Token Ribbon Stream */}
                <TokenRibbon
                  tokens={result.tokens}
                  currentStepIndex={currentStepIndex}
                  currentTokenValue={currentStep?.currentToken}
                />

                {/* Interactive Visualization Dual-Column */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  {/* Left Column: Animated Stack Beaker (5 Cols) */}
                  <div className="lg:col-span-5 flex flex-col">
                    <StackVisualizer
                      stackSnapshot={currentStep?.stackSnapshot || []}
                      actionType={currentStep?.actionType || 'none'}
                      maxStackSize={result.stats.maxStackSize}
                      totalPushes={result.stats.pushes}
                      totalPops={result.stats.pops}
                    />
                  </div>

                  {/* Right Column: Step Explanation & Reasoning (7 Cols) */}
                  <div className="lg:col-span-7 flex flex-col">
                    <OperationPanel
                      currentStep={currentStep}
                      totalSteps={result.steps.length}
                    />
                  </div>
                </div>

                {/* Time-Machine Playback Controls */}
                <PlaybackControls
                  currentStepIndex={currentStepIndex}
                  totalSteps={result.steps.length}
                  isPlaying={isPlaying}
                  speed={playbackSpeed}
                  onPlayPause={() => setIsPlaying(!isPlaying)}
                  onStepNext={() => setCurrentStepIndex((p) => Math.min(result.steps.length - 1, p + 1))}
                  onStepPrev={() => setCurrentStepIndex((p) => Math.max(0, p - 1))}
                  onStepFirst={() => setCurrentStepIndex(0)}
                  onStepLast={() => setCurrentStepIndex(result.steps.length - 1)}
                  onReset={() => {
                    setIsPlaying(false);
                    setCurrentStepIndex(0);
                  }}
                  onSpeedChange={(spd) => setPlaybackSpeed(spd)}
                  onSeek={(idx) => {
                    setIsPlaying(false);
                    setCurrentStepIndex(idx);
                  }}
                />

                {/* Trace Matrix Step Table */}
                <StepTable
                  steps={result.steps}
                  currentStepIndex={currentStepIndex}
                  onSelectStep={(idx) => {
                    setIsPlaying(false);
                    setCurrentStepIndex(idx);
                  }}
                />
              </>
            )}
          </div>
        )}

        {/* Tab 2: What-If Comparison */}
        {activeTab === 'whatif' && <WhatIfView />}

        {/* Tab 3: Practice Arena */}
        {activeTab === 'practice' && <PracticeView />}

        {/* Tab 4: DSA Concept Quiz */}
        {activeTab === 'quiz' && <QuizView />}

        {/* Tab 5: Theory, Pseudocode, & Complexity */}
        {activeTab === 'learn' && <LearnView />}

        {/* Tab 6: About & Author */}
        {activeTab === 'about' && <AboutView />}
      </main>

      {/* History Slide-Over Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={(item) => {
          setInputExpression(item.infix);
          handleConvert(item.infix, false);
          setIsHistoryOpen(false);
          setActiveTab('converter');
        }}
        onDelete={(id) => setHistory((prev) => prev.filter((i) => i.id !== id))}
        onClear={() => setHistory([])}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Interactive Infix-to-Prefix DSA Lab</span>
            <span>&bull;</span>
            <span>Stack-Based Expression Evaluation</span>
          </div>
          <div>
            Built by <strong className="text-slate-300">Shreyas Khakal</strong> &bull; MIT License
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
