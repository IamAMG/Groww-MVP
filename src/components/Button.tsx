import { ButtonHTMLAttributes } from 'react'

export function Button({ className = '', disabled, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  return (
    <button
      className={`btn-primary ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export function OutlineButton({ className = '', disabled, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  return (
    <button
      className={`btn-outline ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
