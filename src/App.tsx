import { useRef, useState } from 'react'
import { Heart, Search, Sprout, X } from 'lucide-react'
import { mockResources } from './resources/mockResources'
import { groupResources } from './resources/catalogue'
import { filterResources } from './resources/filterResources'
import { ResourceSection } from './resources/ResourceSection'
import { ResourceDialog } from './resources/ResourceDialog'
import type { Resource, SortOrder } from './resources/types'

interface AppProps {
  resources?: readonly Resource[]
}

export default function App({ resources = mockResources }: AppProps) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortOrder>('default')
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null,
  )
  const searchInput = useRef<HTMLInputElement>(null)
  const filtered = filterResources(resources, query)
  const groups = groupResources(filtered, sort)

  function clearSearch() {
    setQuery('')
    searchInput.current?.focus()
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to resources
      </a>
      <header className="app-header" id="top">
        <div className="shell header-inner">
          <a
            className="brand"
            href="#top"
            aria-label="Wellbeing resource centre"
          >
            <span className="brand-mark">
              <Heart size={25} aria-hidden="true" />
            </span>
            <span>
              <span className="brand-name">wellbeing</span>
              <span className="brand-caption">Resource centre</span>
            </span>
          </a>
          <a className="header-link" href="#main" aria-current="page">
            Your resources
          </a>
          <span className="header-note">
            <Sprout size={16} aria-hidden="true" /> A little care, every day
          </span>
        </div>
      </header>
      <main className="shell" id="main" tabIndex={-1}>
        <div className="hero">
          <div>
            <p className="eyebrow">YOUR EVERYDAY WELLBEING</p>
            <h1>
              Small steps.
              <br />
              <span>Better wellbeing.</span>
            </h1>
            <p className="hero-description">
              Make a little time for yourself. Explore ideas, find a fresh
              perspective and build habits that feel good for you.
            </p>
          </div>
          <div className="hero-art" aria-hidden="true">
            <Sprout />
          </div>
        </div>
        <div className="catalogue-toolbar">
          <div className="search-field">
            <label className="field-label" htmlFor="resource-search">
              Search resources
            </label>
            <div className="search-control">
              <Search className="search-icon" size={19} aria-hidden="true" />
              <input
                ref={searchInput}
                id="resource-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try ‘sleep’, ‘mindfulness’ or ‘nutrition’"
              />
              {query && (
                <button
                  className="icon-button clear-search"
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
          <div className="sort-field">
            <label className="field-label" htmlFor="resource-sort">
              Sort resources
            </label>
            <select
              id="resource-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOrder)}
              aria-describedby="sort-help"
            >
              <option value="default">Default order</option>
              <option value="category-asc">Category: A–Z</option>
              <option value="category-desc">Category: Z–A</option>
              <option value="newest">Date: newest first</option>
              <option value="oldest">Date: oldest first</option>
            </select>
          </div>
        </div>
        <div className="results-bar">
          <p role="status" aria-live="polite" aria-atomic="true">
            <strong>
              {filtered.length}{' '}
              {filtered.length === 1 ? 'resource' : 'resources'}
            </strong>{' '}
            · {groups.length} {groups.length === 1 ? 'category' : 'categories'}
          </p>
          <p id="sort-help">Date sorting applies within each category.</p>
        </div>
        {groups.map((group) => (
          <ResourceSection
            key={group.category}
            group={group}
            onOpen={setSelectedResource}
          />
        ))}
        {groups.length === 0 && (
          <div className="empty-state">
            <Search size={32} aria-hidden="true" />
            <h2>
              {resources.length === 0
                ? 'No resources yet'
                : 'No resources found'}
            </h2>
            <p>
              {resources.length === 0
                ? 'Check back soon for something new.'
                : 'Try a different title or tag, or explore the full collection.'}
            </p>
            {query && (
              <button
                className="text-button"
                type="button"
                onClick={clearSearch}
              >
                Show all resources
              </button>
            )}
          </div>
        )}
      </main>
      <footer className="shell app-footer">
        <p>Space for a healthier, happier you.</p>
        <a href="#top">Back to top ↑</a>
      </footer>
      {selectedResource && (
        <ResourceDialog
          key={selectedResource.id}
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}
    </>
  )
}
