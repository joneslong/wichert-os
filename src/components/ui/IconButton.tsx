import * as React from "react";

export function IconButton({
  title,
  onClick,
  className,
  children,
}: {
  title?: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`h-8 w-8 rounded-xl border border-neutral-300 dark:border-neutral-700
                  bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800
                  inline-flex items-center justify-center text-sm ${className || ""}`}
    >
      {children}
    </button>
  );
}
