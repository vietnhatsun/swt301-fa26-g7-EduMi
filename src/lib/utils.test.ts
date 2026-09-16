import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    const result = cn('px-2 py-1', 'bg-blue-500', { 'text-white': true });
    expect(result).toBe('px-2 py-1 bg-blue-500 text-white');
  });
});
