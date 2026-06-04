import type { HTMLAttributes } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`bg-surface border border-border rounded-xl shadow-card ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
