import React, { useState } from 'react';
import { GraduationCap, CheckCircle2, XCircle, RotateCcw, ArrowRight, Award } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/constants';

export const QuizView: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const question = QUIZ_QUESTIONS[currentQuestionIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === question.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex + 1 < QUIZ_QUESTIONS.length) {
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
  };

  if (isFinished) {
    const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100);
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
            {score} / {QUIZ_QUESTIONS.length}
          </div>
          <div className="text-xs text-slate-400 font-medium">Final Score ({percentage}%)</div>
        </div>

        <p className="text-xs text-slate-300 max-w-md">
          {percentage >= 80
            ? 'Outstanding! You have mastered the stack mechanics, precedence tables, and token reversal algorithms.'
            : percentage >= 50
            ? 'Good work! Review the pseudocode and theory tab to solidify edge cases like right-associative exponentiation.'
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

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">DSA Concept Quiz</h2>
            <p className="text-xs text-slate-400">Test your mastery of stacks, precedence, and notation</p>
          </div>
        </div>

        <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-slate-300">
          Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}
        </span>
      </div>

      {/* Question Card */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 flex flex-col gap-5 shadow-xl">
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
                <span>{currentQuestionIndex + 1 === QUIZ_QUESTIONS.length ? 'View Results' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
