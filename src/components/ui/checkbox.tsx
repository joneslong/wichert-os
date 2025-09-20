import * as React from "react"

type Props = {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
}

export function Checkbox({ checked=false, onCheckedChange, className }: Props) {
  return (
    <button
      type="button"
      onClick={() => onCheckedChange?.(!checked)}
      aria-pressed={checked}
      className={`h-5 w-5 rounded-md border flex items-center justify-center
                  border-neutral-300 dark:border-neutral-700
                  bg-white dark:bg-neutral-900
                  ${checked ? "ring-2 ring-blue-500" : ""}
                  ${className||""}`}
    >
      {checked ? (
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
          <path d="M7.629 13.233 4.4 10.004l-1.4 1.4 4.629 4.629L17 6.662l-1.4-1.4z" />
        </svg>
      ) : null}
    </button>
  )
}
