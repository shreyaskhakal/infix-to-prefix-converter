export class WhyEngine {
  static explainOperand(token: string): string {
    return `'${token}' is an operand. In prefix/postfix notations, operands maintain their relative sequential order, so '${token}' is directly appended to the output buffer.`;
  }

  static explainLeftParen(): string {
    return `'(' is encountered. It marks the start of a nested sub-expression and is pushed onto the stack as a barrier so lower-precedence operators outside are not prematurely evaluated.`;
  }

  static explainRightParenPop(topOp: string): string {
    return `')' encountered. In the reversed expression, ')' marks the end of a parenthesized sub-expression. Operator '${topOp}' is popped and added to output to resolve operations inside the parentheses.`;
  }

  static explainRightParenDiscard(): string {
    return `The matching opening parenthesis '(' was reached and popped from the stack. Both parentheses are discarded because Polish prefix notation requires no parentheses.`;
  }

  static explainHigherPrecedencePop(
    topOp: string,
    topPrec: number,
    inOp: string,
    inPrec: number
  ): string {
    return `Stack top '${topOp}' (precedence ${topPrec}) has higher precedence than incoming '${inOp}' (precedence ${inPrec}). Higher-precedence operations must evaluate before lower-precedence ones, so '${topOp}' is popped to the output.`;
  }

  static explainEqualPrecedenceRightAssoc(topOp: string, inOp: string): string {
    return `Incoming '${inOp}' and stack top '${topOp}' are both exponentiation ('^') with equal precedence (4). In standard arithmetic, '^' is RIGHT-ASSOCIATIVE. Because the infix expression was reversed, the rightmost operator now appears first; therefore, stack top '${topOp}' must be popped first.`;
  }

  static explainEqualPrecedenceLeftAssoc(topOp: string, inOp: string): string {
    return `Incoming '${inOp}' has equal precedence to stack top '${topOp}'. Because the original operators are LEFT-ASSOCIATIVE and the input was reversed, '${topOp}' must NOT be popped yet. Pushing '${inOp}' preserves original left-to-right evaluation.`;
  }

  static explainPush(op: string, wasEmpty: boolean, topOp?: string): string {
    if (wasEmpty) {
      return `The stack is currently empty. Operator '${op}' is pushed onto the stack to await its subsequent operand.`;
    }
    if (topOp === '(') {
      return `The stack top is '('. Operator '${op}' is pushed onto the stack inside this parenthesized scope.`;
    }
    return `The stack top now has lower precedence than '${op}'. Operator '${op}' is pushed onto the stack to await higher-precedence resolution.`;
  }

  static explainFinalPop(op: string): string {
    return `The end of the reversed expression has been reached. Remaining operator '${op}' is popped from the stack and appended to the output buffer in LIFO order.`;
  }
}
