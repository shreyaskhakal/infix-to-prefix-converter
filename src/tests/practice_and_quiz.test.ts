import { describe, it, expect } from 'vitest';
import { PracticeGenerator } from '../algorithms/practiceGenerator';
import { InfixToPrefixConverter } from '../algorithms/converter';
import { PRACTICE_CHALLENGES, QUIZ_QUESTIONS } from '../data/constants';

describe('Practice Generator and Practice Challenges Suite', () => {
  it('dynamically generates valid Easy challenges', () => {
    for (let i = 0; i < 5; i++) {
      const challenge = PracticeGenerator.generate('Easy');
      expect(challenge.difficulty).toBe('Easy');
      expect(challenge.expression.length).toBeGreaterThan(0);
      expect(challenge.expectedPrefix).toBeDefined();

      // Verify the generated expression evaluates successfully
      const verified = InfixToPrefixConverter.convert(challenge.expression);
      expect(verified.isValid).toBe(true);
      expect(verified.prefix).toBe(challenge.expectedPrefix);
    }
  });

  it('dynamically generates valid Medium challenges', () => {
    for (let i = 0; i < 5; i++) {
      const challenge = PracticeGenerator.generate('Medium');
      expect(challenge.difficulty).toBe('Medium');
      const verified = InfixToPrefixConverter.convert(challenge.expression);
      expect(verified.isValid).toBe(true);
      expect(verified.prefix).toBe(challenge.expectedPrefix);
    }
  });

  it('dynamically generates valid Hard challenges', () => {
    for (let i = 0; i < 5; i++) {
      const challenge = PracticeGenerator.generate('Hard');
      expect(challenge.difficulty).toBe('Hard');
      const verified = InfixToPrefixConverter.convert(challenge.expression);
      expect(verified.isValid).toBe(true);
      expect(verified.prefix).toBe(challenge.expectedPrefix);
    }
  });

  it('dynamically generates valid Expert challenges', () => {
    for (let i = 0; i < 5; i++) {
      const challenge = PracticeGenerator.generate('Expert');
      expect(challenge.difficulty).toBe('Expert');
      const verified = InfixToPrefixConverter.convert(challenge.expression);
      expect(verified.isValid).toBe(true);
      expect(verified.prefix).toBe(challenge.expectedPrefix);
    }
  });

  it('verifies all static practice challenges in constants.ts evaluate to their expected prefix', () => {
    expect(PRACTICE_CHALLENGES.length).toBeGreaterThanOrEqual(15);
    for (const challenge of PRACTICE_CHALLENGES) {
      const expr = challenge.infix || challenge.expression;
      const res = InfixToPrefixConverter.convert(expr);
      expect(res.isValid).toBe(true);
      expect(res.prefix.replace(/\s+/g, '')).toBe(challenge.expectedPrefix?.replace(/\s+/g, ''));
    }
  });
});

describe('DSA Quiz Question Quality & Structural Integrity Suite', () => {
  it('contains at least 50 comprehensive quiz questions', () => {
    expect(QUIZ_QUESTIONS.length).toBeGreaterThanOrEqual(50);
  });

  it('ensures every quiz question has valid structure, options, and explanation', () => {
    for (const q of QUIZ_QUESTIONS) {
      expect(q.id).toBeDefined();
      expect(q.question.trim().length).toBeGreaterThan(10);
      expect(q.options.length).toBeGreaterThanOrEqual(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options.length);
      expect(q.explanation.trim().length).toBeGreaterThan(15);
      expect(q.category.trim().length).toBeGreaterThan(3);
    }
  });

  it('covers all mandatory syllabus topics across quiz questions', () => {
    const allCategories = new Set(QUIZ_QUESTIONS.map((q) => q.category));
    expect(allCategories.size).toBeGreaterThanOrEqual(5);
    const textAll = QUIZ_QUESTIONS.map((q) => q.question + ' ' + q.explanation).join(' ').toLowerCase();

    // Verify key concepts are thoroughly covered
    expect(textAll).toContain('stack');
    expect(textAll).toContain('lifo');
    expect(textAll).toContain('precedence');
    expect(textAll).toContain('associativity');
    expect(textAll).toContain('prefix');
    expect(textAll).toContain('postfix');
    expect(textAll).toContain('parenthes');
    expect(textAll).toContain('complexity');
    expect(textAll).toContain('token');
    expect(textAll).toContain('unary');
  });

  it('has unique IDs for all quiz questions', () => {
    const ids = new Set(QUIZ_QUESTIONS.map((q) => q.id));
    expect(ids.size).toBe(QUIZ_QUESTIONS.length);
  });
});
