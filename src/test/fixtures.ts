import type { Resource } from '../resources/types'

export function resource(overrides: Partial<Resource> = {}): Resource {
  return {
    id: '001',
    category: 'Podcasts',
    title: 'Mindful Moments',
    thumbnail: '/test-image.jpg',
    tags: ['wellbeing', 'mindfulness', 'relaxation'],
    duration: 25,
    description:
      'A calming podcast focused on mindfulness techniques for daily life.',
    date_uploaded: '2025-07-10',
    ...overrides,
  }
}
