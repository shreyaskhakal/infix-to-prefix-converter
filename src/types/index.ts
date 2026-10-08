export type TokenType =
  | 'OPERAND'
  | 'OPERATOR'
  | 'UNARY_OPERATOR'
  | 'LEFT_PAREN'
  | 'RIGHT_PAREN';

export type Associativity = 'left' | 'right' | 'none';

export interface Token {
  value: string;
  type: TokenType;
  precedence: number;
  associativity: Associativity;
  position: number;
  isUnary?: boolean;
}

export type OperationType =
  | 'PUSH'
  | 'POP'
  | 'OUTPUT'
  | 'DISCARD'
  | 'REVERSE'
  | 'SWAP'
  | 'INITIAL'
  | 'COMPLETE';

export interface AlgorithmStep {
  stepNumber: number;
  stage: string;
  token: string;
  action: string;
  stack: string[];
  output: string[];
  reason: string;
  operationType: OperationType;
  topElement?: string;
  activeOperator?: string;
  // Educational reason & visualization fields
  stageNumber?: number;
  currentToken?: string;
  stackSnapshot?: string[];
  outputBuffer?: string[];
  explanation?: string;
  actionType?: string;
  ruleApplied?: string;
  comparisons?: string;
}

export interface ConversionStats {
  pushes: number;
  pops: number;
  peeks: number;
  maxStackSize: number;
  totalSteps: number;
}

export interface ValidationError {
  message: string;
  position?: number;
}

export interface PipelineState {
  infix: string;
  reversedInfix: string;
  modifiedInfix: string;
  intermediatePostfix: string;
  reversedPostfix: string;
  finalPrefix: string;
}

export interface ConversionResult {
  infix: string;
  tokens: Token[];
  reversedTokens: string[];
  swappedTokens: string[];
  postfixTokens: string[];
  prefixTokens: string[];
  postfix: string;
  prefix: string;
  steps: AlgorithmStep[];
  isValid: boolean;
  error: ValidationError | null;
  pipeline: PipelineState;
  stats: ConversionStats;
}

export interface HistoryItem {
  id: string;
  infix: string;
  prefix: string;
  postfix: string;
  timestamp: number;
  stepCount?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Expert';
}


export type PracticeDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert' | 'Beginner' | 'Intermediate' | 'Advanced';

export interface PracticeChallenge {
  id: string;
  expression: string;
  infix?: string;
  expectedPrefix?: string;
  difficulty: PracticeDifficulty;
  hint: string;
  explanation?: string;
}

