import { describe, expect, it } from 'vitest'
import { groupResources } from './catalogue'

describe('groupResources', () => {
  it('returns no groups when no resources are available', () => {
    expect(groupResources([])).toEqual([])
  })
})
