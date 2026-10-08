import { describe, expect, it } from 'vitest'
import { groupResources } from './catalogue'
import { resource } from '../test/fixtures'

describe('groupResources', () => {
  it('returns no groups when no resources are available', () => {
    expect(groupResources([])).toEqual([])
  })

  it('puts one resource in its category', () => {
    const podcast = resource()
    expect(groupResources([podcast])).toEqual([
      { category: 'Podcasts', resources: [podcast] },
    ])
  })

  it('groups every resource once in the category order from the brief', () => {
    const article = resource({ id: '2', category: 'Articles' })
    const firstPodcast = resource()
    const secondPodcast = resource({ id: '3' })
    expect(groupResources([article, firstPodcast, secondPodcast])).toEqual([
      { category: 'Podcasts', resources: [firstPodcast, secondPodcast] },
      { category: 'Articles', resources: [article] },
    ])
  })
})
