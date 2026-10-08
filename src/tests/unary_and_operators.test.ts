import { describe, it, expect } from 'vitest';
import { InfixToPrefixConverter } from '../algorithms/converter';
import { ExpressionValidator } from '../algorithms/validator';
import { Tokenizer } from '../algorithms/tokenizer';

describe('Unary Operators and Operator Combinations', () => {
  it('converts leading unary minus: -A+B -> +-AB', () => {
    const res = InfixToPrefixConverter.convert('-A+B');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('+-AB');
  });

  it('converts parenthesized unary minus: A+(-B) -> +A-B', () => {
    const res = InfixToPrefixConverter.convert('A+(-B)');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('+A-B');
  });

  it('converts unary minus in product: A*(-B) -> *A-B', () => {
    const res = InfixToPrefixConverter.convert('A*(-B)');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('*A-B');
  });

  it('converts unary minus preceding group: -(A+B) -> -+AB', () => {
    const res = InfixToPrefixConverter.convert('-(A+B)');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('-+AB');
  });

  it('converts unary minus with exponentiation: A^-B -> ^A-B', () => {
    const res = InfixToPrefixConverter.convert('A^-B');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('^A-B');
  });

  it('converts binary subtraction: A-B -> -AB', () => {
    const res = InfixToPrefixConverter.convert('A-B');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('-AB');
  });

  it('converts basic addition: A+B -> +AB', () => {
    const res = InfixToPrefixConverter.convert('A+B');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('+AB');
  });

  it('converts basic multiplication: A*B -> *AB', () => {
    const res = InfixToPrefixConverter.convert('A*B');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('*AB');
  });

  it('converts basic division: A/B -> /AB', () => {
    const res = InfixToPrefixConverter.convert('A/B');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('/AB');
  });

  it('converts basic modulo: A%B -> %AB', () => {
    const res = InfixToPrefixConverter.convert('A%B');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('%AB');
  });

  it('converts basic exponentiation: A^B -> ^AB', () => {
    const res = InfixToPrefixConverter.convert('A^B');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('^AB');
  });

  it('converts multi-char variable concatenation: A+BC -> + A BC', () => {
    const res = InfixToPrefixConverter.convert('A+BC');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('+ A BC');
  });

  it('converts multi-char variable concatenation: AB+C -> + AB C', () => {
    const res = InfixToPrefixConverter.convert('AB+C');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('+ AB C');
  });

  it('converts multi-operator chain A+B*C-D -> -+A*BCD', () => {
    const res = InfixToPrefixConverter.convert('A+B*C-D');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('-+A*BCD');
  });

  it('converts implicit multiplication (A+B)C -> *+ABC', () => {
    const res = InfixToPrefixConverter.convert('(A+B)C');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('*+ABC');
  });

  it('converts implicit multiplication A(B+C) -> *A+BC', () => {
    const res = InfixToPrefixConverter.convert('A(B+C)');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('*A+BC');
  });

  it('converts repeated exponentiation A^B^C -> ^A^BC', () => {
    const res = InfixToPrefixConverter.convert('A^B^C');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('^A^BC');
  });

  it('converts nested division A/(B/C) -> /A/BC', () => {
    const res = InfixToPrefixConverter.convert('A/(B/C)');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('/A/BC');
  });

  it('converts left-associative subtraction chain A-B-C -> --ABC', () => {
    const res = InfixToPrefixConverter.convert('A-B-C');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('--ABC');
  });

  it('converts double parenthesized expression ((A+B)*C) -> *+ABC', () => {
    const res = InfixToPrefixConverter.convert('((A+B)*C)');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('*+ABC');
  });

  it('converts adjacent parenthesized variables (A)(B) -> *AB', () => {
    const res = InfixToPrefixConverter.convert('(A)(B)');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('*AB');
  });

  it('converts adjacent parenthesized groups (A+B)(C+D) -> *+AB+CD', () => {
    const res = InfixToPrefixConverter.convert('(A+B)(C+D)');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('*+AB+CD');
  });

  it('converts floating-point decimal expressions: 12.5*(20+3.5)', () => {
    const res = InfixToPrefixConverter.convert('12.5*(20+3.5)');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('* 12.5 + 20 3.5');
  });

  it('converts expressions with underscore variables: price*quantity', () => {
    const res = InfixToPrefixConverter.convert('price*quantity');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('* price quantity');
  });

  it('converts variables with numbers and underscores: variable_1+variable_2', () => {
    const res = InfixToPrefixConverter.convert('variable_1+variable_2');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('+ variable_1 variable_2');
  });
});

