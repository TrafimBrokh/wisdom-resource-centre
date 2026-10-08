import { describe, expect, it } from 'vitest'
import { filterResources } from './filterResources'
import { resource } from '../test/fixtures'

describe('filterResources', () => {
  const podcast = resource()
  const article = resource({
    id: '2',
    title: 'The Science of Sleep',
    category: 'Articles',
    tags: ['science', 'rest'],
  })
  const items = [podcast, article]

  it('keeps every resource for an empty or whitespace-only query', () => {
    expect(filterResources(items, '')).toEqual(items)
    expect(filterResources(items, '   ')).toEqual(items)
  })

  it('matches part of a title without case or surrounding whitespace sensitivity', () => {
    expect(filterResources(items, '  SCIENCE of  ')).toEqual([article])
  })

  it('matches tags without case sensitivity', () => {
    expect(filterResources(items, 'RELAX')).toEqual([podcast])
  })

  it('does not search descriptions or categories', () => {
    expect(filterResources(items, 'calming')).toEqual([])
    expect(filterResources(items, 'Podcasts')).toEqual([])
  })

  it('returns no resources when nothing matches', () => {
    expect(filterResources(items, 'xyz')).toEqual([])
    expect(filterResources([], 'sleep')).toEqual([])
  })

  it('preserves the source array', () => {
    const frozen = Object.freeze([...items])
    filterResources(frozen, 'sleep')
    expect(frozen).toEqual(items)
  })
})
