import * as React from "react"
import classNames from "classnames"

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

export function Button({ children, variant = "default", size = "md", className, ...rest }: Props) {
  return (
    <button
      {...rest}
      className={classNames(
        "rounded-xl font-medium transition-colors",
        {
          "bg-blue-600 text-white hover:bg-blue-700": variant === "default",
          "bg-neutral-200 text-neutral-900 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-50 dark:hover:bg-neutral-600": variant === "secondary",
          "border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800": variant === "outline",
          "hover:bg-neutral-100 dark:hover:bg-neutral-800": variant === "ghost",
        },
        {
          "px-2 py-1 text-xs": size === "sm",
          "px-3 py-2 text-sm": size === "md",
          "px-4 py-3 text-base": size === "lg",
        },
        className
      )}
    >
      {children}
    </button>
  )
}
