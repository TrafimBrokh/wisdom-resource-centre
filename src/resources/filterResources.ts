import type { Resource } from './types'

export function filterResources(
  resources: readonly Resource[],
  query: string,
): Resource[] {
  const search = query.trim().toLocaleLowerCase('en-GB')
  return resources.filter((resource) =>
    [resource.title, ...resource.tags].some((value) =>
      value.toLocaleLowerCase('en-GB').includes(search),
    ),
  )
}
