import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  ChevronsLeft, 
  ChevronsRight,
  Gauge
} from 'lucide-react';

interface PlaybackControlsProps {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number; // e.g. 1000, 500, 250 ms
  onPlayPause: () => void;
  onStepNext: () => void;
  onStepPrev: () => void;
  onStepFirst: () => void;
  onStepLast: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onSeek: (stepIndex: number) => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  currentStepIndex,
  totalSteps,
  isPlaying,
  speed,
  onPlayPause,
  onStepNext,
  onStepPrev,
  onStepFirst,
  onStepLast,
  onReset,
  onSpeedChange,
  onSeek,
}) => {
  const canGoPrev = currentStepIndex > 0;
  const canGoNext = currentStepIndex < totalSteps - 1;

  const speedOptions = [
    { label: '0.5x', value: 1600 },
    { label: '1.0x', value: 800 },
    { label: '1.5x', value: 500 },
    { label: '2.0x', value: 300 },
  ];


  return (
    <div className="bg-slate-900/50 dark:bg-slate-900/80 rounded-2xl border border-slate-800 p-4 shadow-xl flex flex-col gap-3">
      {/* Timeline Scrub Slider */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-slate-400 w-12 text-right">
          {totalSteps > 0 ? currentStepIndex + 1 : 0}/{totalSteps}
        </span>

        <div className="relative flex-1 flex items-center">
          <input
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={currentStepIndex}
            onChange={(e) => onSeek(Number(e.target.value))}
            disabled={totalSteps === 0}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all disabled:opacity-40"
          />
        </div>

        <span className="text-xs font-mono text-indigo-400 w-12">
          {totalSteps > 0 ? Math.round(((currentStepIndex + 1) / totalSteps) * 100) : 0}%
        </span>
      </div>

      {/* Control Buttons Grid */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
        {/* Playback Transport Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onStepFirst}
            disabled={!canGoPrev}
            title="First Step"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:bg-slate-800/80 transition-all"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          <button
            onClick={onStepPrev}
            disabled={!canGoPrev}
            title="Previous Step"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:bg-slate-800/80 transition-all"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onPlayPause}
            disabled={totalSteps === 0}
            title={isPlaying ? 'Pause' : 'Auto Play'}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-40"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            onClick={onStepNext}
            disabled={!canGoNext}
            title="Next Step"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:bg-slate-800/80 transition-all"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={onStepLast}
            disabled={!canGoNext}
            title="Last Step"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:bg-slate-800/80 transition-all"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>

          <button
            onClick={onReset}
            disabled={totalSteps === 0}
            title="Reset to Start"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all disabled:opacity-30"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Buttons */}
        <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
          <Gauge className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
          {speedOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={() => onSpeedChange(opt.value)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                speed === opt.value
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
