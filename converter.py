"""
Core Infix-to-Prefix Conversion Algorithm with Stack Instrumentation.

Implements the standard DSA pipeline:
  1. Infix Expression
  2. Reverse Infix
  3. Swap Parentheses ('(' <-> ')')
  4. Postfix Conversion using custom Stack class
  5. Reverse Postfix Output
  6. Final Prefix (Polish Notation)

Instruments every stack operation to produce real algorithm events
for time-travel replay and step-by-step educational visualization.
"""

import re
from typing import List, Tuple, Dict, Optional
from stack import Stack
from models import (
    Token,
    TokenType,
    AlgorithmStep,
    ConversionResult,
    OPERATOR_PRECEDENCE,
    OPERATOR_ASSOCIATIVITY,
)
from validator import ExpressionValidator
from explanations import ExplanationEngine


class InfixToPrefixConverter:
    """
    Pedagogical and mathematically robust Infix-to-Prefix Converter.
    """

    @staticmethod
    def tokenize(expression: str) -> List[str]:
        """
        Tokenize the expression string into a sequence of tokens.
        Handles identifiers (e.g., 'total_price', 'num1'), numbers ('123'),
        operators (+, -, *, /, %, ^), and parentheses.
        Also inserts implicit multiplication when operands and parentheses touch:
        e.g., 'A(B+C)' -> ['A', '*', '(', 'B', '+', 'C', ')'].
        """
        raw_pattern = re.compile(r'([A-Za-z_][A-Za-z0-9_]*|[0-9]+|\^|\*|\/|\%|\+|\-|\(|\))')
        tokens = raw_pattern.findall(expression)

        # Handle implicit multiplication gracefully
        processed: List[str] = []
        for i, tok in enumerate(tokens):
            if i > 0:
                prev = tokens[i - 1]
                prev_is_operand = prev not in ('+', '-', '*', '/', '%', '^', '(', ')')
                curr_is_operand = tok not in ('+', '-', '*', '/', '%', '^', '(', ')')

                # operand followed by '(' -> e.g. A(B) -> A*(B)
                if prev_is_operand and tok == '(':
                    processed.append('*')
                # ')' followed by operand -> e.g. (A)B -> (A)*B
                elif prev == ')' and curr_is_operand:
                    processed.append('*')
                # ')' followed by '(' -> e.g. (A)(B) -> (A)*(B)
                elif prev == ')' and tok == '(':
                    processed.append('*')

            processed.append(tok)

        return processed

    @staticmethod
    def reverse_tokens(tokens: List[str]) -> List[str]:
        """Reverse the list of tokens."""
        return list(reversed(tokens))

    @staticmethod
    def swap_parentheses(tokens: List[str]) -> List[str]:
        """Swap '(' with ')' and vice versa."""
        swapped = []
        for tok in tokens:
            if tok == '(':
                swapped.append(')')
            elif tok == ')':
                swapped.append('(')
            else:
                swapped.append(tok)
        return swapped

    @classmethod
    def convert(cls, expression: str) -> ConversionResult:
        """
        Convert an infix expression to prefix notation while recording
        all algorithm states and stack activities.
        """
        # Validate expression
        is_valid, err_msg, err_pos = ExpressionValidator.validate(expression)
        if not is_valid:
            return ConversionResult(
                original_infix=expression,
                tokens=[],
                reversed_tokens=[],
                swapped_tokens=[],
                postfix_tokens=[],
                prefix_tokens=[],
                postfix_expression="",
                prefix_expression="",
                all_steps=[],
                postfix_steps=[],
                stack_activity={},
                is_valid=False,
                error_message=err_msg,
                error_position=err_pos,
            )

        # Step 1: Tokenize
        original_tokens = cls.tokenize(expression)

        # Step 2: Reverse tokens
        rev_tokens = cls.reverse_tokens(original_tokens)

        # Step 3: Swap parentheses
        swapped_tokens = cls.swap_parentheses(rev_tokens)

        # Tracking structures
        all_steps: List[AlgorithmStep] = []
        postfix_steps: List[AlgorithmStep] = []
        step_counter = 1

        # Stack activity counter
        activity: Dict[str, Dict[str, int]] = {}

        def record_activity(item: str, op_name: str) -> None:
            if item not in activity:
                activity[item] = {"push": 0, "pop": 0, "peek": 0}
            activity[item][op_name] += 1

        # Initial pipeline stage steps for full step trace
        orig_str = " ".join(original_tokens)
        rev_str = " ".join(rev_tokens)
        swap_str = " ".join(swapped_tokens)

        stage1_step = AlgorithmStep(
            step_number=step_counter,
            stage="1. REVERSE INFIX",
            token="[ALL]",
            action="Reverse Infix Tokens",
            stack_state=[],
            output_state=[],
            reason=ExplanationEngine.explain_pipeline_stage("REVERSE_INPUT", orig_str, rev_str),
            operation_type="INFO",
        )
        all_steps.append(stage1_step)
        step_counter += 1

        stage2_step = AlgorithmStep(
            step_number=step_counter,
            stage="2. SWAP BRACKETS",
            token="[ALL]",
            action="Swap '(' <-> ')'",
            stack_state=[],
            output_state=[],
            reason=ExplanationEngine.explain_pipeline_stage("SWAP_BRACKETS", rev_str, swap_str),
            operation_type="INFO",
        )
        all_steps.append(stage2_step)
        step_counter += 1

        # Step 4: Postfix conversion using our custom Stack class
        stack = Stack()
        postfix_output: List[str] = []

        for token in swapped_tokens:
            token_obj = Token.from_string(token)

            # Case A: Operand
            if token_obj.token_type == TokenType.OPERAND:
                postfix_output.append(token)
                step = AlgorithmStep(
                    step_number=step_counter,
                    stage="3. POSTFIX CONVERSION (STACK)",
                    token=token,
                    action=f"Add operand '{token}' to output",
                    stack_state=stack.to_list(),
                    output_state=list(postfix_output),
                    reason=ExplanationEngine.explain_operand(token),
                    operation_type="OUTPUT",
                    incoming_token=token,
                )
                all_steps.append(step)
                postfix_steps.append(step)
                step_counter += 1

            # Case B: Opening Parenthesis '('
            elif token_obj.token_type == TokenType.LEFT_PAREN:
                stack.push(token)
                record_activity(token, "push")
                step = AlgorithmStep(
                    step_number=step_counter,
                    stage="3. POSTFIX CONVERSION (STACK)",
                    token=token,
                    action="Push '(' onto stack",
                    stack_state=stack.to_list(),
                    output_state=list(postfix_output),
                    reason=ExplanationEngine.explain_left_paren(),
                    operation_type="PUSH",
                    top_element=token,
                    incoming_token=token,
                )
                all_steps.append(step)
                postfix_steps.append(step)
                step_counter += 1

            # Case C: Closing Parenthesis ')'
            elif token_obj.token_type == TokenType.RIGHT_PAREN:
                while not stack.is_empty() and stack.peek() != '(':
                    top_item = stack.peek()
                    record_activity(top_item, "peek")
                    popped = stack.pop()
                    record_activity(popped, "pop")
                    postfix_output.append(popped)

                    step = AlgorithmStep(
                        step_number=step_counter,
                        stage="3. POSTFIX CONVERSION (STACK)",
                        token=token,
                        action=f"POP '{popped}' (inside parens)",
                        stack_state=stack.to_list(),
                        output_state=list(postfix_output),
                        reason=ExplanationEngine.explain_right_paren_pop(popped),
                        operation_type="POP",
                        top_element=popped,
                        incoming_token=token,
                    )
                    all_steps.append(step)
                    postfix_steps.append(step)
                    step_counter += 1

                # Discard '('
                if not stack.is_empty() and stack.peek() == '(':
                    record_activity('(', "peek")
                    discarded = stack.pop()
                    record_activity(discarded, "pop")
                    step = AlgorithmStep(
                        step_number=step_counter,
                        stage="3. POSTFIX CONVERSION (STACK)",
                        token=token,
                        action="POP & Discard '('",
                        stack_state=stack.to_list(),
                        output_state=list(postfix_output),
                        reason=ExplanationEngine.explain_right_paren_discard(),
                        operation_type="MATCH",
                        top_element=discarded,
                        incoming_token=token,
                    )
                    all_steps.append(step)
                    postfix_steps.append(step)
                    step_counter += 1

            # Case D: Operator (+, -, *, /, %, ^)
            elif token_obj.token_type == TokenType.OPERATOR:
                incoming_prec = token_obj.precedence

                while not stack.is_empty():
                    top_val = stack.peek()
                    record_activity(top_val, "peek")

                    if top_val == '(':
                        break

                    top_prec = OPERATOR_PRECEDENCE.get(top_val, 0)

                    # In reversed expression:
                    # 1. If stack top has STRICTLY HIGHER precedence -> pop top
                    # 2. If EQUAL precedence and operator is RIGHT-ASSOCIATIVE (e.g. ^) -> pop top
                    # 3. If EQUAL precedence and operator is LEFT-ASSOCIATIVE (e.g. +,-,*,/,%) -> do NOT pop!
                    should_pop = False
                    reason_text = ""

                    if top_prec > incoming_prec:
                        should_pop = True
                        reason_text = ExplanationEngine.explain_higher_precedence_pop(
                            top_val, top_prec, token, incoming_prec
                        )
                    elif top_prec == incoming_prec and token_obj.associativity == "Right":
                        should_pop = True
                        reason_text = ExplanationEngine.explain_equal_precedence_pop_right_assoc(
                            top_val, token
                        )
                    elif top_prec == incoming_prec and token_obj.associativity == "Left":
                        # Record reason why we STOP popping
                        reason_text = ExplanationEngine.explain_equal_precedence_push_left_assoc(
                            top_val, token
                        )
                        break
                    else:
                        break

                    if should_pop:
                        popped_op = stack.pop()
                        record_activity(popped_op, "pop")
                        postfix_output.append(popped_op)

                        step = AlgorithmStep(
                            step_number=step_counter,
                            stage="3. POSTFIX CONVERSION (STACK)",
                            token=token,
                            action=f"POP '{popped_op}'",
                            stack_state=stack.to_list(),
                            output_state=list(postfix_output),
                            reason=reason_text,
                            operation_type="POP",
                            top_element=popped_op,
                            incoming_token=token,
                        )
                        all_steps.append(step)
                        postfix_steps.append(step)
                        step_counter += 1

                # Push incoming operator
                stack_was_empty = stack.is_empty()
                top_elem = stack.peek() if not stack_was_empty else None
                stack.push(token)
                record_activity(token, "push")

                push_reason = ExplanationEngine.explain_push_operator(
                    token, stack_was_empty=stack_was_empty, top_op=top_elem
                )

                step = AlgorithmStep(
                    step_number=step_counter,
                    stage="3. POSTFIX CONVERSION (STACK)",
                    token=token,
                    action=f"PUSH '{token}'",
                    stack_state=stack.to_list(),
                    output_state=list(postfix_output),
                    reason=push_reason,
                    operation_type="PUSH",
                    top_element=token,
                    incoming_token=token,
                )
                all_steps.append(step)
                postfix_steps.append(step)
                step_counter += 1

        # Pop any remaining operators in stack
        while not stack.is_empty():
            final_popped = stack.pop()
            record_activity(final_popped, "pop")
            postfix_output.append(final_popped)

            step = AlgorithmStep(
                step_number=step_counter,
                stage="3. POSTFIX CONVERSION (STACK)",
                token="[END]",
                action=f"POP '{final_popped}' (Remaining)",
                stack_state=stack.to_list(),
                output_state=list(postfix_output),
                reason=ExplanationEngine.explain_final_pop(final_popped),
                operation_type="FINAL_POP",
                top_element=final_popped,
                incoming_token="[END]",
            )
            all_steps.append(step)
            postfix_steps.append(step)
            step_counter += 1

        # Step 5: Reverse postfix output to get prefix
        prefix_tokens = cls.reverse_tokens(postfix_output)

        post_str = " ".join(postfix_output)
        pref_str = " ".join(prefix_tokens)

        stage4_step = AlgorithmStep(
            step_number=step_counter,
            stage="4. REVERSE POSTFIX TO PREFIX",
            token="[ALL]",
            action="Reverse Postfix -> Final Prefix",
            stack_state=[],
            output_state=list(prefix_tokens),
            reason=ExplanationEngine.explain_pipeline_stage("REVERSE_POSTFIX", post_str, pref_str),
            operation_type="INFO",
        )
        all_steps.append(stage4_step)

        # Generate clean string representations
        # If all tokens are single characters, also provide unspaced compact representation
        is_all_single = all(len(t) == 1 for t in original_tokens if t not in ('(', ')'))
        if is_all_single:
            compact_prefix = "".join(prefix_tokens)
            compact_postfix = "".join(postfix_output)
        else:
            compact_prefix = " ".join(prefix_tokens)
            compact_postfix = " ".join(postfix_output)

        overall_stats = stack.get_stats()
        overall_stats["total_steps"] = len(all_steps)

        return ConversionResult(
            original_infix=expression,
            tokens=original_tokens,
            reversed_tokens=rev_tokens,
            swapped_tokens=swapped_tokens,
            postfix_tokens=postfix_output,
            prefix_tokens=prefix_tokens,
            postfix_expression=compact_postfix,
            prefix_expression=compact_prefix,
            all_steps=all_steps,
            postfix_steps=postfix_steps,
            stack_activity=activity,
            stack_stats=overall_stats,
            is_valid=True,
            error_message=None,
            error_position=None,
        )
