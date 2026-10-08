import React, { useState, useEffect } from 'react';
import { Compass, CheckCircle2, XCircle, ArrowRight, RotateCcw, Lightbulb, Sparkles, Flame } from 'lucide-react';
import { PRACTICE_CHALLENGES } from '../data/constants';
import { PracticeGenerator } from '../algorithms/practiceGenerator';
import type { PracticeChallenge, PracticeDifficulty } from '../types';

export const PracticeView: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [customChallenge, setCustomChallenge] = useState<PracticeChallenge | null>(null);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const [score, setScore] = useState<{ attempted: number; correct: number; streak: number; maxStreak: number }>(() => {
    try {
      const saved = localStorage.getItem('dsa_practice_score');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          attempted: Number(parsed.attempted) || 0,
          correct: Number(parsed.correct) || 0,
          streak: Number(parsed.streak) || 0,
          maxStreak: Number(parsed.maxStreak) || 0,
        };
      }
    } catch {
      // Safe fallback
    }
    return { attempted: 0, correct: 0, streak: 0, maxStreak: 0 };
  });

  const availableChallenges = PRACTICE_CHALLENGES.filter((c) => {
    if (selectedDifficulty === 'All') return true;
    return c.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
  });

  const challenge: PracticeChallenge =
    customChallenge ||
    availableChallenges[challengeIndex % Math.max(1, availableChallenges.length)] ||
    PRACTICE_CHALLENGES[0];

  const targetInfix = challenge.infix || challenge.expression;
  const expectedPrefix = challenge.expectedPrefix || '';

  useEffect(() => {
    try {
      localStorage.setItem('dsa_practice_score', JSON.stringify(score));
    } catch {
      // Safe fallback
    }
  }, [score]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim() || isSubmitted) return;

    // Clean user answer (remove spaces)
    const cleanUser = userAnswer.replace(/\s+/g, '');
    const cleanExpected = expectedPrefix.replace(/\s+/g, '');

    const correct = cleanUser.toUpperCase() === cleanExpected.toUpperCase();
    setIsCorrect(correct);
    setIsSubmitted(true);

    setScore((prev) => {
      const newStreak = correct ? prev.streak + 1 : 0;
      return {
        attempted: prev.attempted + 1,
        correct: correct ? prev.correct + 1 : prev.correct,
        streak: newStreak,
        maxStreak: Math.max(prev.maxStreak, newStreak),
      };
    });
  };

  const handleNext = () => {
    setUserAnswer('');
    setIsSubmitted(false);
    setIsCorrect(false);
    setCustomChallenge(null);
    setChallengeIndex((prev) => (prev + 1) % Math.max(1, availableChallenges.length));
  };

  const handleGenerateRandom = () => {
    const diff: PracticeDifficulty =
      selectedDifficulty === 'All' ? 'Medium' : (selectedDifficulty as PracticeDifficulty);
    const newChallenge = PracticeGenerator.generate(diff);
    setCustomChallenge(newChallenge);
    setUserAnswer('');
    setIsSubmitted(false);
    setIsCorrect(false);
  };

  const resetStats = () => {
    setScore({ attempted: 0, correct: 0, streak: 0, maxStreak: 0 });
  };

  const accuracy = score.attempted > 0 ? Math.round((score.correct / score.attempted) * 100) : 0;
  const diffLower = challenge.difficulty.toLowerCase();

  const getDifficultyBadge = () => {
    if (diffLower === 'easy' || diffLower === 'beginner') {
      return 'bg-emerald-950 text-emerald-400 border-emerald-800';
    }
    if (diffLower === 'medium' || diffLower === 'intermediate') {
      return 'bg-amber-950 text-amber-400 border-amber-800';
    }
    if (diffLower === 'hard' || diffLower === 'advanced') {
      return 'bg-rose-950 text-rose-400 border-rose-800';
    }
    return 'bg-purple-950 text-purple-400 border-purple-800';
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 p-4 text-[#F8FAFC]">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#10B981]/15 text-[#10B981] flex items-center justify-center border border-[#10B981]/30">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-[#F8FAFC]">Interactive Practice Arena</h2>
          </div>
          <p className="text-xs text-[#71717A] mt-1 font-mono">
            MANUAL STACK PREDICTION &bull; DYNAMIC CHALLENGE SUITE
          </p>
        </div>

        {/* Scorecard */}
        <div className="flex items-center gap-3 bg-[#09090B] border border-[#27272A] p-2.5 rounded text-xs font-mono">
          <div>
            <span className="text-[#71717A]">SOLVED: </span>
            <strong className="text-[#10B981]">{score.correct}/{score.attempted}</strong>
          </div>
          <div className="w-px h-4 bg-[#27272A]" />
          <div>
            <span className="text-[#71717A]">ACCURACY: </span>
            <strong className="text-[#C0C1FF]">{accuracy}%</strong>
          </div>
          <div className="w-px h-4 bg-[#27272A]" />
          <div className="flex items-center gap-1 text-[#F59E0B] font-bold" title="Current streak">
            <Flame className="w-3.5 h-3.5 fill-[#F59E0B]" />
            <span>{score.streak}</span>
          </div>
          <button
            onClick={resetStats}
            title="Reset Score"
            className="p-1 rounded text-[#71717A] hover:text-[#F8FAFC]"
            aria-label="Reset practice stats"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Difficulty Tabs & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-[#09090B] p-1 rounded border border-[#27272A]">
          {['All', 'Easy', 'Medium', 'Hard', 'Expert'].map((diff) => (
            <button
              key={diff}
              onClick={() => {
                setSelectedDifficulty(diff);
                setCustomChallenge(null);
                setChallengeIndex(0);
                setUserAnswer('');
                setIsSubmitted(false);
              }}
              className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                selectedDifficulty === diff
                  ? 'bg-[#18181B] text-[#C0C1FF] border border-[#6366F1]/50 shadow-[0_0_8px_rgba(99,102,241,0.2)]'
                  : 'text-[#71717A] hover:text-[#F8FAFC]'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        <button
          onClick={handleGenerateRandom}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold bg-[#18181B] border border-[#6366F1]/40 text-[#C0C1FF] hover:bg-[#201F22] transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" />
          <span>GENERATE_DYNAMIC_EXPR</span>
        </button>
      </div>

      {/* Challenge Card */}
      <div className="bg-[#111318] rounded-lg border border-[#27272A] p-6 flex flex-col gap-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-[#18181B] text-[#C0C1FF] border border-[#27272A]">
              {customChallenge ? 'Dynamic Generated' : `Challenge ${(challengeIndex % Math.max(1, availableChallenges.length)) + 1} of ${availableChallenges.length}`}
            </span>
            <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded uppercase border ${getDifficultyBadge()}`}>
              {challenge.difficulty}
            </span>
          </div>
        </div>

        {/* Infix Expression Banner */}
        <div className="flex flex-col items-center justify-center p-6 bg-[#09090B] rounded border border-[#27272A] text-center">
          <span className="text-[10px] text-[#71717A] font-mono uppercase font-semibold mb-1">TARGET_INFIX_EXPRESSION</span>
          <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-wider">
            {targetInfix}
          </span>
        </div>

        {/* User Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="text-xs text-[#71717A] font-mono">
            PREDICTED_PREFIX_NOTATION:
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isSubmitted}
              placeholder="e.g. +A*BC or + A * B C"
              className="flex-1 px-4 py-3 bg-[#09090B] border border-[#27272A] rounded font-mono text-base text-[#F8FAFC] focus:outline-none focus:border-[#6366F1] disabled:opacity-60 transition-colors uppercase"
            />

            {!isSubmitted ? (
              <button
                type="submit"
                disabled={!userAnswer.trim()}
                className="px-6 py-3 rounded bg-[#6366F1] hover:bg-[#4F46E5] text-white font-mono font-bold text-xs shadow-[0_0_12px_rgba(99,102,241,0.3)] transition-all disabled:opacity-40 border-t border-white/20"
              >
                SUBMIT ANSWER
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 rounded bg-[#10B981] hover:bg-[#059669] text-white font-mono font-bold text-xs shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 border-t border-white/20"
              >
                <span>NEXT CHALLENGE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Result & Explanation Feedback */}
        {isSubmitted && (
          <div className={`p-5 rounded border flex flex-col gap-3 animate-in fade-in duration-300 ${
            isCorrect 
              ? 'bg-[#10B981]/10 border-[#10B981]/40 text-[#6EE7B7]' 
              : 'bg-[#EF4444]/10 border-[#EF4444]/40 text-[#FCA5A5]'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm font-mono">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                  <span>SPOT ON! PERFECT PREDICTION.</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-[#EF4444]" />
                  <span>INCORRECT. INSPECT STACK REASONING:</span>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono bg-[#09090B] p-3 rounded border border-[#27272A]">
              <div>
                <span className="text-[#71717A]">YOUR_ANSWER: </span>
                <span className={isCorrect ? 'text-[#10B981] font-bold' : 'text-[#EF4444] line-through'}>{userAnswer}</span>
              </div>
              <div>
                <span className="text-[#71717A]">EXPECTED_PREFIX: </span>
                <span className="text-[#C0C1FF] font-bold">{expectedPrefix}</span>
              </div>
            </div>

            {challenge.hint && (
              <div className="text-xs text-[#F8FAFC] flex items-start gap-2 pt-1 font-mono">
                <Lightbulb className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                <span><strong className="text-[#F59E0B]">RULE:</strong> {challenge.hint}</span>
              </div>
            )}

            {challenge.explanation && (
              <div className="text-xs text-[#F8FAFC] pt-1 border-t border-[#27272A] font-mono">
                <strong className="text-[#06B6D4]">EXPLANATION: </strong>
                <span>{challenge.explanation}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

