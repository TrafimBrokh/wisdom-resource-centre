import { categories } from './types'
import type { Resource, ResourceGroup } from './types'

export function groupResources(resources: readonly Resource[]): ResourceGroup[] {
  return categories
    .map((category) => ({
      category,
      resources: resources.filter((resource) => resource.category === category),
    }))
    .filter((group) => group.resources.length > 0)
}
