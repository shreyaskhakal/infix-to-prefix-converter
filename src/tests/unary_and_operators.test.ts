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

  it('converts unary plus at start: +A -> +A and +A+B -> ++AB', () => {
    const res1 = InfixToPrefixConverter.convert('+A');
    expect(res1.isValid).toBe(true);
    expect(res1.prefix).toBe('+A');

    const res2 = InfixToPrefixConverter.convert('+A+B');
    expect(res2.isValid).toBe(true);
    expect(res2.prefix).toBe('++AB');
  });

  it('converts parenthesized unary plus: +(A+B) -> ++AB and A*(+B) -> *A+B', () => {
    const res1 = InfixToPrefixConverter.convert('+(A+B)');
    expect(res1.isValid).toBe(true);
    expect(res1.prefix).toBe('++AB');

    const res2 = InfixToPrefixConverter.convert('A*(+B)');
    expect(res2.isValid).toBe(true);
    expect(res2.prefix).toBe('*A+B');
  });

  it('converts binary addition followed by unary minus: A+-B -> +A-B', () => {
    const res = InfixToPrefixConverter.convert('A+-B');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('+A-B');
  });

  it('converts binary division followed by unary minus: A/-B -> /A-B', () => {
    const res = InfixToPrefixConverter.convert('A/-B');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('/A-B');
  });

  it('converts complex negated group product: -(A+B)*C -> *-+ABC', () => {
    const res = InfixToPrefixConverter.convert('-(A+B)*C');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('*-+ABC');
  });

  it('handles unary minus precedence with exponentiation: -A^B -> ^-AB', () => {
    const res = InfixToPrefixConverter.convert('-A^B');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('^-AB');
  });

  it('handles explicit parenthesized base with exponentiation: (-A)^B -> ^-AB', () => {
    const res = InfixToPrefixConverter.convert('(-A)^B');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('^-AB');
  });

  it('handles explicit parenthesized exponentiation negated: -(A^B) -> -^AB', () => {
    const res = InfixToPrefixConverter.convert('-(A^B)');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('-^AB');
  });

  it('handles unary minus with exponentiation chain: -A^B^C -> ^-A^BC', () => {
    const res = InfixToPrefixConverter.convert('-A^B^C');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('^-A^BC');
  });

  it('converts binary minus followed by unary minus: A--B -> -A-B', () => {
    const res = InfixToPrefixConverter.convert('A--B');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('-A-B');
  });

  it('converts double unary negation with parentheses: -(-A) -> --A', () => {
    const res = InfixToPrefixConverter.convert('-(-A)');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('--A');
  });

  it('converts unary plus preceding parenthesized unary minus: +(-A) -> +-A', () => {
    const res = InfixToPrefixConverter.convert('+(-A)');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('+-A');
  });

  it('converts addition with parenthesized unary product: A+(-B*C) -> +A*-BC', () => {
    const res = InfixToPrefixConverter.convert('A+(-B*C)');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('+A*-BC');
  });

  it('converts parenthesized group with exponentiation: -(A+B)^C -> ^-+ABC', () => {
    const res = InfixToPrefixConverter.convert('-(A+B)^C');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('^-+ABC');
  });

  it('converts precedence variations A*B+C -> +*ABC, A+B*C^D -> +A*B^CD, A^B*C -> *^ABC', () => {
    const res1 = InfixToPrefixConverter.convert('A*B+C');
    expect(res1.prefix).toBe('+*ABC');

    const res2 = InfixToPrefixConverter.convert('A+B*C^D');
    expect(res2.prefix).toBe('+A*B^CD');

    const res3 = InfixToPrefixConverter.convert('A^B*C');
    expect(res3.prefix).toBe('*^ABC');
  });

  it('converts nested parentheses with products: A*(B+(C*D)) -> *A+B*CD', () => {
    const res = InfixToPrefixConverter.convert('A*(B+(C*D))');
    expect(res.isValid).toBe(true);
    expect(res.prefix).toBe('*A+B*CD');
  });

  it('converts all Phase 3 Unary Plus variations consistently', () => {
    expect(InfixToPrefixConverter.convert('+A').prefix).toBe('+A');
    expect(InfixToPrefixConverter.convert('+A+B').prefix).toBe('++AB');
    expect(InfixToPrefixConverter.convert('A++B').prefix).toBe('+A+B');
    expect(InfixToPrefixConverter.convert('A+-B').prefix).toBe('+A-B');
    expect(InfixToPrefixConverter.convert('A-+B').prefix).toBe('-A+B');
    expect(InfixToPrefixConverter.convert('A*+B').prefix).toBe('*A+B');
    expect(InfixToPrefixConverter.convert('A/+B').prefix).toBe('/A+B');
    expect(InfixToPrefixConverter.convert('A^+B').prefix).toBe('^A+B');
    expect(InfixToPrefixConverter.convert('A(+B)').prefix).toBe('*A+B');
    expect(InfixToPrefixConverter.convert('(+A)').prefix).toBe('+A');
    expect(InfixToPrefixConverter.convert('+(A+B)').prefix).toBe('++AB');
    expect(InfixToPrefixConverter.convert('++A').prefix).toBe('++A');
    expect(InfixToPrefixConverter.convert('+++A').prefix).toBe('+++A');
  });

  it('converts all Phase 3 Unary Minus variations consistently', () => {
    expect(InfixToPrefixConverter.convert('-A').prefix).toBe('-A');
    expect(InfixToPrefixConverter.convert('-A+B').prefix).toBe('+-AB');
    expect(InfixToPrefixConverter.convert('A--B').prefix).toBe('-A-B');
    expect(InfixToPrefixConverter.convert('A+-B').prefix).toBe('+A-B');
    expect(InfixToPrefixConverter.convert('A*-B').prefix).toBe('*A-B');
    expect(InfixToPrefixConverter.convert('A/-B').prefix).toBe('/A-B');
    expect(InfixToPrefixConverter.convert('A^-B').prefix).toBe('^A-B');
    expect(InfixToPrefixConverter.convert('A(-B)').prefix).toBe('*A-B');
    expect(InfixToPrefixConverter.convert('(-A)').prefix).toBe('-A');
    expect(InfixToPrefixConverter.convert('-(A+B)').prefix).toBe('-+AB');
    expect(InfixToPrefixConverter.convert('--A').prefix).toBe('--A');
    expect(InfixToPrefixConverter.convert('---A').prefix).toBe('---A');
  });

  it('converts Phase 4 unary precedence with exponentiation and parentheses', () => {
    expect(InfixToPrefixConverter.convert('-A^B').prefix).toBe('^-AB');
    expect(InfixToPrefixConverter.convert('(-A)^B').prefix).toBe('^-AB');
    expect(InfixToPrefixConverter.convert('A^-B').prefix).toBe('^A-B');
    expect(InfixToPrefixConverter.convert('A^(-B)').prefix).toBe('^A-B');
    expect(InfixToPrefixConverter.convert('-A^B^C').prefix).toBe('^-A^BC');
    expect(InfixToPrefixConverter.convert('(-A)^B^C').prefix).toBe('^-A^BC');
    expect(InfixToPrefixConverter.convert('-(A+B)^C').prefix).toBe('^-+ABC');
    expect(InfixToPrefixConverter.convert('+(-A)').prefix).toBe('+-A');
    expect(InfixToPrefixConverter.convert('-(-A)').prefix).toBe('--A');
  });

  it('converts Phase 5 tokenizer edge cases including implicit multiplication with unaries', () => {
    expect(InfixToPrefixConverter.convert('A(B+C)').prefix).toBe('*A+BC');
    expect(InfixToPrefixConverter.convert('2(A+B)').prefix).toBe('*2+AB');
    expect(InfixToPrefixConverter.convert('(A+B)(C+D)').prefix).toBe('*+AB+CD');
    expect(InfixToPrefixConverter.convert('A(-B)').prefix).toBe('*A-B');
    expect(InfixToPrefixConverter.convert('(-A)(-B)').prefix).toBe('*-A-B');
    expect(InfixToPrefixConverter.convert('2(-A+B)').prefix).toBe('*2+-AB');
    expect(InfixToPrefixConverter.convert('12.5(A+B)').prefix).toBe('* 12.5 + A B');
    expect(InfixToPrefixConverter.convert('A2').prefix).toBe('A2');
    expect(InfixToPrefixConverter.convert('variable_1').prefix).toBe('variable_1');
    expect(InfixToPrefixConverter.convert('total_price').prefix).toBe('total_price');
  });

  it('converts multi-character variables and numeric expressions accurately', () => {
    const res1 = InfixToPrefixConverter.convert('ABC+DEF');
    expect(res1.prefix).toBe('+ ABC DEF');

    const res2 = InfixToPrefixConverter.convert('student_marks+college_fees');
    expect(res2.prefix).toBe('+ student_marks college_fees');

    const res3 = InfixToPrefixConverter.convert('100*25');
    expect(res3.prefix).toBe('* 100 25');

    const res4 = InfixToPrefixConverter.convert('12.5+3.14');
    expect(res4.prefix).toBe('+ 12.5 3.14');

    const res5 = InfixToPrefixConverter.convert('2(A+B)');
    expect(res5.prefix).toBe('*2+AB');
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

  it('rejects leading binary operator *A and /A', () => {
    const val1 = ExpressionValidator.validate('*A');
    expect(val1.isValid).toBe(false);
    expect(val1.error).toContain('cannot start with operator');

    const val2 = ExpressionValidator.validate('/A');
    expect(val2.isValid).toBe(false);
    expect(val2.error).toContain('cannot start with operator');
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

  it('validates all required unary forms as valid expressions', () => {
    const validForms = ['-A', '+A', '-A+B', 'A+-B', 'A*-B', 'A/-B', 'A^(-B)', '-(A+B)', '+(A+B)'];
    for (const expr of validForms) {
      const res = ExpressionValidator.validate(expr);
      expect(res.isValid, `Expected '${expr}' to be valid`).toBe(true);
    }
  });

  it('rejects required invalid expression forms with descriptive error messages', () => {
    const invalidCases: [string, RegExp][] = [
      ['A**', /cannot appear immediately after|cannot end with operator/],
      ['A+*', /cannot appear immediately after|cannot end with operator/],
      ['A/', /cannot end with operator/],
      ['A+', /cannot end with operator/],
      ['()', /Empty parentheses/],
      ['(A+B', /missing closing/],
      ['A+B)', /Unbalanced closing parenthesis/],
      ['A+)', /Unbalanced closing parenthesis|cannot be immediately followed by '\)'/],
      ['(A+)', /cannot be immediately followed by '\)'/],
      ['A @ B', /Invalid character/],
      ['A # B', /Invalid character/],
    ];

    for (const [expr, errorPattern] of invalidCases) {
      const res = ExpressionValidator.validate(expr);
      expect(res.isValid, `Expected '${expr}' to be invalid`).toBe(false);
      expect(res.error).toMatch(errorPattern);
    }
  });
});
