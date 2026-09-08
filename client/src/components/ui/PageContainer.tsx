import type { ReactNode } from 'react'

type PageContainerProps = {
  title: string
  description?: string
  children?: ReactNode
}

export function PageContainer({ title, description, children }: PageContainerProps) {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <h1
          className="text-3xl font-semibold tracking-tight text-[var(--color-ink)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm text-[var(--color-ink-muted)]">{description}</p>
        ) : null}
      </header>
      {children}
    </section>
  )
}
