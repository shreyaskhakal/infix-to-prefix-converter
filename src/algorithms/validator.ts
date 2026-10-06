import type { Token } from '../types';
import { Tokenizer } from './tokenizer';

export interface ValidationStatus {
  isValid: boolean;
  error: string | null;
  position: number;
}

export class Validator {
  static readonly SUPPORTED_OPERATORS = new Set(['+', '-', '*', '/', '%', '^']);

  /**
   * Performs structural and lexical validation on expressions and tokens.
   */
  static validate(expression: string, tokens?: Token[]): ValidationStatus {
    if (!expression || expression.trim().length === 0) {
      return { isValid: false, error: 'Expression cannot be empty.', position: 0 };
    }

    let tokenList = tokens;
    if (!tokenList) {
      try {
        tokenList = Tokenizer.tokenize(expression);
      } catch (err: any) {
        return { isValid: false, error: err.message || 'Tokenization failed.', position: 0 };
      }
    }

    if (tokenList.length === 0) {
      return { isValid: false, error: 'No valid tokens found in expression.', position: 0 };
    }

    // 1. Check for invalid characters in tokens
    for (const token of tokenList) {
      const isOperator = this.SUPPORTED_OPERATORS.has(token.value);
      const isParen = token.value === '(' || token.value === ')';
      const isIdentifier = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token.value);
      const isNumber = /^[0-9]+(\.[0-9]+)?$/.test(token.value);

      if (!isOperator && !isParen && !isIdentifier && !isNumber) {
        return {
          isValid: false,
          error: `Invalid character '${token.value}' at position ${token.position + 1}.`,
          position: token.position,
        };
      }
    }

    // 2. Check Parentheses Balance & Empty Parentheses
    const parenStack: number[] = [];
    for (let i = 0; i < tokenList.length; i++) {
      const tok = tokenList[i];
      if (tok.value === '(') {
        // Check for empty parentheses ()
        if (i + 1 < tokenList.length && tokenList[i + 1].value === ')') {
          return {
            isValid: false,
            error: `Empty parentheses '()' are not permitted at position ${tok.position + 1}.`,
            position: tok.position,
          };
        }
        parenStack.push(tok.position);
      } else if (tok.value === ')') {
        if (parenStack.length === 0) {
          return {
            isValid: false,
            error: `Unbalanced closing parenthesis ')' at position ${tok.position + 1}.`,
            position: tok.position,
          };
        }
        parenStack.pop();
      }
    }

    if (parenStack.length > 0) {
      const unclosedPos = parenStack[parenStack.length - 1];
      return {
        isValid: false,
        error: `Unbalanced opening parenthesis '(' at position ${unclosedPos + 1}: missing closing ')'.`,
        position: unclosedPos,
      };
    }

    // 3. Check Start and End tokens
    const first = tokenList[0];
    if (this.SUPPORTED_OPERATORS.has(first.value)) {
      return {
        isValid: false,
        error: `Expression cannot start with operator '${first.value}' at position ${first.position + 1}.`,
        position: first.position,
      };
    }

    const last = tokenList[tokenList.length - 1];
    if (this.SUPPORTED_OPERATORS.has(last.value)) {
      return {
        isValid: false,
        error: `Expression cannot end with operator '${last.value}' at position ${last.position + 1}.`,
        position: last.position,
      };
    }

    // 4. Check Adjacent Token Transitions
    for (let i = 0; i < tokenList.length - 1; i++) {
      const curr = tokenList[i];
      const next = tokenList[i + 1];

      // Consecutive operators: e.g. A++B or A*+B
      if (this.SUPPORTED_OPERATORS.has(curr.value) && this.SUPPORTED_OPERATORS.has(next.value)) {
        return {
          isValid: false,
          error: `Operator '${next.value}' cannot appear immediately after '${curr.value}' at position ${next.position + 1}.`,
          position: next.position,
        };
      }

      // Operator followed by closing parenthesis: e.g. (A+)
      if (this.SUPPORTED_OPERATORS.has(curr.value) && next.value === ')') {
        return {
          isValid: false,
          error: `Operator '${curr.value}' cannot be immediately followed by ')' at position ${curr.position + 1}.`,
          position: curr.position,
        };
      }

      // Opening parenthesis followed by operator: e.g. (+A)
      if (curr.value === '(' && this.SUPPORTED_OPERATORS.has(next.value)) {
        return {
          isValid: false,
          error: `'(' cannot be immediately followed by operator '${next.value}' at position ${next.position + 1}.`,
          position: next.position,
        };
      }

      // Consecutive operands: e.g. "A B"
      if (curr.type === 'OPERAND' && next.type === 'OPERAND') {
        return {
          isValid: false,
          error: `Consecutive operands '${curr.value}' and '${next.value}' without an operator at position ${next.position + 1}.`,
          position: next.position,
        };
      }
    }

    return { isValid: true, error: null, position: 0 };
  }
}

export const ExpressionValidator = Validator;
