import * as React from "react"

export function Textarea(
  { className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      className={`rounded-xl border px-3 py-2 text-sm bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className||""}`}
      {...props}
    />
  )
}
