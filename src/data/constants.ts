import type { PracticeChallenge, QuizQuestion } from '../types';

export const EXAMPLE_EXPRESSIONS = [
  { label: 'Basic Addition', expr: 'A+B', expression: 'A+B', desc: 'Simple two-operand addition' },
  { label: 'Precedence Without Parens', expr: 'A+B*C', expression: 'A+B*C', desc: 'Multiplication takes precedence over addition' },
  { label: 'Parenthesized Group', expr: '(A+B)*C', expression: '(A+B)*C', desc: 'Parentheses force addition before multiplication' },
  { label: 'Right-Associative Power', expr: 'A^B^C', expression: 'A^B^C', desc: 'Exponentiation evaluates right-to-left: A^(B^C)' },
  { label: 'Parentheses Override', expr: 'A*(B+C)', expression: 'A*(B+C)', desc: 'Grouped sum evaluated before product' },
  { label: 'Multi-Operator Chain', expr: 'A+B*C-D', expression: 'A+B*C-D', desc: 'Left-to-right evaluation across equal precedence' },
  { label: 'Dual Groups', expr: '(A+B)*(C-D)', expression: '(A+B)*(C-D)', desc: 'Two independent parenthesized expressions multiplied' },
  { label: 'Multi-digit Numbers', expr: '12+25*3', expression: '12+25*3', desc: 'Arithmetic on multi-digit numbers' },
  { label: 'Variable Identifiers', expr: 'total+price*quantity', expression: 'total+price*quantity', desc: 'Meaningful multi-character variable names' },
  { label: 'Complex Teacher Demo', expr: 'A+B*(C^D-E)^(F+G*H)-I', expression: 'A+B*(C^D-E)^(F+G*H)-I', desc: 'Advanced expression with nested powers and brackets' },
  { label: 'Nested Fractions & Chains', expr: 'A/(B-C+D)*(E-A)*C', expression: 'A/(B-C+D)*(E-A)*C', desc: 'Division and multiplication chains' },
];

