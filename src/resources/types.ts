export const categories = [
  'Podcasts',
  'Articles',
  'Newsletters',
  'Recipes',
  'Fitness',
  'Meditation',
] as const

export type Category = (typeof categories)[number]

export interface Resource {
  readonly id: string
  readonly category: Category
  readonly title: string
  readonly thumbnail: string
  readonly tags: readonly string[]
  readonly duration: number
  readonly description: string
  /** A calendar date in YYYY-MM-DD format. */
  readonly date_uploaded: string
}

export interface ResourceGroup {
  category: Category
  resources: Resource[]
}

export type SortOrder =
  'default' | 'category-asc' | 'category-desc' | 'newest' | 'oldest'
