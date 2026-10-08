import { useState, useEffect, useRef, useMemo } from 'react';
import { AlertCircle, Zap, CheckCircle2 } from 'lucide-react';
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
import { Tokenizer } from './algorithms/tokenizer';
import type { ConversionResult, HistoryItem } from './types';

const INITIAL_EXPRESSION = 'A + B * C';

const STITCH_PRESETS = [
  { label: 'Basic Math', expr: 'A + B * C' },
  { label: 'Nested Parentheses', expr: '(A + B) * (C - D)' },
  { label: 'Power / Exponent', expr: 'A ^ B ^ C' },
  { label: 'Unary Operators', expr: '-A + B' },
  { label: 'Implicit Multiplication', expr: '2(A + B)' },
  { label: 'Complex Expression', expr: 'A + B * (C ^ D - E) - F' },
];

function createHistoryItem(res: ConversionResult): HistoryItem {
  const ts = Date.now();
  return {
    id: `${ts}-${Math.random().toString(36).substring(2, 6)}`,
    infix: res.infix,
    prefix: res.prefix,
    postfix: res.postfix,
    timestamp: ts,
    stepCount: res.stats.totalSteps,
  };
}

export function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('dsa_theme');
      return (saved as 'dark' | 'light') || 'dark';
    } catch {
      return 'dark';
    }
  });

  const [activeTab, setActiveTab] = useState('converter');
  const [inputExpression, setInputExpression] = useState(INITIAL_EXPRESSION);
  const [result, setResult] = useState<ConversionResult | null>(() => {
    try {
      return InfixToPrefixConverter.convert(INITIAL_EXPRESSION);
    } catch {
      return null;
    }
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  // Time-machine playback state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(800); // ms per step

  // History & drawer
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('dsa_conversion_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Timer reference for auto-play
  const playTimerRef = useRef<number | null>(null);

  // Conversion handler
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
        const newItem = createHistoryItem(res);
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

  // Apply theme class to documentElement
  useEffect(() => {
    try {
      localStorage.setItem('dsa_theme', theme);
    } catch {
      // Storage unavailable fallback
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dsa_conversion_history', JSON.stringify(history));
    } catch {
      // Storage unavailable fallback
    }
  }, [history]);


  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      if (activeTab !== 'converter' || !result) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIndex((p) => Math.min(result.steps.length - 1, p + 1));
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIndex((p) => Math.max(0, p - 1));
      } else if (e.code === 'Home') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIndex(0);
      } else if (e.code === 'End') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIndex(result.steps.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, result]);

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

  const liveValidation = useMemo(() => {
    if (!inputExpression.trim()) return null;
    return ExpressionValidator.validate(inputExpression);
  }, [inputExpression]);

  const liveTokenCount = useMemo(() => {
    if (!inputExpression.trim()) return 0;
    try {
      return Tokenizer.tokenize(inputExpression).length;
    } catch {
      return 0;
    }
  }, [inputExpression]);

  const currentStep = result && result.steps[currentStepIndex] ? result.steps[currentStepIndex] : undefined;

  return (
    <div className="min-h-screen bg-[#09090B] text-[#F8FAFC] flex flex-col font-sans transition-colors">
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
            {/* Stitch Expression Workspace Section */}
            <div className="bg-[#111318] rounded-lg border border-[#27272A] p-5 sm:p-6 shadow-xl flex flex-col gap-4 text-[#F8FAFC]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-[#27272A]">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC] flex items-center gap-2">
                    <span>AlgoConvert Expression Visualizer</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold bg-[#6366F1]/15 text-[#C0C1FF] border border-[#6366F1]/30">
                      SHUNTING-YARD LAB
                    </span>
                  </h1>
                  <p className="text-[11px] text-[#71717A] mt-0.5 font-mono">
                    Deterministic Infix → Prefix & Postfix transformation engine with real-time stack automata.
                  </p>
                </div>

                <div className="text-[10px] text-[#71717A] font-mono hidden sm:block">
                  ALGORITHMIC_PRECISION_MATRIX
                </div>
              </div>

              {/* Preset Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <span className="text-[10px] font-mono text-[#71717A] uppercase font-semibold whitespace-nowrap">
                  PRESETS:
                </span>
                {STITCH_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => loadExample(preset.expr)}
                    className="px-2.5 py-1 rounded text-xs font-mono bg-[#18181B] hover:bg-[#201F22] text-[#F8FAFC] border border-[#27272A] hover:border-[#3F3F46] transition-colors whitespace-nowrap flex items-center gap-1.5"
                  >
                    <span>{preset.label}</span>
                    <span className="text-[10px] text-[#71717A]">({preset.expr})</span>
                  </button>
                ))}
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
                    placeholder="Enter infix expression, e.g. (A + B) * C or A ^ B ^ C"
                    className="w-full px-4 py-3 bg-[#09090B] border border-[#27272A] rounded font-mono text-base text-[#F8FAFC] placeholder-[#71717A] focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/40 transition-all shadow-inner"
                  />
                  {inputExpression && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="absolute right-3 top-3 text-[11px] font-mono text-[#71717A] hover:text-[#F8FAFC] px-2 py-0.5 rounded bg-[#18181B] border border-[#27272A]"
                    >
                      CLEAR
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded bg-[#6366F1] hover:bg-[#4F46E5] text-white font-mono font-bold text-xs shadow-[0_0_12px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2 transition-all border-t border-white/20 whitespace-nowrap"
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>CONVERT & RUN</span>
                </button>
              </form>

              {/* Real-time Syntax & Token Banner */}
              <div className="pt-1">
                {liveValidation?.isValid ? (
                  <div className="flex items-center gap-2 text-xs font-mono text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/25 px-3 py-1.5 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                    <span>✓ Valid expression &bull; {liveTokenCount} tokens &bull; {inputExpression.length} characters</span>
                  </div>
                ) : liveValidation && !liveValidation.isValid ? (
                  <div className="flex items-center gap-2 text-xs font-mono text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/25 px-3 py-1.5 rounded">
                    <AlertCircle className="w-3.5 h-3.5 text-[#EF4444] shrink-0" />
                    <span>⚠ {liveValidation.error}</span>
                  </div>
                ) : (
                  <div className="text-[11px] font-mono text-[#71717A] px-1">
                    READY: Enter an infix expression or select a preset chip above
                  </div>
                )}
              </div>

              {/* Validation Error Alert on submit */}
              {validationError && (
                <div className="p-3.5 rounded bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#FCA5A5] text-xs font-mono flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <strong className="font-semibold text-[#EF4444]">SYNTAX_ERROR:</strong>
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
      <footer className="w-full border-t border-[#27272A] bg-[#09090B] py-6 text-center text-xs text-[#71717A] mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#F8FAFC]">AlgoConvert &bull; DSA Expression Visualizer</span>
            <span>&bull;</span>
            <span>SHUNING-YARD LIFO AUTOMATON</span>
          </div>
          <div>
            Crafted by <strong className="text-[#C0C1FF]">Shreyas Khakal</strong> &bull; MIT License
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
