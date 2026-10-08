import { describe, expect, it } from 'vitest'
import { groupResources } from './catalogue'
import { resource } from '../test/fixtures'

describe('catalogue ordering', () => {
  const oldPodcast = resource({ id: 'old', date_uploaded: '2024-12-31' })
  const newPodcast = resource({ id: 'new', date_uploaded: '2025-01-01' })
  const article = resource({ id: 'article', category: 'Articles' })
  const items = [oldPodcast, article, newPodcast]

  it('sorts category names ascending and descending', () => {
    expect(
      groupResources(items, 'category-asc').map((group) => group.category),
    ).toEqual(['Articles', 'Podcasts'])
    expect(
      groupResources(items, 'category-desc').map((group) => group.category),
    ).toEqual(['Podcasts', 'Articles'])
  })

  it('sorts newest first within each category, retaining category grouping', () => {
    expect(groupResources(items, 'newest')).toEqual([
      { category: 'Podcasts', resources: [newPodcast, oldPodcast] },
      { category: 'Articles', resources: [article] },
    ])
  })

  it('sorts oldest first within each category', () => {
    expect(
      groupResources([newPodcast, oldPodcast], 'oldest')[0]?.resources,
    ).toEqual([oldPodcast, newPodcast])
  })

  it('preserves source order for equal dates', () => {
    const sameDate = resource({
      id: 'same',
      date_uploaded: newPodcast.date_uploaded,
    })
    expect(
      groupResources([newPodcast, sameDate], 'newest')[0]?.resources,
    ).toEqual([newPodcast, sameDate])
  })

  it('does not mutate the input when sorting', () => {
    const frozen = Object.freeze([...items])
    groupResources(frozen, 'newest')
    expect(frozen).toEqual(items)
  })
})
