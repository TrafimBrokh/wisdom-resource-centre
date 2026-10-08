import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'
import { resource } from './test/fixtures'
import { categories } from './resources/types'
import { mockResources } from './resources/mockResources'

describe('resource centre', () => {
  it('shows all six categories and every resource on first load', () => {
    render(<App />)
    expect(
      screen.getAllByRole('heading', { level: 2 }).map((el) => el.textContent),
    ).toEqual(categories)
    expect(screen.getAllByRole('article')).toHaveLength(mockResources.length)
    for (const item of mockResources) {
      expect(
        screen.getByRole('button', { name: `View ${item.title}` }),
      ).toBeInTheDocument()
    }
  })

  it('shows a thumbnail, title, at most three tags and duration on each card', () => {
    render(
      <App resources={[resource({ tags: ['one', 'two', 'three', 'four'] })]} />,
    )
    const card = within(screen.getByRole('article'))
    expect(
      card.getByRole('heading', { name: 'Mindful Moments' }),
    ).toBeInTheDocument()
    expect(card.getByRole('img')).toHaveAttribute('src', '/test-image.jpg')
    expect(card.getAllByRole('listitem')).toHaveLength(3)
    expect(card.queryByText('four')).not.toBeInTheDocument()
    expect(card.getByText('25 min')).toBeInTheDocument()
  })

  it('shows a clear message when the catalogue is empty', () => {
    render(<App resources={[]} />)
    expect(screen.getByText('No resources yet')).toBeInTheDocument()
  })

  it('filters by title and tags, hides empty categories and can clear the search', async () => {
    const user = userEvent.setup()
    render(
      <App
        resources={[
          resource(),
          resource({
            id: '2',
            category: 'Articles',
            title: 'The Science of Sleep',
            tags: ['science'],
          }),
        ]}
      />,
    )
    const search = screen.getByRole('searchbox', { name: 'Search resources' })
    await user.type(search, '  SLEEP ')
    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(
      screen.queryByRole('heading', { name: 'Podcasts' }),
    ).not.toBeInTheDocument()
    await user.clear(search)
    await user.type(search, 'RELAXATION')
    expect(
      screen.getByRole('heading', { name: 'Mindful Moments' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'The Science of Sleep' }),
    ).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(search).toHaveValue('')
    expect(search).toHaveFocus()
    expect(screen.getAllByRole('article')).toHaveLength(2)
  })

  it('announces no matches and offers a way back to all resources', async () => {
    const user = userEvent.setup()
    render(<App resources={[resource()]} />)
    await user.type(screen.getByRole('searchbox'), 'unmatched query')
    expect(screen.getByRole('status')).toHaveTextContent('0 resources')
    expect(screen.getByText('No resources found')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Show all resources' }))
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('sorts category headings in both directions', async () => {
    const user = userEvent.setup()
    render(<App />)
    const sort = screen.getByRole('combobox', { name: 'Sort resources' })
    await user.selectOptions(sort, 'category-asc')
    expect(
      screen.getAllByRole('heading', { level: 2 }).map((el) => el.textContent),
    ).toEqual([...categories].sort())
    await user.selectOptions(sort, 'category-desc')
    expect(
      screen.getAllByRole('heading', { level: 2 }).map((el) => el.textContent),
    ).toEqual([...categories].sort().reverse())
  })

  it('sorts dates within a category while preserving the search', async () => {
    const user = userEvent.setup()
    render(
      <App
        resources={[
          resource({
            id: 'old',
            title: 'Mindful Morning',
            date_uploaded: '2025-01-01',
          }),
          resource({
            id: 'new',
            title: 'Mindful Evening',
            date_uploaded: '2025-08-01',
          }),
          resource({ id: 'other', title: 'Other title', tags: [] }),
        ]}
      />,
    )
    await user.type(screen.getByRole('searchbox'), 'mindful')
    const sort = screen.getByRole('combobox')
    await user.selectOptions(sort, 'newest')
    expect(
      screen.getAllByRole('heading', { level: 3 }).map((el) => el.textContent),
    ).toEqual(['Mindful Evening', 'Mindful Morning'])
    await user.selectOptions(sort, 'oldest')
    expect(
      screen.getAllByRole('heading', { level: 3 }).map((el) => el.textContent),
    ).toEqual(['Mindful Morning', 'Mindful Evening'])
  })
})
