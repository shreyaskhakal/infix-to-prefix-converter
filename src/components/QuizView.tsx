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
      <div className="max-w-2xl mx-auto p-6 bg-[#111318] rounded-lg border border-[#27272A] text-center flex flex-col items-center gap-5 shadow-2xl text-[#F8FAFC]">
        <div className="w-16 h-16 rounded bg-[#6366F1]/15 text-[#C0C1FF] flex items-center justify-center border border-[#6366F1]/30">
          <Award className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#F8FAFC]">Quiz Completed!</h2>
          <p className="text-xs text-[#71717A] mt-1 font-mono">
            DSA STACK & EXPRESSION PARSING ASSESSMENT
          </p>
        </div>

        <div className="bg-[#09090B] px-8 py-6 rounded border border-[#27272A] flex flex-col items-center gap-1 font-mono">
          <div className="text-4xl font-extrabold text-[#06B6D4]">
            {score} / {totalQ}
          </div>
          <div className="text-xs text-[#71717A]">FINAL SCORE: {percentage}%</div>
        </div>

        <p className="text-xs text-[#71717A] max-w-md font-mono">
          {percentage >= 80
            ? 'Outstanding! You have mastered stack mechanics, precedence tables, unary operations, and token reversal algorithms.'
            : percentage >= 50
            ? 'Good work! Review the pseudocode and theory tab to solidify edge cases like right-associative exponentiation and unary operators.'
            : 'Keep practicing! Review the step-by-step visualizer and theory section.'}
        </p>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-2.5 rounded bg-[#6366F1] hover:bg-[#4F46E5] text-white font-mono font-bold text-xs shadow-[0_0_12px_rgba(99,102,241,0.3)] transition-colors border-t border-white/20"
        >
          <RotateCcw className="w-4 h-4" />
          <span>RETAKE QUIZ</span>
        </button>
      </div>
    );
  }

  const progressPercent = Math.round(((currentQuestionIndex + 1) / Math.max(1, activeQuestions.length)) * 100);

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-5 p-4 text-[#F8FAFC]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#27272A]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#6366F1]/15 text-[#C0C1FF] flex items-center justify-center border border-[#6366F1]/30">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#F8FAFC]">DSA Concept Quiz</h2>
            <p className="text-xs text-[#71717A] font-mono">CURATED 52-QUESTION BANK ON LIFO AUTOMATA & NOTATIONS</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded bg-[#18181B] text-[#71717A] border border-[#27272A]">
            QUESTION <strong className="text-[#06B6D4]">{currentQuestionIndex + 1}</strong> / {activeQuestions.length}
          </span>
          <button
            onClick={handleReset}
            title="Shuffle & Restart"
            className="p-1.5 rounded text-[#71717A] hover:text-[#F8FAFC] hover:bg-[#18181B] border border-transparent hover:border-[#27272A] transition-colors"
            aria-label="Restart quiz"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mode & Category Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#111318] p-2.5 rounded border border-[#27272A] text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
          <span className="text-[#71717A] font-mono text-[11px] shrink-0">CATEGORY:</span>
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
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#18181B] text-[#C0C1FF] border border-[#6366F1]/50 shadow-[0_0_8px_rgba(99,102,241,0.2)]'
                  : 'text-[#71717A] hover:text-[#F8FAFC]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 shrink-0 font-mono">
          <span className="text-[#71717A] text-[11px]">POOL:</span>
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
                  ? 'bg-[#6366F1] text-white font-bold'
                  : 'text-[#71717A] hover:bg-[#18181B]'
              }`}
            >
              {cnt}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#18181B] rounded h-1.5 overflow-hidden border border-[#27272A]">
        <div
          className="bg-[#06B6D4] h-1.5 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-[#111318] rounded-lg border border-[#27272A] p-6 flex flex-col gap-5 shadow-xl">
        <div className="flex items-center justify-between text-xs text-[#71717A]">
          <span className="px-2 py-0.5 rounded bg-[#09090B] border border-[#27272A] font-mono text-[#C0C1FF]">
            {question.category}
          </span>
          {question.difficulty && (
            <span className="font-mono text-[#06B6D4] font-semibold">{question.difficulty}</span>
          )}
        </div>

        <div className="text-base font-semibold text-[#F8FAFC] leading-snug">
          {question.question}
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2.5">
          {question.options.map((opt, idx) => {
            const isChosen = selectedOption === idx;
            const isCorrect = idx === question.correctIndex;

            let btnStyle = 'bg-[#09090B] border-[#27272A] text-[#F8FAFC] hover:bg-[#18181B] hover:border-[#3F3F46]';

            if (isAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-[#10B981]/15 border-[#10B981] text-[#6EE7B7] shadow-[0_0_10px_rgba(16,185,129,0.25)]';
              } else if (isChosen) {
                btnStyle = 'bg-[#EF4444]/15 border-[#EF4444] text-[#FCA5A5]';
              } else {
                btnStyle = 'bg-[#09090B]/60 border-[#27272A] text-[#71717A] opacity-50';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`w-full p-4 rounded border text-left text-xs sm:text-sm font-mono flex items-center justify-between transition-all ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded bg-[#18181B] border border-[#27272A] flex items-center justify-center text-xs font-mono font-bold text-[#71717A]">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>

                {isAnswered && (
                  <div>
                    {isCorrect && <CheckCircle2 className="w-5 h-5 text-[#10B981]" />}
                    {isChosen && !isCorrect && <XCircle className="w-5 h-5 text-[#EF4444]" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation & Next */}
        {isAnswered && (
          <div className="mt-2 p-4 rounded bg-[#09090B] border border-[#27272A] flex flex-col gap-3 animate-in fade-in">
            <div className="text-xs text-[#F8FAFC] leading-relaxed font-mono">
              <strong className="text-[#06B6D4]">EXPLANATION: </strong>
              {question.explanation}
            </div>

            <div className="flex justify-end pt-2 border-t border-[#27272A]">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2 rounded bg-[#6366F1] hover:bg-[#4F46E5] text-white font-mono font-bold text-xs shadow-[0_0_12px_rgba(99,102,241,0.3)] transition-all border-t border-white/20"
              >
                <span>{currentQuestionIndex + 1 === activeQuestions.length ? 'VIEW RESULTS' : 'NEXT QUESTION'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

