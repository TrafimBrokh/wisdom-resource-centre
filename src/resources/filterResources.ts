import type { Resource } from './types'

export function filterResources(resources: readonly Resource[], query: string): Resource[] {
  if (query.trim()) throw new Error('Filtering has not been implemented')
  return [...resources]
}
