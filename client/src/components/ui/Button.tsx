import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-moss)] text-[var(--color-canvas)] hover:brightness-110 disabled:opacity-60',
  secondary:
    'bg-[var(--color-moss-soft)] text-[var(--color-moss)] hover:bg-[color-mix(in_srgb,var(--color-moss)_18%,var(--color-canvas))]',
  ghost: 'bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-moss-soft)]',
}

export function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-[var(--radius-sm)] px-4 py-2 text-sm font-medium transition-[filter,background-color] disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
}
