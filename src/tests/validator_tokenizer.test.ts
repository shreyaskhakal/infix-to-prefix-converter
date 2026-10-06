import { describe, it, expect } from 'vitest';
import { Tokenizer } from '../algorithms/tokenizer';
import { ExpressionValidator } from '../algorithms/validator';
import { InfixToPrefixConverter } from '../algorithms/converter';

describe('Tokenizer Test Suite', () => {
  it('tokenizes identifiers and multi-character variable names', () => {
    const tokens = Tokenizer.tokenize('total + price * quantity');
    expect(tokens.map((t) => t.value)).toEqual(['total', '+', 'price', '*', 'quantity']);
  });

  it('tokenizes multi-digit numbers and floating point decimals', () => {
    const tokens = Tokenizer.tokenize('123.45 + 20 * tax');
    expect(tokens.map((t) => t.value)).toEqual(['123.45', '+', '20', '*', 'tax']);
    expect(tokens[0].type).toBe('OPERAND');
    expect(tokens[1].type).toBe('OPERATOR');
  });

  it('inserts implicit multiplication between variable and opening parenthesis', () => {
    const tokens = Tokenizer.tokenize('A(B + C)');
    expect(tokens.map((t) => t.value)).toEqual(['A', '*', '(', 'B', '+', 'C', ')']);
  });

  it('preserves start position indexes for error tracing', () => {
    const tokens = Tokenizer.tokenize('A + B');
    expect(tokens[0].position).toBe(0);
    expect(tokens[1].position).toBe(2);
    expect(tokens[2].position).toBe(4);
  });
});

describe('Expression Validator Test Suite', () => {
  it('detects empty or blank expressions', () => {
    const val = ExpressionValidator.validate('   ');
    expect(val.isValid).toBe(false);
    expect(val.error).toContain('cannot be empty');
  });

  it('detects unbalanced opening parenthesis', () => {
    const val = ExpressionValidator.validate('(A + B');
    expect(val.isValid).toBe(false);
    expect(val.error).toContain('Unbalanced');
  });

  it('detects unbalanced closing parenthesis', () => {
    const val = ExpressionValidator.validate('A + B)');
    expect(val.isValid).toBe(false);
    expect(val.error).toContain('Unbalanced');
  });

  it('detects empty parentheses', () => {
    const val = ExpressionValidator.validate('A + () + B');
    expect(val.isValid).toBe(false);
    expect(val.error).toContain('Empty parentheses');
  });

  it('detects consecutive operators with position information', () => {
    const val = ExpressionValidator.validate('A + * B');
    expect(val.isValid).toBe(false);
    expect(val.error).toContain('cannot appear immediately after');
  });

  it('detects invalid trailing operator', () => {
    const val = ExpressionValidator.validate('A + B *');
    expect(val.isValid).toBe(false);
    expect(val.error).toContain('cannot end with operator');
  });

  it('detects invalid leading binary operator', () => {
    const val = ExpressionValidator.validate('* A + B');
    expect(val.isValid).toBe(false);
    expect(val.error).toContain('cannot start with operator');
  });

  it('detects unsupported characters with character pointer', () => {
    const val = ExpressionValidator.validate('A + B $ C');
    expect(val.isValid).toBe(false);
    expect(val.error).toContain('Invalid character');
  });
});

describe('Complex End-to-End Conversions', () => {
  it('converts multi-digit decimal expression correctly', () => {
    const res = InfixToPrefixConverter.convert('123.45 + 20 * 3.5');
    expect(res.prefix).toBe('+ 123.45 * 20 3.5');
  });

  it('converts variables and complex parenthesized expressions', () => {
    const res = InfixToPrefixConverter.convert('price + (tax * rate)');
    expect(res.prefix).toBe('+ price * tax rate');
  });

  it('verifies right-associativity of repeated exponentiation A^B^C^D', () => {
    const res = InfixToPrefixConverter.convert('A ^ B ^ C ^ D');
    expect(res.prefix).toBe('^A^B^CD');
  });

  it('verifies modulo operator precedence with multiplication', () => {
    const res = InfixToPrefixConverter.convert('A % B * C');
    expect(res.prefix).toBe('*%ABC');
  });
});
