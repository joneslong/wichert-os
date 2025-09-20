import * as React from "react"

export function Card({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`rounded-2xl border shadow-sm bg-white dark:bg-neutral-900 ${className || ""}`}>{children}</div>
}

export function CardHeader({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`p-4 border-b dark:border-neutral-700 ${className || ""}`}>{children}</div>
}

export function CardTitle({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <h2 className={`font-semibold ${className || ""}`}>{children}</h2>
}

export function CardContent({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`p-4 space-y-2 ${className || ""}`}>{children}</div>
}
