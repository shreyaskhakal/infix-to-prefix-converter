import React from 'react';
import { BookOpen, Code, Clock, Database } from 'lucide-react';
import { OPERATOR_INFO } from '../data/constants';

export const LearnView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 p-4">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Algorithm Theory & Pseudocode</h2>
        </div>
        <p className="text-sm text-slate-400">
          Complete mathematical foundation of Stack-based Infix-to-Prefix conversion.
        </p>
      </div>

      {/* Conceptual Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 flex flex-col gap-2 shadow-lg">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Infix Notation</span>
          <div className="font-mono text-lg font-bold text-slate-200">A + B * C</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Operators are placed <strong>between</strong> operands. Human-readable but requires operator precedence, associativity rules, and parentheses to resolve ambiguity.
          </p>
        </div>

        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 flex flex-col gap-2 shadow-lg ring-1 ring-indigo-500/30">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Prefix (Polish)</span>
          <div className="font-mono text-lg font-bold text-indigo-300">+ A * B C</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Operators <strong>precede</strong> operands. Discovered by Jan Łukasiewicz (1924). Completely eliminates the need for parentheses during linear machine evaluation.
          </p>
        </div>

        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 flex flex-col gap-2 shadow-lg">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Postfix (Reverse Polish)</span>
          <div className="font-mono text-lg font-bold text-cyan-300">A B C * +</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Operators <strong>follow</strong> operands. Extensively leveraged in compilers, interpreters, and Forth/PostScript execution machines.
          </p>
        </div>
      </div>

      {/* The 5-Phase Conversion Algorithm */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 flex flex-col gap-4 shadow-xl">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <span>The 5-Step Infix → Prefix Algorithm</span>
        </h3>
        <p className="text-xs text-slate-300">
          Instead of parsing an abstract syntax tree (AST), Infix can be systematically converted to Prefix via a clever 5-phase stack process:
        </p>

        <div className="space-y-3 text-xs text-slate-300">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 font-mono font-bold flex items-center justify-center shrink-0">1</span>
            <div>
              <strong className="text-slate-100">Step 1: Reverse the Infix Expression:</strong>
              <p className="text-slate-400 mt-0.5">Reverse the sequence of tokens from right-to-left.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 font-mono font-bold flex items-center justify-center shrink-0">2</span>
            <div>
              <strong className="text-slate-100">Step 2: Swap Parentheses:</strong>
              <p className="text-slate-400 mt-0.5">Change every '(' to ')' and every ')' to '('. This restores proper nesting closure during left-to-right scanning.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 font-mono font-bold flex items-center justify-center shrink-0">3</span>
            <div>
              <strong className="text-slate-100">Step 3: Convert Modified Expression to Postfix using Stack:</strong>
              <p className="text-slate-400 mt-0.5">
                Scan tokens. If operand, output directly. If '(', push. If ')', pop to output until '('. If operator, pop operators from stack according to precedence and associativity.
                <br />
                <em className="text-amber-400">Key rule for Infix to Prefix:</em> In the reversed string, right-associative operators (<code className="text-amber-300 font-bold">^</code>) pop on equal precedence, whereas left-associative operators (<code className="text-amber-300 font-bold">+ - * / %</code>) do not pop on equal precedence!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 font-mono font-bold flex items-center justify-center shrink-0">4</span>
            <div>
              <strong className="text-slate-100">Step 4: Empty Remaining Stack Elements:</strong>
              <p className="text-slate-400 mt-0.5">Pop all remaining operators from the stack to the output buffer.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 font-mono font-bold flex items-center justify-center shrink-0">5</span>
            <div>
              <strong className="text-slate-100">Step 5: Reverse the Postfix Result:</strong>
              <p className="text-slate-400 mt-0.5">Reversing the resulting postfix token sequence yields the final, mathematically exact Prefix expression!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Operator Precedence Table */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 flex flex-col gap-4 shadow-xl">
        <h3 className="text-base font-bold text-slate-100">Operator Precedence & Associativity Reference</h3>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3">Operator</th>
                <th className="p-3">Operation</th>
                <th className="p-3">Precedence</th>
                <th className="p-3">Associativity</th>
                <th className="p-3">Sample Evaluation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-sans text-slate-300">
              {OPERATOR_INFO.map((op) => (
                <tr key={op.symbol} className="hover:bg-slate-800/40 font-mono">
                  <td className="p-3 font-bold text-amber-400 text-sm">{op.symbol}</td>
                  <td className="p-3 font-sans">{op.name}</td>
                  <td className="p-3 text-indigo-400 font-bold">{op.precedence}</td>
                  <td className="p-3 font-sans">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      op.associativity === 'Right-to-Left'
                        ? 'bg-purple-950 text-purple-300 border border-purple-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {op.associativity}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 font-sans">{op.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pseudocode Box */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 flex flex-col gap-4 shadow-xl">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-slate-100">Algorithm Pseudocode</h3>
        </div>

        <pre className="bg-slate-950 p-4 rounded-xl font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed border border-slate-800">
{`ALGORITHM InfixToPrefix(expression):
  INPUT: Valid Infix string
  OUTPUT: Equivalent Prefix string

  1. tokens ← Tokenize(expression)
  2. reversedTokens ← Reverse(tokens)
  3. FOR each token in reversedTokens:
        IF token == '(' THEN token ← ')'
        ELSE IF token == ')' THEN token ← '('

  4. stack ← EmptyStack()
  5. postfixOutput ← EmptyList()

  6. FOR each token in reversedTokens:
        IF IsOperand(token):
            postfixOutput.append(token)
        ELSE IF token == '(':
            stack.push(token)
        ELSE IF token == ')':
            WHILE NOT stack.isEmpty() AND stack.peek() != '(':
                postfixOutput.append(stack.pop())
            stack.pop() // Discard '('
        ELSE IF IsOperator(token):
            WHILE NOT stack.isEmpty() AND stack.peek() != '(' AND
                  ShouldPop(stack.peek(), token):
                postfixOutput.append(stack.pop())
            stack.push(token)

  7. WHILE NOT stack.isEmpty():
        postfixOutput.append(stack.pop())

  8. prefixOutput ← Reverse(postfixOutput)
  9. RETURN Join(prefixOutput)`}
        </pre>
      </div>

      {/* Complexity Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 flex flex-col gap-3 shadow-xl">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Clock className="w-4 h-4" />
            <span>Time Complexity: O(N)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Where <em>N</em> is the number of tokens in the expression.
            <br /><br />
            - <strong>Tokenization:</strong> Scans string once in $O(N)$.<br />
            - <strong>Reversals & Parenthesis Swap:</strong> Linear operations in $O(N)$.<br />
            - <strong>Stack Processing:</strong> Every token is pushed at most once and popped at most once. Amortized constant time $O(1)$ per token.<br />
            - <strong>Total Time:</strong> $O(N)$ linear time.
          </p>
        </div>

        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 flex flex-col gap-3 shadow-xl">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
            <Database className="w-4 h-4" />
            <span>Space Complexity: O(N)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Auxiliary memory utilization is bounded by the number of tokens:
            <br /><br />
            - <strong>Operator Stack:</strong> Stores operators and parentheses, consuming at most $O(N)$ space in the worst case (e.g. deeply nested parentheses).<br />
            - <strong>Output Buffer:</strong> Stores operands and operators, requiring exactly $N$ slots.<br />
            - <strong>Total Auxiliary Space:</strong> $O(N)$ linear space.
          </p>
        </div>
      </div>
    </div>
  );
};
