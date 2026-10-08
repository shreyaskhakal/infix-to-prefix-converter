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
    <div className="bg-[#111318] rounded-lg border border-[#27272A] p-4 shadow-xl flex flex-col gap-3 text-[#F8FAFC]">
      {/* Timeline Scrub Slider */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-[#71717A] w-14 text-right">
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
            className="w-full h-1.5 bg-[#09090B] rounded appearance-none cursor-pointer accent-[#6366F1] hover:accent-[#06B6D4] transition-all disabled:opacity-40 border border-[#27272A]"
          />
        </div>

        <span className="text-xs font-mono text-[#06B6D4] w-12">
          {totalSteps > 0 ? Math.round(((currentStepIndex + 1) / totalSteps) * 100) : 0}%
        </span>
      </div>

      {/* Control Buttons Grid */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#27272A]">
        {/* Playback Transport Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onStepFirst}
            disabled={!canGoPrev}
            title="First Step (Home)"
            className="p-2 rounded bg-[#18181B] hover:bg-[#201F22] border border-[#27272A] hover:border-[#3F3F46] text-[#F8FAFC] disabled:opacity-30 transition-all"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          <button
            onClick={onStepPrev}
            disabled={!canGoPrev}
            title="Previous Step (Left Arrow)"
            className="p-2 rounded bg-[#18181B] hover:bg-[#201F22] border border-[#27272A] hover:border-[#3F3F46] text-[#F8FAFC] disabled:opacity-30 transition-all"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onPlayPause}
            disabled={totalSteps === 0}
            title={isPlaying ? 'Pause (Space)' : 'Auto Play (Space)'}
            className="flex items-center gap-2 px-4 py-2 rounded bg-[#6366F1] hover:bg-[#4F46E5] text-white font-medium text-xs shadow-[0_0_12px_rgba(99,102,241,0.3)] transition-all disabled:opacity-40 border-t border-white/20"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-white" />
                <span className="font-mono">PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span className="font-mono">PLAY</span>
              </>
            )}
          </button>

          <button
            onClick={onStepNext}
            disabled={!canGoNext}
            title="Next Step (Right Arrow)"
            className="p-2 rounded bg-[#18181B] hover:bg-[#201F22] border border-[#27272A] hover:border-[#3F3F46] text-[#F8FAFC] disabled:opacity-30 transition-all"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={onStepLast}
            disabled={!canGoNext}
            title="Last Step (End)"
            className="p-2 rounded bg-[#18181B] hover:bg-[#201F22] border border-[#27272A] hover:border-[#3F3F46] text-[#F8FAFC] disabled:opacity-30 transition-all"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>

          <button
            onClick={onReset}
            disabled={totalSteps === 0}
            title="Reset to Start"
            className="p-2 rounded bg-[#18181B] hover:bg-[#201F22] border border-[#27272A] hover:border-[#3F3F46] text-[#71717A] hover:text-[#F8FAFC] disabled:opacity-30 transition-all ml-1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Buttons */}
        <div className="flex items-center gap-1 bg-[#09090B] p-1 rounded border border-[#27272A]">
          <Gauge className="w-3.5 h-3.5 text-[#06B6D4] ml-1.5" />
          {speedOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={() => onSpeedChange(opt.value)}
              className={`px-2 py-0.5 rounded text-xs font-mono font-medium transition-all ${
                speed === opt.value
                  ? 'bg-[#18181B] text-[#06B6D4] font-bold border border-[#06B6D4]/50 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                  : 'text-[#71717A] hover:text-[#F8FAFC]'
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