export const OPERATOR_INFO = [
  { symbol: '^', name: 'Exponentiation', precedence: 4, associativity: 'Right-to-Left', example: 'A ^ B ^ C => A ^ (B ^ C)' },
  { symbol: '*', name: 'Multiplication', precedence: 3, associativity: 'Left-to-Right', example: 'A * B * C => (A * B) * C' },
  { symbol: '/', name: 'Division', precedence: 3, associativity: 'Left-to-Right', example: 'A / B / C => (A / B) / C' },
  { symbol: '%', name: 'Modulo', precedence: 3, associativity: 'Left-to-Right', example: 'A % B => (A % B)' },
  { symbol: '+', name: 'Addition', precedence: 2, associativity: 'Left-to-Right', example: 'A + B + C => (A + B) + C' },
  { symbol: '-', name: 'Subtraction', precedence: 2, associativity: 'Left-to-Right', example: 'A - B - C => (A - B) - C' },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    category: 'Precedence & Associativity',
    question: 'What is the correct prefix expression for "A + B * C"?',
    options: ['+ A * B C', '* + A B C', '+ * A B C', 'A B C * +'],
    correctIndex: 0,
    explanation:
      'Multiplication (*) has higher precedence than addition (+), so "B * C" evaluates first to "* B C". Adding A yields "+ A * B C".',
  },
  {
    id: 'q2',
    category: 'Right Associativity',
    question: 'How is the expression "A ^ B ^ C" evaluated in standard mathematics?',
    options: ['(A ^ B) ^ C', 'A ^ (B ^ C)', 'Left to right strictly', 'Both produce the same result'],
    correctIndex: 1,
    explanation:
      'Exponentiation (^) is right-associative. Therefore, A ^ B ^ C groups as A ^ (B ^ C), producing prefix "^ A ^ B C".',
  },
  {
    id: 'q3',
    category: 'Stack Mechanics',
    question: 'Why is a Stack (LIFO) the ideal data structure for expression conversion?',
    options: [
      'It sorts tokens alphabetically',
      'It preserves operator deferral until higher-precedence operations finish',
      'It provides O(1) random access to all elements',
      'It automatically evaluates floating-point numbers',
    ],
    correctIndex: 1,
    explanation:
      'LIFO ordering naturally defers lower-precedence operators until all nested or higher-priority operations evaluate.',
  },
  {
    id: 'q4',
    category: 'Parentheses Handling',
    question: 'What happens when a closing parenthesis ")" is read in the reversed postfix algorithm?',
    options: [
      'It is pushed onto the stack immediately',
      'Operators are popped until the matching "(" is reached, then both are discarded',
      'The entire stack is cleared',
      'It is appended directly to the output buffer',
    ],
    correctIndex: 1,
    explanation:
      'A closing parenthesis marks the end of a grouped sub-expression. All operators inside are popped to output, and matching parentheses are discarded.',
  },
  {
    id: 'q5',
    category: 'Algorithm Pipeline',
    question: 'What are the core stages of the standard Infix-to-Prefix algorithm?',
    options: [
      'Infix -> Direct Postfix -> Prefix',
      'Infix -> Reverse -> Swap Parentheses -> Postfix using Stack -> Reverse Postfix -> Prefix',
      'Infix -> Prefix tree -> Traversal',
      'Infix -> Tokenize -> Evaluate -> Prefix',
    ],
    correctIndex: 1,
    explanation:
      'Reversing the infix expression and swapping parentheses allows the standard stack-based postfix algorithm to produce reversed prefix, which after one final reversal yields prefix notation.',
  },
  {
    id: 'q6',
    category: 'Complexity Analysis',
    question: 'What are the Time and Auxiliary Space complexities of Infix-to-Prefix conversion?',
    options: [
      'Time: O(n log n), Space: O(1)',
      'Time: O(n^2), Space: O(n)',
      'Time: O(n), Space: O(n)',
      'Time: O(1), Space: O(n)',
    ],
    correctIndex: 2,
    explanation:
      'Every token is pushed and popped at most once. Reversals take O(n). Overall time is linear O(n), and auxiliary stack/buffer space is O(n).',
  },
];

export const PRACTICE_CHALLENGES: PracticeChallenge[] = [
  {
    id: 'p1',
    expression: 'X + Y * Z',
    infix: 'X + Y * Z',
    expectedPrefix: '+X*YZ',
    difficulty: 'Beginner',
    hint: 'Multiplication binds tighter than addition.',
  },
  {
    id: 'p2',
    expression: '(X + Y) * Z',
    infix: '(X + Y) * Z',
    expectedPrefix: '*+XYZ',
    difficulty: 'Beginner',
    hint: 'Parentheses force the sum to evaluate before the product.',
  },
  {
    id: 'p3',
    expression: 'A - B - C',
    infix: 'A - B - C',
    expectedPrefix: '--ABC',
    difficulty: 'Intermediate',
    hint: 'Subtraction is left-associative: ((A - B) - C).',
  },
  {
    id: 'p4',
    expression: 'A ^ B ^ C',
    infix: 'A ^ B ^ C',
    expectedPrefix: '^A^BC',
    difficulty: 'Intermediate',
    hint: 'Exponentiation is right-associative: A ^ (B ^ C).',
  },
  {
    id: 'p5',
    expression: '(A + B) * (C - D)',
    infix: '(A + B) * (C - D)',
    expectedPrefix: '*+AB-CD',
    difficulty: 'Intermediate',
    hint: 'Evaluate both parenthesized groups before multiplying.',
  },
  {
    id: 'p6',
    expression: 'A + B * (C ^ D - E)',
    infix: 'A + B * (C ^ D - E)',
    expectedPrefix: '+A*B-^CDE',
    difficulty: 'Advanced',
    hint: 'Power evaluates before subtraction inside parentheses, then multiplication, then addition.',
  },
];
