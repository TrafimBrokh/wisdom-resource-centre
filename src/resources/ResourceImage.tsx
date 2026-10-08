interface ResourceImageProps {
  src: string
  title: string
}

export function ResourceImage({ src, title }: ResourceImageProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null)

  if (failedSource === src) {
    return (
      <div
        className="resource-image image-fallback"
        role="img"
        aria-label={`Image unavailable for ${title}`}
      >
        <Sprout aria-hidden="true" />
        <span aria-hidden="true">A moment for you</span>
      </div>
    )
  }

  return (
    <img
      className="resource-image"
      src={src}
      alt={`Thumbnail for ${title}`}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailedSource(src)}
    />
  )
}
import { useState } from 'react'
import { Sprout } from 'lucide-react'
