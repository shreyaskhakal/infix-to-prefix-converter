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
    <div className="max-w-4xl mx-auto flex flex-col gap-6 p-4">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-100">Interactive Practice Arena</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Predict the prefix output for each expression and sharpen your manual stack tracing intuition.
          </p>
        </div>

        {/* Scorecard */}
        <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl text-xs font-mono">
          <div>
            <span className="text-slate-400">Solved: </span>
            <strong className="text-emerald-400">{score.correct}/{score.attempted}</strong>
          </div>
          <div className="w-px h-4 bg-slate-800" />
          <div>
            <span className="text-slate-400">Accuracy: </span>
            <strong className="text-indigo-400">{accuracy}%</strong>
          </div>
          <div className="w-px h-4 bg-slate-800" />
          <div className="flex items-center gap-1 text-amber-400 font-bold" title="Current streak">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>{score.streak}</span>
          </div>
          <button
            onClick={resetStats}
            title="Reset Score"
            className="p-1 rounded text-slate-500 hover:text-slate-300"
            aria-label="Reset practice stats"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Difficulty Tabs & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
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
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedDifficulty === diff
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        <button
          onClick={handleGenerateRandom}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-950/70 border border-indigo-800 text-indigo-300 hover:bg-indigo-900/60 transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generate Random Expression</span>
        </button>
      </div>

      {/* Challenge Card */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 flex flex-col gap-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
              {customChallenge ? 'Dynamic Generated' : `Challenge ${(challengeIndex % Math.max(1, availableChallenges.length)) + 1} of ${availableChallenges.length}`}
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase border ${getDifficultyBadge()}`}>
              {challenge.difficulty}
            </span>
          </div>
        </div>

        {/* Infix Expression Banner */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
          <span className="text-xs text-slate-400 font-medium mb-1">Target Infix Expression</span>
          <span className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-wider">
            {targetInfix}
          </span>
        </div>

        {/* User Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="text-xs text-slate-300 font-medium">
            Enter your predicted Prefix notation:
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isSubmitted}
              placeholder="e.g. +A*BC"
              className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl font-mono text-base text-slate-100 focus:outline-none focus:border-indigo-500 disabled:opacity-60 transition-colors uppercase"
            />

            {!isSubmitted ? (
              <button
                type="submit"
                disabled={!userAnswer.trim()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-40"
              >
                Submit Answer
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Next Challenge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Result & Explanation Feedback */}
        {isSubmitted && (
          <div className={`p-5 rounded-xl border flex flex-col gap-3 animate-in fade-in duration-300 ${
            isCorrect 
              ? 'bg-emerald-950/30 border-emerald-700 text-emerald-200' 
              : 'bg-rose-950/30 border-rose-700 text-rose-200'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Spot On! Perfect Prediction.</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-400" />
                  <span>Incorrect. Let's inspect the stack reasoning:</span>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono bg-black/40 p-3 rounded-lg border border-slate-800">
              <div>
                <span className="text-slate-400">Your Answer: </span>
                <span className={isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 line-through'}>{userAnswer}</span>
              </div>
              <div>
                <span className="text-slate-400">Expected Prefix: </span>
                <span className="text-indigo-300 font-bold">{expectedPrefix}</span>
              </div>
            </div>

            {challenge.hint && (
              <div className="text-xs text-slate-300 flex items-start gap-2 pt-1">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Key Rule:</strong> {challenge.hint}</span>
              </div>
            )}

            {challenge.explanation && (
              <div className="text-xs text-slate-300 pt-1 border-t border-slate-800/80">
                <strong className="text-indigo-400">Detailed Explanation: </strong>
                <span>{challenge.explanation}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

