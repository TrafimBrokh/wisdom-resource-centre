import { categories } from './types'
import type { Resource, ResourceGroup, SortOrder } from './types'

export function groupResources(
  resources: readonly Resource[],
  sort: SortOrder = 'default',
): ResourceGroup[] {
  const groups = categories
    .map((category) => ({
      category,
      resources: resources.filter((resource) => resource.category === category),
    }))
    .filter((group) => group.resources.length > 0)

  if (sort === 'category-asc' || sort === 'category-desc') {
    const direction = sort === 'category-asc' ? 1 : -1
    groups.sort(
      (a, b) => direction * a.category.localeCompare(b.category, 'en-GB'),
    )
  }

  if (sort === 'newest' || sort === 'oldest') {
    const direction = sort === 'oldest' ? 1 : -1
    for (const group of groups) {
      group.resources.sort(
        (a, b) => direction * a.date_uploaded.localeCompare(b.date_uploaded),
      )
    }
  }

  return groups
}
