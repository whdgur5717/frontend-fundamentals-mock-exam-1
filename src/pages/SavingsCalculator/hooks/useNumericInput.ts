import type { ChangeEvent } from 'react';

type Options = {
  formatter?: (n: number) => string;
  onParsedChange?: (n: number) => void; // optional side effect
  emptyAsZero?: boolean; // when input clears, store 0 (default: true)
};

/**
 * Keeps state numeric while showing a formatted string in the input.
 * - value: numeric state (single source of truth)
 * - onChange: update numeric state by parsing the input string
 * - display: formatted string (e.g., with commas)
 */
export function useNumericInput(
  value: number,
  setValue: (next: number) => void,
  {
    formatter = (n: number) => new Intl.NumberFormat('ko-KR').format(Math.round(n)),
    onParsedChange,
    emptyAsZero = true,
  }: Options = {}
) {
  const display = formatter(value);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value ?? '';
    const digits = raw.replace(/\D/g, '');
    const next = digits === '' ? (emptyAsZero ? 0 : Number.NaN) : Number(digits);
    setValue(next);
    if (onParsedChange) {
      onParsedChange(next);
    }
  }

  return { value: display, onChange };
}
