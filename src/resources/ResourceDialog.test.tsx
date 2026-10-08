import { render, screen, within, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { resource } from '../test/fixtures'

describe('resource details', () => {
  it('opens all resource data from a card and closes with the close button', async () => {
    const user = userEvent.setup()
    const item = resource({ tags: ['one', 'two', 'three', 'four'] })
    render(<App resources={[item]} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'View Mindful Moments' }))
    const dialog = within(screen.getByRole('dialog', { name: item.title }))
    expect(dialog.getByText(item.description)).toBeInTheDocument()
    expect(dialog.getByText(item.category)).toBeInTheDocument()
    expect(dialog.getByText('10 July 2025')).toHaveAttribute('datetime', '2025-07-10')
    expect(dialog.getByText('25 min')).toBeInTheDocument()
    expect(dialog.getByText('001')).toBeInTheDocument()
    expect(dialog.getByRole('img')).toHaveAttribute('src', item.thumbnail)
    expect(dialog.getAllByRole('listitem')).toHaveLength(4)
    await user.click(dialog.getByRole('button', { name: 'Close resource details' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('handles the native Escape cancel event and can reopen another resource', async () => {
    const user = userEvent.setup()
    render(<App resources={[resource(), resource({ id: '2', title: 'Another resource' })]} />)
    await user.click(screen.getByRole('button', { name: 'View Mindful Moments' }))
    fireEvent.cancel(screen.getByRole('dialog'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'View Another resource' }))
    expect(screen.getByRole('dialog', { name: 'Another resource' })).toBeInTheDocument()
  })

  it('keeps the current search and sorting after closing details', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByRole('searchbox'), 'sleep')
    await user.selectOptions(screen.getByRole('combobox'), 'category-asc')
    const count = screen.getAllByRole('article').length
    await user.click(screen.getByRole('button', { name: 'View The Science of Sleep' }))
    await user.click(screen.getByRole('button', { name: 'Close resource details' }))
    expect(screen.getByRole('searchbox')).toHaveValue('sleep')
    expect(screen.getByRole('combobox')).toHaveValue('category-asc')
    expect(screen.getAllByRole('article')).toHaveLength(count)
  })
})
