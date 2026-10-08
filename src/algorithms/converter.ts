import { Stack } from './stack';
import { Tokenizer } from './tokenizer';
import { Validator } from './validator';
import { WhyEngine } from './whyEngine';
import type {
  AlgorithmStep,
  ConversionResult,
  OperationType,
} from '../types';

export class InfixToPrefixConverter {
  /**
   * Complete 5-phase Infix to Prefix conversion engine.
   * Generates immutable step-by-step algorithm snapshots.
   */
  static convert(expression: string): ConversionResult {
    const rawExpr = expression || '';

    // 1. Tokenize
    const tokens = Tokenizer.tokenize(rawExpr);

    // 2. Validate
    const valResult = Validator.validate(rawExpr, tokens);
    if (!valResult.isValid) {
      return {
        infix: expression,
        tokens,
        reversedTokens: [],
        swappedTokens: [],
        postfixTokens: [],
        prefixTokens: [],
        postfix: '',
        prefix: '',
        steps: [],
        isValid: false,
        error: { message: valResult.error || 'Invalid expression', position: valResult.position },
        pipeline: {
          infix: expression,
          reversedInfix: '',
          modifiedInfix: '',
          intermediatePostfix: '',
          reversedPostfix: '',
          finalPrefix: '',
        },
        stats: { pushes: 0, pops: 0, peeks: 0, maxStackSize: 0, totalSteps: 0 },
      };
    }

    // 3. Step 1: Reverse Tokens
    const reversedTokens = [...tokens].reverse();
    const reversedTokenValues = reversedTokens.map((t) => t.value);

    // 4. Step 2: Swap Parentheses '(' <-> ')'
    const swappedTokens = reversedTokens.map((t) => {
      if (t.value === '(') {
        return { ...t, value: ')', type: 'RIGHT_PAREN' as const };
      }
      if (t.value === ')') {
        return { ...t, value: '(', type: 'LEFT_PAREN' as const };
      }
      return { ...t };
    });
    const swappedTokenValues = swappedTokens.map((t) => t.value);

    // 5. Step 3: Postfix Conversion Using Custom Stack
    const stack = new Stack<string>();
    const postfixOutput: string[] = [];
    const steps: AlgorithmStep[] = [];
    let stepNumber = 1;

    const makeStep = (
      stage: string,
      stageNum: number,
      token: string,
      action: string,
      reason: string,
      opType: OperationType,
      topElement?: string,
      activeOp?: string,
      ruleApplied?: string,
      comparisons?: string
    ): AlgorithmStep => {
      const snap = stack.snapshot();
      const out = [...postfixOutput];
      return {
        stepNumber: stepNumber++,
        stage,
        stageNumber: stageNum,
        token,
        currentToken: token,
        action,
        stack: snap,
        stackSnapshot: snap,
        output: out,
        outputBuffer: out,
        reason,
        explanation: reason,
        operationType: opType,
        actionType: opType.toLowerCase(),
        topElement,
        activeOperator: activeOp,
        ruleApplied,
        comparisons,
      };
    };

    // Pipeline Step 1: Reversal
    steps.push(
      makeStep(
        '1. REVERSE INFIX',
        2,
        '[ALL]',
        'Reverse Infix Tokens',
        `Reverse the input expression: '${tokens.map((t) => t.value).join(' ')}' becomes '${reversedTokenValues.join(' ')}'.`,
        'REVERSE'
      )
    );

    // Pipeline Step 2: Swap Parentheses
    steps.push(
      makeStep(
        '2. SWAP BRACKETS',
        3,
        '[ALL]',
        "Swap '(' <-> ')'",
        `Swap bracket orientations so that sub-expressions retain left-to-right grouping: '${swappedTokenValues.join(' ')}'.`,
        'SWAP'
      )
    );

    // Pipeline Step 3: Token by token postfix conversion
    for (const tok of swappedTokens) {
      const val = tok.value;

      // Case A: Operand
      if (tok.type === 'OPERAND') {
        postfixOutput.push(val);
        steps.push(
          makeStep(
            '3. POSTFIX ENGINE (STACK)',
            4,
            val,
            `Output operand '${val}'`,
            WhyEngine.explainOperand(val),
            'OUTPUT',
            undefined,
            undefined,
            'Operands are immediately directed to the output stream.'
          )
        );
      }

      // Case B: Opening Parenthesis '('
      else if (tok.type === 'LEFT_PAREN') {
        stack.push(val);
        steps.push(
          makeStep(
            '3. POSTFIX ENGINE (STACK)',
            4,
            val,
            "Push '(' onto stack",
            WhyEngine.explainLeftParen(),
            'PUSH',
            val,
            undefined,
            "Left parenthesis creates an isolated evaluation scope on the stack."
          )
        );
      }

      // Case C: Closing Parenthesis ')'
      else if (tok.type === 'RIGHT_PAREN') {
        while (!stack.isEmpty() && stack.peek() !== '(') {
          const popped = stack.pop();
          const outVal = (popped === 'UNARY_MINUS' || popped === '-(unary)' || popped === 'u-')
            ? '-'
            : (popped === 'UNARY_PLUS' || popped === '+(unary)' || popped === 'u+')
            ? '+'
            : popped;
          postfixOutput.push(outVal);
          steps.push(
            makeStep(
              '3. POSTFIX ENGINE (STACK)',
              4,
              val,
              `POP '${outVal}' (inside parens)`,
              WhyEngine.explainRightParenPop(popped),
              'POP',
              popped,
              undefined,
              "Closing parenthesis flushes deferred operators until matching '('."
            )
          );
        }


        // Discard matching '('
        if (!stack.isEmpty() && stack.peek() === '(') {
          const discarded = stack.pop();
          steps.push(
            makeStep(
              '3. POSTFIX ENGINE (STACK)',
              4,
              val,
              "Discard matching '('",
              WhyEngine.explainRightParenDiscard(),
              'DISCARD',
              discarded,
              undefined,
              "Parentheses boundaries have completed their purpose and are discarded."
            )
          );
        }
      }

      // Case D: Operator (+, -, *, /, %, ^) or Unary Operator
      else if (tok.type === 'OPERATOR' || tok.type === 'UNARY_OPERATOR') {
        const isUnary = tok.isUnary || tok.type === 'UNARY_OPERATOR';
        const stackOp = isUnary ? (val === '+' ? '+(unary)' : '-(unary)') : val;
        const incomingPrec = tok.precedence;
        const incomingAssoc = tok.associativity;

        while (!stack.isEmpty() && stack.peek() !== '(') {
          const topOp = stack.peek();
          const topPrec = Tokenizer.getPrecedence(topOp);

          // In reversed expression:
          // 1. If stack top has higher precedence -> pop
          // 2. If equal precedence and operator is right-associative (^ or unary) -> pop
          // 3. If equal precedence and operator is left-associative -> DO NOT pop!
          let shouldPop = false;
          let reasonText = '';
          let ruleText = '';
          let compText = `Precedence(${topOp}) = ${topPrec} vs Precedence(${val}) = ${incomingPrec}`;

          if (topPrec > incomingPrec) {
            shouldPop = true;
            reasonText = WhyEngine.explainHigherPrecedencePop(topOp, topPrec, stackOp, incomingPrec);
            ruleText = `Higher precedence operator '${topOp}' (${topPrec}) must execute before incoming '${val}' (${incomingPrec}).`;
          } else if (topPrec === incomingPrec && (incomingAssoc === 'right' || val === '^' || isUnary)) {
            shouldPop = true;
            reasonText = WhyEngine.explainEqualPrecedenceRightAssoc(topOp, stackOp);
            ruleText = "Right-associative operator in reversed stream pops on equal precedence.";
          } else {
            break;
          }

          if (shouldPop) {
            const popped = stack.pop();
            const outVal = (popped === 'UNARY_MINUS' || popped === '-(unary)' || popped === 'u-')
              ? '-'
              : (popped === 'UNARY_PLUS' || popped === '+(unary)' || popped === 'u+')
              ? '+'
              : popped;
            postfixOutput.push(outVal);
            steps.push(
              makeStep(
                '3. POSTFIX ENGINE (STACK)',
                4,
                val,
                `POP '${outVal}' from stack`,
                reasonText,
                'POP',
                popped,
                val,
                ruleText,
                compText
              )
            );
          }
        }

        // Push incoming operator onto stack
        const wasEmpty = stack.isEmpty();
        const topOpBeforePush = !stack.isEmpty() ? stack.peek() : undefined;
        stack.push(stackOp);
        steps.push(
          makeStep(
            '3. POSTFIX ENGINE (STACK)',
            4,
            val,
            `PUSH '${val}' onto stack`,
            WhyEngine.explainPush(isUnary ? (val === '+' ? 'UNARY_PLUS' : 'UNARY_MINUS') : val, wasEmpty, topOpBeforePush),
            'PUSH',
            stackOp,
            val,
            isUnary
              ? `Unary operator '${val}' pushed onto stack with precedence ${incomingPrec} and right associativity.`
              : `Operator '${val}' pushed onto stack to await subsequent operands.`,
            topOpBeforePush ? `Precedence(${val}) = ${incomingPrec}` : undefined
          )
        );
      }
    }

    // Empty remaining operators from stack
    while (!stack.isEmpty()) {
      const finalPopped = stack.pop();
      const outVal = (finalPopped === 'UNARY_MINUS' || finalPopped === '-(unary)' || finalPopped === 'u-')
        ? '-'
        : (finalPopped === 'UNARY_PLUS' || finalPopped === '+(unary)' || finalPopped === 'u+')
        ? '+'
        : finalPopped;
      postfixOutput.push(outVal);
      steps.push(
        makeStep(
          '3. FLUSH STACK',
          4,
          '[END]',
          `POP '${outVal}' (Final)`,
          WhyEngine.explainFinalPop(finalPopped),
          'POP',
          finalPopped,
          undefined,
          "Expression ended. Flushing remaining operators in LIFO order to output."
        )
      );
    }

    // 6. Step 4: Reverse Postfix to get Final Prefix
    const prefixTokens = [...postfixOutput].reverse();

    // Check if single-character tokens for compact display
    const isAllSingleChar = tokens.every(
      (t) => t.type === 'OPERATOR' || t.type === 'UNARY_OPERATOR' || t.value.length === 1
    );


    const prefixString = isAllSingleChar
      ? prefixTokens.join('')
      : prefixTokens.join(' ');
    const postfixString = isAllSingleChar
      ? postfixOutput.join('')
      : postfixOutput.join(' ');

    steps.push(
      makeStep(
        '4. REVERSE POSTFIX TO PREFIX',
        6,
        '[COMPLETE]',
        'Reverse Postfix -> Prefix',
        `Reverse the intermediate postfix output: '${postfixOutput.join(' ')}' becomes the final Polish prefix: '${prefixString}'.`,
        'COMPLETE',
        undefined,
        undefined,
        "Reversing the postfix stream produces canonical Polish Prefix notation."
      )
    );

    const stackStats = stack.getStats();

    return {
      infix: expression,
      tokens,
      reversedTokens: reversedTokenValues,
      swappedTokens: swappedTokenValues,
      postfixTokens: postfixOutput,
      prefixTokens,
      postfix: postfixString,
      prefix: prefixString,
      steps,
      isValid: true,
      error: null,
      pipeline: {
        infix: expression,
        reversedInfix: reversedTokenValues.join(' '),
        modifiedInfix: swappedTokenValues.join(' '),
        intermediatePostfix: postfixOutput.join(' '),
        reversedPostfix: prefixTokens.join(' '),
        finalPrefix: prefixString,
      },
      stats: {
        ...stackStats,
        totalSteps: steps.length,
      },
    };
  }
}
