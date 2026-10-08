import { describe, it, expect } from 'vitest';
import { InfixToPrefixConverter } from '../algorithms/converter';
import { WhyEngine } from '../algorithms/whyEngine';
import { Stack } from '../algorithms/stack';

describe('Export and Serialization Integrity Suite', () => {
  it('generates valid JSON export containing all necessary telemetry', () => {
    const res = InfixToPrefixConverter.convert('(A + B) * (C - D)');
    expect(res.isValid).toBe(true);

    const jsonStr = JSON.stringify(res, null, 2);
    expect(jsonStr).toBeDefined();

    const parsed = JSON.parse(jsonStr);
    expect(parsed.infix).toBe('(A + B) * (C - D)');
    expect(parsed.prefix).toBe('*+AB-CD');
    expect(parsed.pipeline).toBeDefined();
    expect(parsed.pipeline.finalPrefix).toBe('*+AB-CD');
    expect(parsed.stats.totalSteps).toBe(res.steps.length);
    expect(parsed.steps.length).toBeGreaterThan(0);
  });

  it('generates well-formed CSV rows with escaped quotes', () => {
    const res = InfixToPrefixConverter.convert('A + B * C');
    const header = 'Step,Token,Action,Stack,Output,Explanation\n';
    const rows = res.steps
      .map((s) => {
        const tok = s.currentToken || s.token || '';
        const st = (s.stackSnapshot || s.stack || []).join(' ');
        const out = (s.outputBuffer || s.output || []).join(' ');
        const exp = (s.explanation || s.reason || '').replace(/"/g, '""');
        return `"${s.stepNumber}","${tok}","${s.action}","${st}","${out}","${exp}"`;
      })
      .join('\n');

    const csv = header + rows;
    expect(csv).toContain('Step,Token,Action,Stack,Output,Explanation');
    expect(csv).toContain('"1"');
    expect(csv.split('\n').length).toBe(res.steps.length + 1);
  });
});

describe('Educational WhyEngine Suite', () => {
  it('generates descriptive explanation for operands', () => {
    const exp = WhyEngine.explainOperand('X');
    expect(exp).toContain("'X' is an operand");
    expect(exp).toContain('output buffer');
  });

  it('generates explanation for left parentheses', () => {
    const exp = WhyEngine.explainLeftParen();
    expect(exp).toContain("'(' is encountered");
    expect(exp).toContain('barrier');
  });

  it('generates explanation for right parentheses popping', () => {
    const exp = WhyEngine.explainRightParenPop('+');
    expect(exp).toContain("')' encountered");
    expect(exp).toContain("Operator '+' is popped");
  });

  it('generates explanation for higher precedence pop', () => {
    const exp = WhyEngine.explainHigherPrecedencePop('*', 3, '+', 2);
    expect(exp).toContain("Stack top '*' (precedence 3) has higher precedence than incoming '+' (precedence 2)");
  });

  it('generates explanation for equal precedence right associativity', () => {
    const exp = WhyEngine.explainEqualPrecedenceRightAssoc('^', '^');
    expect(exp).toContain('right-associative');
  });

  it('generates explanation for equal precedence left associativity', () => {
    const exp = WhyEngine.explainEqualPrecedenceLeftAssoc('+', '+');
    expect(exp).toContain('LEFT-ASSOCIATIVE');
  });

  it('generates explanation for unary minus push', () => {
    const exp = WhyEngine.explainPush('UNARY_MINUS', false, '(');
    expect(exp).toContain('Unary negation');
    expect(exp).toContain('precedence (5)');
  });

  it('generates explanation for final stack flushing', () => {
    const exp = WhyEngine.explainFinalPop('+');
    expect(exp).toContain('Remaining operator');
  });
});

describe('Stack Data Structure Deep Edge Cases', () => {
  it('produces immutable snapshots unaffected by subsequent mutations', () => {
    const stack = new Stack<string>();
    stack.push('A');
    stack.push('B');

    const snap1 = stack.snapshot();
    expect(snap1).toEqual(['A', 'B']);

    stack.push('C');
    expect(snap1).toEqual(['A', 'B']); // Unchanged!
    expect(stack.snapshot()).toEqual(['A', 'B', 'C']);
  });

  it('tracks accurate telemetry metrics across multiple pushes and pops', () => {
    const stack = new Stack<number>();
    stack.push(10);
    stack.push(20);
    stack.pop();
    stack.push(30);
    stack.push(40);
    stack.peek();

    const stats = stack.getStats();
    expect(stats.pushes).toBe(4);
    expect(stats.pops).toBe(1);
    expect(stats.peeks).toBe(1);
    expect(stats.maxStackSize).toBe(3);
  });

  it('clears stack elements and resets size', () => {
    const stack = new Stack<string>();
    stack.push('X');
    stack.push('Y');
    expect(stack.size()).toBe(2);

    stack.clear();
    expect(stack.size()).toBe(0);
    expect(stack.isEmpty()).toBe(true);
  });
});
