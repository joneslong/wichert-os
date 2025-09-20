import * as React from "react"

export function ScrollArea({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`overflow-y-auto ${className || ""}`}>
      {children}
    </div>
  )
}
