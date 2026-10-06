import { describe, it, expect } from 'vitest';
import { InfixToPrefixConverter } from '../algorithms/converter';
import { Stack } from '../algorithms/stack';
import { Tokenizer } from '../algorithms/tokenizer';

describe('Stack Data Structure', () => {
  it('should conform to LIFO ordering and track metrics', () => {
    const stack = new Stack<string>();
    expect(stack.isEmpty()).toBe(true);
    expect(stack.size()).toBe(0);

    stack.push('A');
    stack.push('+');
    stack.push('*');

    expect(stack.size()).toBe(3);
    expect(stack.peek()).toBe('*');
    expect(stack.pop()).toBe('*');
    expect(stack.pop()).toBe('+');
    expect(stack.pop()).toBe('A');
    expect(stack.isEmpty()).toBe(true);

    const stats = stack.getStats();
    expect(stats.pushes).toBe(3);
    expect(stats.pops).toBe(3);
    expect(stats.maxStackSize).toBe(3);
  });

  it('should throw underflow errors when popping empty stack', () => {
    const stack = new Stack<number>();
    expect(() => stack.pop()).toThrow(/Stack Underflow/);
    expect(() => stack.peek()).toThrow(/Stack Underflow/);
  });
});

describe('Tokenizer and Validator', () => {
  it('should tokenize identifiers, numbers, and operators', () => {
    const tokens = Tokenizer.tokenize('total + price * 12.5');
    expect(tokens.map((t) => t.value)).toEqual(['total', '+', 'price', '*', '12.5']);
  });

  it('should handle implicit multiplication', () => {
    const tokens = Tokenizer.tokenize('A(B+C)');
    expect(tokens.map((t) => t.value)).toEqual(['A', '*', '(', 'B', '+', 'C', ')']);
  });

  it('should validate correctly and catch syntax errors', () => {
    const valid = InfixToPrefixConverter.convert('A+B*C');
    expect(valid.isValid).toBe(true);

    const consecutiveOp = InfixToPrefixConverter.convert('A++B');
    expect(consecutiveOp.isValid).toBe(false);
    expect(consecutiveOp.error?.message).toMatch(/cannot appear immediately after/);

    const unclosedParen = InfixToPrefixConverter.convert('(A+B');
    expect(unclosedParen.isValid).toBe(false);
    expect(unclosedParen.error?.message).toMatch(/missing closing/);

    const empty = InfixToPrefixConverter.convert('   ');
    expect(empty.isValid).toBe(false);
    expect(empty.error?.message).toMatch(/cannot be empty/);
  });
});

describe('Infix to Prefix Conversion Algorithm', () => {
  it('should convert basic addition A+B -> +AB', () => {
    const res = InfixToPrefixConverter.convert('A+B');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('+AB');
  });

  it('should respect precedence without parens A+B*C -> +A*BC', () => {
    const res = InfixToPrefixConverter.convert('A+B*C');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('+A*BC');
  });

  it('should respect parenthesized groups (A+B)*C -> *+ABC', () => {
    const res = InfixToPrefixConverter.convert('(A+B)*C');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('*+ABC');
  });

  it('should handle A*(B+C) -> *A+BC', () => {
    const res = InfixToPrefixConverter.convert('A*(B+C)');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('*A+BC');
  });

  it('should handle fractions (A-B)/(C+D) -> /-AB+CD', () => {
    const res = InfixToPrefixConverter.convert('(A-B)/(C+D)');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('/-AB+CD');
  });

  it('should strictly respect RIGHT associativity for A^B^C -> ^A^BC', () => {
    const res = InfixToPrefixConverter.convert('A^B^C');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('^A^BC');
  });

  it('should handle multi-digit numbers: 12+25*3 -> + 12 * 25 3', () => {
    const res = InfixToPrefixConverter.convert('12+25*3');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('+ 12 * 25 3');
  });

  it('should handle variable names: price+tax*quantity', () => {
    const res = InfixToPrefixConverter.convert('price+tax*quantity');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('+ price * tax quantity');
  });

  it('should convert complex teacher expression A+B*(C^D-E)^(F+G*H)-I', () => {
    const res = InfixToPrefixConverter.convert('A+B*(C^D-E)^(F+G*H)-I');
    expect(res.isValid).toBe(true);
    expect(res.prefix.length).toBeGreaterThan(0);
    expect(res.steps.length).toBeGreaterThan(15);
  });

  it('should generate valid sequential algorithm steps and snapshots', () => {
    const res = InfixToPrefixConverter.convert('(A+B)*C');
    expect(res.steps.length).toBeGreaterThan(0);

    for (let i = 0; i < res.steps.length; i++) {
      expect(res.steps[i].stepNumber).toBe(i + 1);
      expect(Array.isArray(res.steps[i].stack)).toBe(true);
      expect(Array.isArray(res.steps[i].output)).toBe(true);
      expect(typeof res.steps[i].reason).toBe('string');
      expect(res.steps[i].reason.length).toBeGreaterThan(5);
    }
  });
});
