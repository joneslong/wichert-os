import * as React from "react"

export function Modal({
  open, onClose, title, footer, children
}: {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  footer?: React.ReactNode
  children?: React.ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-neutral-900 border dark:border-neutral-700 shadow-xl">
          <div className="p-4 border-b dark:border-neutral-700">{title ? <div className="font-semibold">{title}</div> : null}</div>
          <div className="p-4">{children}</div>
          {footer ? <div className="p-3 border-t dark:border-neutral-700">{footer}</div> : null}
        </div>
      </div>
    </div>
  )
}
