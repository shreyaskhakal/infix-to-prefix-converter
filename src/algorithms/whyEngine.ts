export class WhyEngine {
  static explainOperand(token: string): string {
    return `'${token}' is an operand. In prefix/postfix notations, operands maintain their relative sequential order, so '${token}' is directly appended to the output buffer.`;
  }

  static explainLeftParen(): string {
    return `'(' is encountered. It marks the start of a nested sub-expression and is pushed onto the stack as a barrier so lower-precedence operators outside are not prematurely evaluated.`;
  }

  static explainRightParenPop(topOp: string): string {
    const displayOp = topOp === 'UNARY_MINUS' ? '-' : topOp;
    return `')' encountered. In the reversed expression, ')' marks the end of a parenthesized sub-expression. Operator '${displayOp}' is popped and added to output to resolve operations inside the parentheses.`;
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
    const displayTop = topOp === 'UNARY_MINUS' ? '- (unary)' : topOp;
    const displayIn = inOp === 'UNARY_MINUS' ? '- (unary)' : inOp;
    return `Stack top '${displayTop}' (precedence ${topPrec}) has higher precedence than incoming '${displayIn}' (precedence ${inPrec}). Higher-precedence operations must evaluate before lower-precedence ones, so '${displayTop}' is popped to the output.`;
  }

  static explainEqualPrecedenceRightAssoc(topOp: string, inOp: string): string {
    const displayTop = topOp === 'UNARY_MINUS' ? '- (unary)' : topOp;
    const displayIn = inOp === 'UNARY_MINUS' ? '- (unary)' : inOp;
    return `Incoming '${displayIn}' and stack top '${displayTop}' both have equal precedence. Because right-associative operations evaluate right-to-left in the original expression, in the reversed stream the stack top operator '${displayTop}' must be popped first.`;
  }

  static explainEqualPrecedenceLeftAssoc(topOp: string, inOp: string): string {
    return `Incoming '${inOp}' has equal precedence to stack top '${topOp}'. Because the original operators are LEFT-ASSOCIATIVE and the input was reversed, '${topOp}' must NOT be popped yet. Pushing '${inOp}' preserves original left-to-right evaluation.`;
  }

  static explainPush(op: string, wasEmpty: boolean, topOp?: string): string {
    const displayOp = op === 'UNARY_MINUS' ? '- (unary)' : op;
    if (op === 'UNARY_MINUS') {
      return `Unary negation '-' has higher precedence (5) and right-associativity. It is pushed onto the stack to bind tightly to its operand.`;
    }
    if (wasEmpty) {
      return `The stack is currently empty. Operator '${displayOp}' is pushed onto the stack to await its subsequent operand.`;
    }
    if (topOp === '(') {
      return `The stack top is '('. Operator '${displayOp}' is pushed onto the stack inside this parenthesized scope.`;
    }
    return `The stack top now has lower precedence than '${displayOp}'. Operator '${displayOp}' is pushed onto the stack to await higher-precedence resolution.`;
  }

  static explainFinalPop(op: string): string {
    const displayOp = op === 'UNARY_MINUS' ? '- (unary)' : op;
    return `The end of the reversed expression has been reached. Remaining operator '${displayOp}' is popped from the stack and appended to the output buffer in LIFO order.`;
  }
}

