# Coding Standards

## Bootstrap and Sass

- Use Bootstrap CSS and Bootstrap Icons only
- Use Bootstrap classes for layout and styling
- Use Bootstrap Sass variable overrides for customization where needed
- Do not write any custom CSS rules unless it's not supported in Bootstrap

## Next.js

- Server components by default
- Only use `'use client'` when needed (interactivity, hooks, browser APIs)
- Use Server Actions for form submissions and simple mutations
- Use API routes when you need:
  - Webhooks (Stripe, GitHub, etc.)
  - File uploads with progress tracking
  - Long-running operations
  - Specific HTTP status codes or headers
  - Third-party integrations
- Otherwise, fetch data directly in server components
- Dynamic routes for item/collection pages