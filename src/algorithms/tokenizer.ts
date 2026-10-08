import type { Token, Associativity } from '../types';

export const OPERATOR_MAP: Record<
  string,
  { precedence: number; associativity: Associativity }
> = {
  'UNARY_MINUS': { precedence: 5, associativity: 'right' },
  'UNARY_PLUS': { precedence: 5, associativity: 'right' },
  'u-': { precedence: 5, associativity: 'right' },
  'u+': { precedence: 5, associativity: 'right' },
  '^': { precedence: 4, associativity: 'right' },
  '*': { precedence: 3, associativity: 'left' },
  '/': { precedence: 3, associativity: 'left' },
  '%': { precedence: 3, associativity: 'left' },
  '+': { precedence: 2, associativity: 'left' },
  '-': { precedence: 2, associativity: 'left' },
  '(': { precedence: 0, associativity: 'none' },
  ')': { precedence: 0, associativity: 'none' },
};

export class Tokenizer {
  /**
   * Tokenizes an arithmetic expression into a structured sequence of Token objects.
   * Accurately supports identifiers (multi-char), numbers (multi-digit & decimal),
   * operators (+, -, *, /, %, ^), unary minus/plus, and handles implicit multiplication.
   */
  static tokenize(expression: string): Token[] {
    const rawTokens: { value: string; position: number }[] = [];
    const len = expression.length;
    let i = 0;

    while (i < len) {
      const char = expression[i];

      // Skip whitespace
      if (/\s/.test(char)) {
        i++;
        continue;
      }

      // Operators and Parentheses
      if (['+', '-', '*', '/', '%', '^', '(', ')'].includes(char)) {
        rawTokens.push({ value: char, position: i });
        i++;
        continue;
      }

      // Numbers (integers and decimals)
      if (/[0-9]/.test(char) || (char === '.' && i + 1 < len && /[0-9]/.test(expression[i + 1]))) {
        const startPos = i;
        let numStr = '';
        let hasDecimal = false;

        while (i < len && (/[0-9]/.test(expression[i]) || expression[i] === '.')) {
          if (expression[i] === '.') {
            if (hasDecimal) break; // second decimal point
            hasDecimal = true;
          }
          numStr += expression[i];
          i++;
        }
        rawTokens.push({ value: numStr, position: startPos });
        continue;
      }

      // Identifiers / Variables (e.g., total_price, num1, A, x)
      if (/[a-zA-Z_]/.test(char)) {
        const startPos = i;
        let identStr = '';
        while (i < len && /[a-zA-Z0-9_]/.test(expression[i])) {
          identStr += expression[i];
          i++;
        }
        rawTokens.push({ value: identStr, position: startPos });
        continue;
      }

      // Unknown character - capture as single token for validator to report
      rawTokens.push({ value: char, position: i });
      i++;
    }

    // Process tokens and insert implicit multiplication where operands and parens touch
    const finalTokens: Token[] = [];
    for (let j = 0; j < rawTokens.length; j++) {
      const current = rawTokens[j];

      // Determine if '-' or '+' is unary
      let isUnary = false;
      if (current.value === '-' || current.value === '+') {
        if (j === 0) {
          isUnary = true;
        } else {
          const prev = rawTokens[j - 1];
          if (['+', '-', '*', '/', '%', '^', '('].includes(prev.value)) {
            isUnary = true;
          }
        }
      }

      if (j > 0 && !isUnary) {
        const prev = rawTokens[j - 1];
        const prevIsOperand = !['+', '-', '*', '/', '%', '^', '(', ')'].includes(prev.value);
        const currIsOperand = !['+', '-', '*', '/', '%', '^', '(', ')'].includes(current.value);

        // Case 1: operand followed immediately by '(' -> A(B) => A * (B), 2(A) => 2 * (A)
        // Case 2: ')' followed immediately by operand -> (A)B => (A) * B
        // Case 3: ')' followed immediately by '(' -> (A)(B) => (A) * (B)
        if (
          (prevIsOperand && current.value === '(') ||
          (prev.value === ')' && currIsOperand) ||
          (prev.value === ')' && current.value === '(')
        ) {
          finalTokens.push({
            value: '*',
            type: 'OPERATOR',
            precedence: 3,
            associativity: 'left',
            position: current.position,
            isUnary: false,
          });
        }
      }

      finalTokens.push(Tokenizer.createToken(current.value, current.position, isUnary));
    }

    return finalTokens;
  }

  private static createToken(value: string, position: number, isUnary: boolean = false): Token {
    if (value === '(') {
      return { value, type: 'LEFT_PAREN', precedence: 0, associativity: 'none', position, isUnary: false };
    }
    if (value === ')') {
      return { value, type: 'RIGHT_PAREN', precedence: 0, associativity: 'none', position, isUnary: false };
    }
    if (isUnary) {
      const opKey = value === '-' ? 'UNARY_MINUS' : 'UNARY_PLUS';
      const info = OPERATOR_MAP[opKey] || { precedence: 5, associativity: 'right' };
      return {
        value,
        type: 'UNARY_OPERATOR',
        precedence: info.precedence,
        associativity: info.associativity,
        position,
        isUnary: true,
      };
    }
    if (value in OPERATOR_MAP) {
      const info = OPERATOR_MAP[value];
      return {
        value,
        type: 'OPERATOR',
        precedence: info.precedence,
        associativity: info.associativity,
        position,
        isUnary: false,
      };
    }
    return {
      value,
      type: 'OPERAND',
      precedence: 0,
      associativity: 'none',
      position,
      isUnary: false,
    };
  }

  static getPrecedence(op: string): number {
    if (op === 'UNARY_MINUS' || op === 'u-' || op === '-(unary)') return 5;
    if (op === 'UNARY_PLUS' || op === 'u+' || op === '+(unary)') return 5;
    return OPERATOR_MAP[op]?.precedence ?? 0;
  }

  static getAssociativity(op: string): Associativity {
    if (op === 'UNARY_MINUS' || op === 'u-' || op === '-(unary)') return 'right';
    if (op === 'UNARY_PLUS' || op === 'u+' || op === '+(unary)') return 'right';
    return OPERATOR_MAP[op]?.associativity ?? 'none';
  }
}


