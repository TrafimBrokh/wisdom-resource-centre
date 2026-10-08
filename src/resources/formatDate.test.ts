import { describe, expect, it } from 'vitest'
import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('displays an ISO calendar date in British English', () => {
    expect(formatDate('2025-07-10')).toBe('10 July 2025')
  })

  it('keeps dates on month and year boundaries', () => {
    expect(formatDate('2025-01-01')).toBe('1 January 2025')
    expect(formatDate('2024-02-29')).toBe('29 February 2024')
  })
})
