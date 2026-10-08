import {
  BookOpen,
  Dumbbell,
  Flower2,
  Headphones,
  Newspaper,
  Utensils,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ResourceCard } from './ResourceCard'
import type { Category, Resource, ResourceGroup } from './types'

const categoryPresentation = {
  Podcasts: {
    icon: Headphones,
    description: 'Good company for your everyday moments.',
  },
  Articles: {
    icon: BookOpen,
    description: 'Fresh perspectives, at your own pace.',
  },
  Newsletters: {
    icon: Newspaper,
    description: 'A little inspiration for the week ahead.',
  },
  Recipes: { icon: Utensils, description: 'Simple ideas to nourish your day.' },
  Fitness: {
    icon: Dumbbell,
    description: 'Find movement that feels good for you.',
  },
  Meditation: {
    icon: Flower2,
    description: 'Slow down. Breathe. Begin again.',
  },
} satisfies Record<Category, { icon: LucideIcon; description: string }>

interface ResourceSectionProps {
  group: ResourceGroup
  onOpen: (resource: Resource) => void
}

export function ResourceSection({ group, onOpen }: ResourceSectionProps) {
  const { category, resources } = group
  const { icon: Icon, description } = categoryPresentation[category]
  const headingId = `category-${category.toLowerCase()}`

  return (
    <section className="resource-section" aria-labelledby={headingId}>
      <div className="category-intro">
        <div className="category-icon">
          <Icon size={22} aria-hidden="true" />
        </div>
        <h2 id={headingId}>{category}</h2>
        <p>{description}</p>
        <span className="category-count">
          {resources.length} {resources.length === 1 ? 'resource' : 'resources'}
        </span>
      </div>
      <div className="resource-grid">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} onOpen={onOpen} />
        ))}
      </div>
    </section>
  )
}
