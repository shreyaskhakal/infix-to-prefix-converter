import React from 'react';
import { BookOpen, Code, Clock, Database } from 'lucide-react';
import { OPERATOR_INFO } from '../data/constants';

export const LearnView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6 p-4">
      {/* Title */}
      <div className="flex flex-col gap-1.5 pb-2 border-b border-border-hairline">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <BookOpen className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-100">Algorithm Theory & Pseudocode</h2>
          <span className="ml-auto text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface-elevated text-slate-400 border border-border-hairline">
            DSA_REF::V2
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Formal mathematical foundation and state machine specifications of Stack-based Infix-to-Prefix conversion.
        </p>
      </div>

      {/* Conceptual Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-surface-subtle rounded border border-border-hairline p-4 flex flex-col gap-2">
          <span className="label-caps text-indigo-400">Infix Notation</span>
          <div className="font-mono text-base font-bold text-slate-200">A + B * C</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Operators are placed <strong className="text-slate-200">between</strong> operands. Human-readable standard, but requires operator precedence, associativity rules, and parentheses to resolve evaluation ambiguity.
          </p>
        </div>

        <div className="bg-surface-subtle rounded border border-indigo-500/30 p-4 flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
          <span className="label-caps text-purple-400">Prefix (Polish)</span>
          <div className="font-mono text-base font-bold text-indigo-300">+ A * B C</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Operators <strong className="text-slate-200">precede</strong> operands. Discovered by Jan Łukasiewicz (1924). Completely eliminates the need for parentheses during linear machine evaluation.
          </p>
        </div>

        <div className="bg-surface-subtle rounded border border-border-hairline p-4 flex flex-col gap-2">
          <span className="label-caps text-cyan-400">Postfix (Reverse Polish)</span>
          <div className="font-mono text-base font-bold text-cyan-300">A B C * +</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Operators <strong className="text-slate-200">follow</strong> operands. Extensively leveraged in compilers, interpreters, stack architectures, and Forth/PostScript execution runtimes.
          </p>
        </div>
      </div>

      {/* The 5-Phase Conversion Algorithm */}
      <div className="bg-surface-subtle rounded border border-border-hairline p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <span>The 5-Step Infix → Prefix Transformation Algorithm</span>
          </h3>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
            LIFO_PIPELINE
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Instead of building an abstract syntax tree (AST), Infix can be systematically converted to Prefix via a deterministic 5-phase stack process:
        </p>

        <div className="space-y-2 text-xs text-slate-300">
          {[
            {
              step: '1',
              title: 'Step 1: Reverse the Infix Token Stream',
              desc: 'Reverse the sequence of scanned tokens from right-to-left.',
            },
            {
              step: '2',
              title: 'Step 2: Invert Parenthesis Directions',
              desc: "Change every '(' to ')' and every ')' to '('. This restores proper nesting closure during left-to-right scanning.",
            },
            {
              step: '3',
              title: 'Step 3: Postfix Conversion with Stack Arbitration',
              desc: "Scan tokens. If operand, output directly. If '(', push. If ')', pop until matching '('. If operator, pop operators from stack according to precedence and associativity.",
              note: 'Key rule for Infix to Prefix: In the reversed token stream, right-associative operators (^) pop on equal precedence, whereas left-associative operators (+ - * / %) do NOT pop on equal precedence!',
            },
            {
              step: '4',
              title: 'Step 4: Drain Remaining Stack Operators',
              desc: 'Pop all remaining operators from the stack to the output buffer.',
            },
            {
              step: '5',
              title: 'Step 5: Reverse the Postfix Stream',
              desc: 'Reversing the resulting postfix token sequence yields the final, mathematically exact Prefix expression!',
            },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 p-3 rounded bg-surface-elevated border border-border-hairline">
              <span className="w-5 h-5 rounded bg-indigo-500/10 text-indigo-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-indigo-500/20">
                {item.step}
              </span>
              <div className="space-y-0.5">
                <strong className="text-slate-100 font-semibold">{item.title}</strong>
                <p className="text-slate-400">{item.desc}</p>
                {item.note && (
                  <p className="text-amber-400/90 text-[11px] pt-1">
                    <em>Rule:</em> {item.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Operator Precedence Table */}
      <div className="bg-surface-subtle rounded border border-border-hairline p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold tracking-tight text-slate-100">
            Operator Precedence & Associativity Reference
          </h3>
          <span className="label-caps text-slate-500">PRECEDENCE_TABLE</span>
        </div>

        <div className="overflow-x-auto rounded border border-border-hairline">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-surface-elevated text-slate-400 font-mono uppercase text-[10px] border-b border-border-hairline">
              <tr>
                <th className="p-2.5">Operator</th>
                <th className="p-2.5">Operation</th>
                <th className="p-2.5">Precedence</th>
                <th className="p-2.5">Associativity</th>
                <th className="p-2.5">Sample Evaluation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline font-sans text-slate-300">
              {OPERATOR_INFO.map((op) => (
                <tr key={op.symbol} className="hover:bg-surface-elevated/40 font-mono transition-colors">
                  <td className="p-2.5 font-bold text-amber-400 text-sm">{op.symbol}</td>
                  <td className="p-2.5 font-sans">{op.name}</td>
                  <td className="p-2.5 text-indigo-400 font-bold">{op.precedence}</td>
                  <td className="p-2.5 font-sans">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-semibold ${
                      op.associativity === 'Right-to-Left'
                        ? 'bg-purple-950/60 text-purple-300 border border-purple-800/50'
                        : 'bg-surface-elevated text-slate-400 border border-border-hairline'
                    }`}>
                      {op.associativity}
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-400 font-sans">{op.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Unary Rules callout */}
        <div className="p-4 rounded bg-surface-elevated border border-border-hairline text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between">
            <strong className="text-slate-100 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              Unary Operator Semantics & Exponentiation Rules:
            </strong>
            <span className="label-caps text-indigo-400">UNARY_SPEC</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
            <li>
              <strong className="text-slate-200">Highest Precedence (5):</strong> Unary <code className="text-indigo-300 font-mono">+</code> and <code className="text-indigo-300 font-mono">-</code> bind tighter than exponentiation (<code className="text-amber-300 font-mono">^</code>, prec 4), multiplication/division/modulo (prec 3), and binary addition/subtraction (prec 2).
            </li>
            <li>
              <strong className="text-slate-200">Right-Associative:</strong> Consecutive unary signs evaluate right-to-left.
            </li>
            <li>
              <strong className="text-slate-200">Interaction with Exponentiation:</strong>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 font-mono text-[11px]">
                <div className="p-2 rounded bg-surface-subtle border border-border-hairline">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Default:</span>
                    <span className="text-emerald-400 font-bold">^ - A B</span>
                  </div>
                  <div className="text-amber-300 text-xs mt-0.5">-A^B</div>
                  <div className="text-[10px] text-slate-500 font-sans mt-0.5">(-A) is raised to power B due to precedence 5 &gt; 4</div>
                </div>
                <div className="p-2 rounded bg-surface-subtle border border-border-hairline">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Grouped:</span>
                    <span className="text-emerald-400 font-bold">- ^ A B</span>
                  </div>
                  <div className="text-amber-300 text-xs mt-0.5">-(A^B)</div>
                  <div className="text-[10px] text-slate-500 font-sans mt-0.5">Parentheses explicitly defer the unary negation</div>
                </div>
                <div className="p-2 rounded bg-surface-subtle border border-border-hairline">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Exponent:</span>
                    <span className="text-emerald-400 font-bold">^ A - B</span>
                  </div>
                  <div className="text-amber-300 text-xs mt-0.5">A^-B</div>
                  <div className="text-[10px] text-slate-500 font-sans mt-0.5">B is negated before being applied as power of A</div>
                </div>
                <div className="p-2 rounded bg-surface-subtle border border-border-hairline">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Chain:</span>
                    <span className="text-emerald-400 font-bold">^ - A ^ B C</span>
                  </div>
                  <div className="text-amber-300 text-xs mt-0.5">-A^B^C</div>
                  <div className="text-[10px] text-slate-500 font-sans mt-0.5">Evaluates as (-A)^(B^C) combining precedence &amp; right-associativity</div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Pseudocode Box */}
      <div className="bg-surface-subtle rounded border border-border-hairline p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold tracking-tight text-slate-100">Algorithm Pseudocode</h3>
          </div>
          <span className="label-caps text-slate-500">SPEC_PSEUDO</span>
        </div>

        <pre className="bg-canvas-root p-4 rounded font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed border border-border-hairline">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-surface-subtle rounded border border-border-hairline p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>Time Complexity: O(N)</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Where <em className="text-slate-200">N</em> is the number of tokens in the expression.
            <br /><br />
            • <strong className="text-slate-200">Tokenization:</strong> Scans string once in O(N).<br />
            • <strong className="text-slate-200">Reversals & Parenthesis Swap:</strong> Linear operations in O(N).<br />
            • <strong className="text-slate-200">Stack Processing:</strong> Every token is pushed at most once and popped at most once. Amortized O(1) per token.<br />
            • <strong className="text-slate-200">Total Time:</strong> O(N) linear time.
          </p>
        </div>

        <div className="bg-surface-subtle rounded border border-border-hairline p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider font-mono">
            <Database className="w-3.5 h-3.5" />
            <span>Space Complexity: O(N)</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Auxiliary memory utilization is bounded by token count:
            <br /><br />
            • <strong className="text-slate-200">Operator Stack:</strong> Consumes at most O(N) auxiliary space in the worst case (e.g. deeply nested parentheses).<br />
            • <strong className="text-slate-200">Output Buffer:</strong> Holds operands and operators, requiring exactly N slots.<br />
            • <strong className="text-slate-200">Total Auxiliary Space:</strong> O(N) linear space.
          </p>
        </div>
      </div>
    </div>
  );
};

