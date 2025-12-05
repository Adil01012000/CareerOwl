# Layout Hierarchy

## Public Layout
`app/(public)/layout.tsx`
- Header (unauthenticated state)
- Footer
- Children (landing, job listings, job detail)

## Portal Layout
`app/(portal)/layout.tsx`
- Authenticated header (role-specific)
- Sidebar navigation (conditional by role)
- Main content area
- No footer (app-like experience)

## Auth Layout
`app/(auth)/layout.tsx`
- Minimal header (logo only)
- Centered card
- No footer