import { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'
import type { Resource } from './types'
import { ResourceImage } from './ResourceImage'
import { formatDate } from './formatDate'

interface ResourceDialogProps {
  resource: Resource
  onClose: () => void
}

export function ResourceDialog({ resource, onClose }: ResourceDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const trigger = document.activeElement
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'

    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus()
    }
  }, [])

  return (
    <dialog
      className="resource-dialog"
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => { event.preventDefault(); onClose() }}
    >
      <button className="icon-button dialog-close" type="button" onClick={onClose} aria-label="Close resource details" autoFocus>
        <X size={21} aria-hidden="true" />
      </button>
      <ResourceImage src={resource.thumbnail} title={resource.title} />
      <div className="dialog-content">
        <p className="dialog-category">{resource.category}</p>
        <h2 id={titleId}>{resource.title}</h2>
        <p className="dialog-description" id={descriptionId}>{resource.description}</p>
        <dl className="resource-metadata">
          <div><dt>Read / watch time</dt><dd>{resource.duration} min</dd></div>
          <div><dt>Uploaded</dt><dd><time dateTime={resource.date_uploaded}>{formatDate(resource.date_uploaded)}</time></dd></div>
          <div><dt>Resource ID</dt><dd>{resource.id}</dd></div>
        </dl>
        <ul className="tags" aria-label="Tags">{resource.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
      </div>
    </dialog>
  )
}
