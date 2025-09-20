import * as React from "react"
import classNames from "classnames"

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary"
}

export function Badge({ children, variant = "default", className, ...rest }: Props) {
  return (
    <span
      {...rest}
      className={classNames(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        {
          "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100": variant === "default",
          "bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-50": variant === "secondary",
        },
        className
      )}
    >
      {children}
    </span>
  )
}
