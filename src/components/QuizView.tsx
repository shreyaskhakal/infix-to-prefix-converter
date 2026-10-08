import React, { useState, useMemo } from 'react';
import { GraduationCap, CheckCircle2, XCircle, RotateCcw, ArrowRight, Award, Shuffle } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/constants';
import type { QuizQuestion } from '../types';

export const QuizView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [quizLength, setQuizLength] = useState<number>(10);
  const [shuffleSeed, setShuffleSeed] = useState<number>(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    QUIZ_QUESTIONS.forEach((q) => set.add(q.category));
    return ['All', ...Array.from(set)];
  }, []);

  // Filtered & Shuffled questions
  const activeQuestions: QuizQuestion[] = useMemo(() => {
    let pool = QUIZ_QUESTIONS;
    if (selectedCategory !== 'All') {
      pool = pool.filter((q) => q.category === selectedCategory);
    }
    // Simple deterministic pseudo-shuffle based on seed
    const shuffled = [...pool].sort((a, b) => {
      const hashA = (a.id.charCodeAt(1) || 0) * shuffleSeed;
      const hashB = (b.id.charCodeAt(1) || 0) * shuffleSeed;
      return (hashA % 17) - (hashB % 17);
    });

    return quizLength >= shuffled.length ? shuffled : shuffled.slice(0, quizLength);
  }, [selectedCategory, quizLength, shuffleSeed]);

  const question: QuizQuestion = activeQuestions[currentQuestionIndex] || activeQuestions[0] || QUIZ_QUESTIONS[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === question.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex + 1 < activeQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    setShuffleSeed((prev) => prev + 1);
  };

  if (isFinished) {
    const totalQ = Math.max(1, activeQuestions.length);
    const percentage = Math.round((score / totalQ) * 100);
    return (
      <div className="max-w-2xl mx-auto p-6 bg-slate-900/60 rounded-2xl border border-slate-800 text-center flex flex-col items-center gap-5 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
          <Award className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-100">Quiz Completed!</h2>
          <p className="text-xs text-slate-400 mt-1">
            Data Structures & Expression Evaluation Proficiency
          </p>
        </div>

        <div className="bg-slate-950/80 px-8 py-6 rounded-2xl border border-slate-800 flex flex-col items-center gap-1">
          <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            {score} / {totalQ}
          </div>
          <div className="text-xs text-slate-400 font-medium">Final Score ({percentage}%)</div>
        </div>

        <p className="text-xs text-slate-300 max-w-md">
          {percentage >= 80
            ? 'Outstanding! You have mastered the stack mechanics, precedence tables, unary operations, and token reversal algorithms.'
            : percentage >= 50
            ? 'Good work! Review the pseudocode and theory tab to solidify edge cases like right-associative exponentiation and unary operators.'
            : 'Keep practicing! Review the step-by-step visualizer and theory section.'}
        </p>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Retake Quiz
        </button>
      </div>
    );
  }

  const progressPercent = Math.round(((currentQuestionIndex + 1) / Math.max(1, activeQuestions.length)) * 100);

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-5 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">DSA Concept Quiz</h2>
            <p className="text-xs text-slate-400">Mastery questions on stacks, precedence, LIFO, and notations</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-slate-300">
            Question {currentQuestionIndex + 1} of {activeQuestions.length}
          </span>
          <button
            onClick={handleReset}
            title="Shuffle & Restart"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            aria-label="Restart quiz"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mode & Category Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
          <span className="text-slate-500 font-medium shrink-0">Category:</span>
          {categories.slice(0, 5).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentQuestionIndex(0);
                setSelectedOption(null);
                setIsAnswered(false);
                setScore(0);
              }}
              className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 shrink-0 font-mono">
          <span className="text-slate-500 font-medium">Questions:</span>
          {[10, 25, 52].map((cnt) => (
            <button
              key={cnt}
              onClick={() => {
                setQuizLength(cnt);
                setCurrentQuestionIndex(0);
                setSelectedOption(null);
                setIsAnswered(false);
                setScore(0);
              }}
              className={`px-2 py-0.5 rounded text-[11px] ${
                quizLength === cnt
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              {cnt}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 flex flex-col gap-5 shadow-xl">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 font-mono">
            {question.category}
          </span>
          {question.difficulty && (
            <span className="font-semibold text-indigo-400">{question.difficulty}</span>
          )}
        </div>

        <div className="text-base font-semibold text-slate-100 leading-snug">
          {question.question}
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2.5">
          {question.options.map((opt, idx) => {
            const isChosen = selectedOption === idx;
            const isCorrect = idx === question.correctIndex;

            let btnStyle = 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700';

            if (isAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-950/50 border-emerald-600 text-emerald-200';
              } else if (isChosen) {
                btnStyle = 'bg-rose-950/50 border-rose-600 text-rose-200';
              } else {
                btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium flex items-center justify-between transition-all ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-black/40 flex items-center justify-center text-xs font-mono font-bold text-slate-400">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>

                {isAnswered && (
                  <div>
                    {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    {isChosen && !isCorrect && <XCircle className="w-5 h-5 text-rose-400" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation & Next */}
        {isAnswered && (
          <div className="mt-2 p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col gap-3 animate-in fade-in">
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-indigo-400">Explanation: </strong>
              {question.explanation}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800/80">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all"
              >
                <span>{currentQuestionIndex + 1 === activeQuestions.length ? 'View Results' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

