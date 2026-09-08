import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
}

export function Input({ label, error, id, className = '', ...props }: InputProps) {
  const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <label className="flex w-full flex-col gap-1.5 text-sm" htmlFor={inputId}>
      <span className="font-medium text-[var(--color-ink)]">{label}</span>
      <input
        id={inputId}
        className={`rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-moss)_35%,transparent)] bg-white/70 px-3 py-2 text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] ${className}`}
        {...props}
      />
      {error ? <span className="text-xs text-[var(--color-coral)]">{error}</span> : null}
    </label>
  )
}
