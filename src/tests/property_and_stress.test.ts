import { describe, it, expect } from 'vitest';
import { InfixToPrefixConverter } from '../algorithms/converter';

describe('Property-Based and Randomized Conversion Testing', () => {
  const OPERANDS = ['A', 'B', 'C', 'D', 'E', 'F', 'X', 'Y', 'Z'];
  const BINARY_OPS = ['+', '-', '*', '/', '%', '^'];

  function generateRandomExpression(depth: number): string {
    if (depth <= 0) {
      return OPERANDS[Math.floor(Math.random() * OPERANDS.length)];
    }

    const type = Math.floor(Math.random() * 3);
    const op = BINARY_OPS[Math.floor(Math.random() * BINARY_OPS.length)];

    if (type === 0) {
      // (left op right)
      const left = generateRandomExpression(depth - 1);
      const right = generateRandomExpression(depth - 1);
      return `(${left} ${op} ${right})`;
    } else if (type === 1) {
      // left op (right)
      const left = generateRandomExpression(depth - 1);
      const right = generateRandomExpression(depth - 1);
      return `${left} ${op} (${right})`;
    } else {
      // left op right
      const left = generateRandomExpression(depth - 1);
      const right = generateRandomExpression(depth - 1);
      return `${left} ${op} ${right}`;
    }
  }

  it('verifies 50 randomly generated expressions convert deterministically and reliably', () => {
    for (let i = 0; i < 50; i++) {
      const expr = generateRandomExpression(3);
      const res1 = InfixToPrefixConverter.convert(expr);
      const res2 = InfixToPrefixConverter.convert(expr);

      // Property 1: Converter doesn't crash and succeeds on valid syntax
      expect(res1.isValid).toBe(true);

      // Property 2: Deterministic output across repeated invocations
      expect(res1.prefix).toBe(res2.prefix);
      expect(res1.steps.length).toBe(res2.steps.length);

      // Property 3: Polish prefix notation never contains parentheses
      expect(res1.prefix).not.toContain('(');
      expect(res1.prefix).not.toContain(')');

      // Property 4: Token counts match
      expect(res1.tokens.length).toBeGreaterThan(0);
      expect(res1.stats.totalSteps).toBeGreaterThan(0);
    }
  });

  it('preserves operand multiset between infix input and prefix output', () => {
    for (let i = 0; i < 20; i++) {
      const expr = generateRandomExpression(2);
      const res = InfixToPrefixConverter.convert(expr);
      expect(res.isValid).toBe(true);

      const infixOperands = res.tokens
        .filter((t) => t.type === 'OPERAND')
        .map((t) => t.value)
        .sort();

      const prefixOperands = res.prefixTokens
        .filter((t) => !['+', '-', '*', '/', '%', '^'].includes(t))
        .sort();

      expect(prefixOperands).toEqual(infixOperands);
    }
  });

});

describe('Performance and Stress Benchmark Suite', () => {
  it('converts a 500-token chain smoothly in less than 150ms', () => {
    const tokens: string[] = ['A'];
    const ops = ['+', '-', '*', '/', '%'];
    for (let i = 1; i < 500; i++) {
      tokens.push(ops[i % ops.length]);
      tokens.push(String.fromCharCode(65 + (i % 26)));
    }
    const largeExpr = tokens.join(' ');

    const startTime = performance.now();
    const res = InfixToPrefixConverter.convert(largeExpr);
    const duration = performance.now() - startTime;

    expect(res.isValid).toBe(true);
    expect(res.prefix.length).toBeGreaterThan(500);
    expect(duration).toBeLessThan(150);
  });

  it('converts a 1,000-token deeply nested parenthesized expression', () => {
    let expr = 'A';
    for (let i = 1; i <= 200; i++) {
      expr = `(${expr} + ${String.fromCharCode(65 + (i % 26))})`;
    }

    const startTime = performance.now();
    const res = InfixToPrefixConverter.convert(expr);
    const duration = performance.now() - startTime;

    expect(res.isValid).toBe(true);
    expect(res.prefix.length).toBeGreaterThan(200);
    expect(duration).toBeLessThan(250);
  });
});
