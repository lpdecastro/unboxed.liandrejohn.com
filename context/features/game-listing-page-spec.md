# Game Listing Page Spec

## Task

Create the game listing page.

## Reference

Use `@context/contents/game-listing-page.md` as the source of truth for:
- Content
- Section order
- Recommended presentation

Do not invent new sections unless needed to solve a clear UX problem.

## Design Direction

Make the page:
- Fun
- Modern
- Friendly
- Trustworthy
- Slightly playful with a board-game feel

Avoid:
- Childish or toy-store styling
- Excessive decoration
- Overly saturated colors
- Cluttered layouts

## UX Priorities

Prioritize:
- Easy browsing and scanning of games
- Clear game names, pricing, availability, and key details
- Strong distinction between cards and interactive controls
- Simple filtering where defined in the content
- Clear primary actions for viewing or renting a game
- Consistent card structure and visual hierarchy
- Generous spacing and readable content

Use good UI/UX judgment to refine the recommended presentation when necessary.

## Acceptance Criteria

- All game listing page content from `game-listing-page.md` is represented.
- Section order remains consistent with the reference.
- Game cards are easy to scan.
- Pricing, availability, and primary actions are clearly visible.
- Filters defined in the reference are intuitive to use.
- The page works well on desktop and mobile.
- Empty, loading, and no-results states are handled where relevant.
- Avoid unnecessary custom components when Bootstrap already provides a suitable pattern.