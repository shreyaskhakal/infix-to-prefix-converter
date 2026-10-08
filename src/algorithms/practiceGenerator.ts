import { InfixToPrefixConverter } from './converter';
import type { PracticeChallenge, PracticeDifficulty } from '../types';

export class PracticeGenerator {
  private static readonly VARS = ['A', 'B', 'C', 'D', 'E', 'F', 'X', 'Y', 'Z', 'M', 'N', 'P'];
  private static readonly EASY_OPS = ['+', '-', '*', '/'];


  private static pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * Dynamically synthesizes a structurally valid arithmetic expression for the requested difficulty,
   * runs the conversion engine, and returns a verified PracticeChallenge.
   */
  static generate(difficulty: PracticeDifficulty = 'Medium'): PracticeChallenge {
    const diffNorm = (difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()) as PracticeDifficulty;
    let expr = '';
    let hint = '';

    const v1 = this.pickRandom(this.VARS);
    const v2 = this.pickRandom(this.VARS.filter((v) => v !== v1));
    const v3 = this.pickRandom(this.VARS.filter((v) => v !== v1 && v !== v2));
    const v4 = this.pickRandom(this.VARS.filter((v) => v !== v1 && v !== v2 && v !== v3));
    const v5 = this.pickRandom(this.VARS.filter((v) => v !== v1 && v !== v2 && v !== v3 && v !== v4));

    switch (diffNorm) {
      case 'Easy':
      case 'Beginner': {
        const op = this.pickRandom(this.EASY_OPS);
        expr = `${v1} ${op} ${v2}`;
        hint = `Direct binary operation: '${op}' takes precedence over single operands.`;
        break;
      }

      case 'Medium':
      case 'Intermediate': {
        const variant = Math.floor(Math.random() * 4);
        if (variant === 0) {
          expr = `${v1} + ${v2} * ${v3}`;
          hint = "Multiplication (*) takes higher precedence than addition (+).";
        } else if (variant === 1) {
          expr = `(${v1} + ${v2}) * ${v3}`;
          hint = "Parentheses force addition to evaluate before multiplication.";
        } else if (variant === 2) {
          expr = `${v1} ^ ${v2} ^ ${v3}`;
          hint = "Exponentiation (^) is right-associative: evaluate right-to-left.";
        } else {
          expr = `${v1} * ${v2} - ${v3}`;
          hint = "Multiplication (*) evaluates before subtraction (-).";
        }
        break;
      }

      case 'Hard':
      case 'Advanced': {
        const variant = Math.floor(Math.random() * 4);
        if (variant === 0) {
          expr = `${v1} * (${v2} + ${v3}) - ${v4}`;
          hint = "Parenthesized sum evaluates first, followed by product, then subtraction.";
        } else if (variant === 1) {
          expr = `(${v1} + ${v2}) * (${v3} - ${v4})`;
          hint = "Both independent parenthesized groups resolve before the outer multiplication.";
        } else if (variant === 2) {
          expr = `(${v1} - ${v2}) / (${v3} + ${v4})`;
          hint = "Evaluate both parenthesized sub-expressions before applying division.";
        } else {
          expr = `${v1} + ${v2} * ${v3} - ${v4} / ${v5}`;
          hint = "High precedence operators (* and /) evaluate before low precedence (+ and -).";
        }
        break;
      }

      case 'Expert': {
        const variant = Math.floor(Math.random() * 3);
        if (variant === 0) {
          expr = `((${v1} + ${v2}) * ${v3}) ^ (${v4} - ${v5})`;
          hint = "Nested brackets: inner sum then product, exponent base meets exponent power.";
        } else if (variant === 1) {
          expr = `${v1} + ${v2} * (${v3} ^ ${v4} - ${v5})`;
          hint = "Inside parens, power (^) evaluates before subtraction (-); then multiply, then add.";
        } else {
          expr = `-((${v1} + ${v2}) * ${v3}) + ${v4} ^ ${v5}`;
          hint = "Unary minus negates the parenthesized product before adding the power term.";
        }
        break;
      }

      default:
        expr = `${v1} + ${v2} * ${v3}`;
        hint = "Standard precedence: multiply before add.";
        break;
    }

    const conversion = InfixToPrefixConverter.convert(expr);

    return {
      id: `gen-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      expression: expr,
      infix: expr,
      expectedPrefix: conversion.prefix,
      difficulty: diffNorm,
      hint,
      explanation: `Infix '${expr}' converts into Prefix '${conversion.prefix}' via ${conversion.stats.totalSteps} stack transitions.`,
    };
  }
}