describe('Validation Hardening and Error Detection', () => {
  it('rejects empty string', () => {
    const val = ExpressionValidator.validate('');
    expect(val.isValid).toBe(false);
    expect(val.error).toContain('cannot be empty');
  });

  it('rejects whitespace only string', () => {
    const val = ExpressionValidator.validate('     ');
    expect(val.isValid).toBe(false);
    expect(val.error).toContain('cannot be empty');
  });

  it('rejects consecutive asterisks A**', () => {
    const val = ExpressionValidator.validate('A**');
    expect(val.isValid).toBe(false);
  });

  it('rejects trailing plus A+', () => {
    const val = ExpressionValidator.validate('A+');
    expect(val.isValid).toBe(false);
    expect(val.error).toContain('cannot end with operator');
  });

  it('rejects leading binary plus +A', () => {
    const val = ExpressionValidator.validate('+A');
    expect(val.isValid).toBe(false);
    expect(val.error).toContain('cannot start with operator');
  });

  it('rejects empty parentheses ()', () => {
    const val = ExpressionValidator.validate('()');
    expect(val.isValid).toBe(false);
    expect(val.error).toContain('Empty parentheses');
  });

  it('rejects unclosed parenthesis (A+B', () => {
    const val = ExpressionValidator.validate('(A+B');
    expect(val.isValid).toBe(false);
    expect(val.error).toContain('missing closing');
  });

  it('rejects unexpected closing parenthesis A+B)', () => {
    const val = ExpressionValidator.validate('A+B)');
    expect(val.isValid).toBe(false);
    expect(val.error).toContain('Unbalanced closing parenthesis');
  });

  it('rejects unmatched double open parenthesis ((A+B', () => {
    const val = ExpressionValidator.validate('((A+B');
    expect(val.isValid).toBe(false);
    expect(val.error).toContain('missing closing');
  });

  it('rejects unmatched double close parenthesis A+B))', () => {
    const val = ExpressionValidator.validate('A+B))');
    expect(val.isValid).toBe(false);
    expect(val.error).toContain('Unbalanced closing parenthesis');
  });

  it('rejects consecutive operators A+*B', () => {
    const val = ExpressionValidator.validate('A+*B');
    expect(val.isValid).toBe(false);
    expect(val.error).toContain('cannot appear immediately after');
  });

  it('rejects invalid character A/@B', () => {
    const val = ExpressionValidator.validate('A/@B');
    expect(val.isValid).toBe(false);
    expect(val.error).toContain('Invalid character');
  });

  it('rejects unsupported symbols A @ B', () => {
    const val = ExpressionValidator.validate('A @ B');
    expect(val.isValid).toBe(false);
    expect(val.error).toContain('Invalid character');
  });

  it('rejects unsupported symbols A # B', () => {
    const val = ExpressionValidator.validate('A # B');
    expect(val.isValid).toBe(false);
    expect(val.error).toContain('Invalid character');
  });

  it('rejects unsupported symbols A $ B', () => {
    const val = ExpressionValidator.validate('A $ B');
    expect(val.isValid).toBe(false);
    expect(val.error).toContain('Invalid character');
  });

  it('rejects standalone single operator *', () => {
    const val = ExpressionValidator.validate('*');
    expect(val.isValid).toBe(false);
  });

  it('rejects trailing power A^', () => {
    const val = ExpressionValidator.validate('A^');
    expect(val.isValid).toBe(false);
    expect(val.error).toContain('cannot end with operator');
  });

  it('rejects malformed numbers with multiple decimal points', () => {
    const tokens = Tokenizer.tokenize('12.34.56 + 1');
    const val = ExpressionValidator.validate('12.34.56 + 1', tokens);
    expect(val.isValid).toBe(false);
  });
});
