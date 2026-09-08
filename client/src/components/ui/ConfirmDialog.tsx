import { useEffect, useRef } from 'react'
import { Button } from './Button'

export type ConfirmDialogProps = {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    cancelRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[color-mix(in_srgb,var(--color-ink)_45%,transparent)] p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby={description ? 'confirm-dialog-description' : undefined}
        className="w-full max-w-sm rounded-[var(--radius-md)] bg-[var(--color-canvas)] p-5 shadow-lg"
      >
        <h2 id="confirm-dialog-title" className="text-base font-semibold text-[var(--color-ink)]">
          {title}
        </h2>
        {description ? (
          <p id="confirm-dialog-description" className="mt-2 text-sm text-[var(--color-ink-muted)]">
            {description}
          </p>
        ) : null}
        <div className="mt-5 flex justify-end gap-2">
          <Button ref={cancelRef} variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant="primary"
            className={destructive ? 'bg-[var(--color-coral)] hover:brightness-95' : undefined}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
