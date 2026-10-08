interface ResourceImageProps {
  src: string
  title: string
}

export function ResourceImage({ src, title }: ResourceImageProps) {
  return <img src={src} alt={`Thumbnail for ${title}`} />
}
