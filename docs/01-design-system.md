# CareerOwl Design System

## Colors (Tailwind v4)
```css
@theme {
  --color-primary: #78355E;      /* Purple - CTAs, headers */
  --color-secondary: #A8E600;    /* Lime green - badges, accents */
  --color-accent: #2563EB;       /* Blue - links, info */
  --color-dark: #1f2937;         /* Headings, bold text */
  --color-gray-50: #f9fafb;      /* Backgrounds */
  --color-gray-600: #4b5563;     /* Body text */
}
```

## Typography Scale
- **Headings:** font-bold text-dark
- **Body:** font-normal text-gray-600
- **Labels:** font-medium text-gray-700

## Component Patterns
- **Primary Button:** bg-primary text-white hover:bg-primary-dark
- **Badge (Verified):** bg-secondary/20 text-secondary-dark
- **Card:** bg-white shadow-sm border border-gray-200 rounded-lg