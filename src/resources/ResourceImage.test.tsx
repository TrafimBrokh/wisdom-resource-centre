import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ResourceImage } from './ResourceImage'

describe('resource thumbnail', () => {
  it('displays the supplied thumbnail without sending a referrer', () => {
    render(<ResourceImage src="/photo.jpg" title="Mindful Moments" />)
    expect(screen.getByRole('img')).toHaveAttribute('src', '/photo.jpg')
    expect(screen.getByRole('img')).toHaveAttribute(
      'referrerpolicy',
      'no-referrer',
    )
  })

  it('shows an accessible local fallback when the image cannot load', () => {
    render(<ResourceImage src="/broken.jpg" title="Mindful Moments" />)
    fireEvent.error(screen.getByRole('img'))
    expect(
      screen.getByRole('img', {
        name: 'Image unavailable for Mindful Moments',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('A moment for you')).toBeInTheDocument()
  })

  it('tries a new source after a previous source failed', () => {
    const { rerender } = render(
      <ResourceImage src="/broken.jpg" title="Mindful Moments" />,
    )
    fireEvent.error(screen.getByRole('img'))
    rerender(<ResourceImage src="/new.jpg" title="Mindful Moments" />)
    expect(screen.getByRole('img')).toHaveAttribute('src', '/new.jpg')
  })
})
