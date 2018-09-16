import { Parser, ParserOptions, Location, LocationRange } from "pegjs";

interface ParsedAST {
  ast?: ReturnType<Parser["parse"]>;
  error?: ParsedError;
}

interface ParsedError {
  line: number;
  column: number;
  message: string;
  found: string;
  expected: string;
  location: string;
}

type MakeASTFn = (
  line: number,
  column: number,
  offset: number,
  arguments: any[]
) => any;

export interface Options extends ParserOptions {
  util?: {
    makeAST?: MakeASTFn;
  };
}

export function makeAST(
  location: () => LocationRange,
  options: Options
): Location & { args: any };

export function makeUnroll(
  location: () => LocationRange,
  options: Options
): (first: any, list: any[], take: number) => any[];

export function parse(
  parser: Parser,
  input: string,
  options: Options
): ParsedAST;

export function excerpt(
  errorMessage: string,
  offset: number
): { prolog: string; token: string; epilog: string };

export function errorMessage(
  error: Error | ParsedError,
  noFinalNewline?: boolean
): string;
