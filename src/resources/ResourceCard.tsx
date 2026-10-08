import { ArrowUpRight, Clock3 } from 'lucide-react'
import { ResourceImage } from './ResourceImage'
import type { Resource } from './types'

interface ResourceCardProps {
  resource: Resource
  onOpen: (resource: Resource) => void
}

export function ResourceCard({ resource, onOpen }: ResourceCardProps) {
  return (
    <article className="resource-card">
      <div className="card-media">
        <ResourceImage src={resource.thumbnail} title={resource.title} />
      </div>
      <div className="card-body">
        <div className="card-topline">
          <span className="card-category">{resource.category}</span>
          <span className="duration">
            <Clock3 size={13} aria-hidden="true" />
            {resource.duration} min
          </span>
        </div>
        <div className="card-title-row">
          <h3>
            <button
              className="card-open"
              type="button"
              aria-label={`View ${resource.title}`}
              onClick={() => onOpen(resource)}
            >
              {resource.title}
              <ArrowUpRight
                className="card-arrow"
                size={17}
                aria-hidden="true"
              />
            </button>
          </h3>
        </div>
        <ul className="tags" aria-label="Tags">
          {resource.tags.slice(0, 3).map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>
    </article>
  )
}
