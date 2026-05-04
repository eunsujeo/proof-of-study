# AGENTS.md

## Project

`proof-of-study` is a personal study blog deployed with Cloudflare Pages.
It uses Astro to generate static HTML pages from Markdown files.

The root page should work like a quiet table of contents:

```text
proof of study
- 블록체인
  - 이더리움
```

Keep the site focused on study records, not dashboards, marketing copy, or deployment status.

## Research First

Do not invent technical or historical study content from memory when adding posts.

Before writing or changing study material:

- Research the topic using primary or authoritative sources.
- Prefer official documentation, specifications, standards, original papers, or maintainers' docs.
- Record the sources used in the final response or in the post metadata if the content model supports it.
- If a fact may have changed, verify it before writing.
- Clearly separate sourced facts from personal interpretation.

For blockchain and Ethereum content, prefer sources such as:

- Ethereum documentation
- Solidity documentation
- Ethereum Improvement Proposals
- Yellow Paper or protocol specifications when needed
- Cloudflare documentation only for deployment-related changes

## Design Direction

Avoid the generic "AI-generated website" look.

Do not use:

- Gradient blob backgrounds
- Decorative orbs
- Glassmorphism panels
- Oversized marketing hero sections
- Stock-looking abstract illustrations
- Random cards used only for decoration
- One-note neon, purple, blue-slate, beige, or dark dashboard palettes
- Fake metrics such as "learning modules", "initial notes", or deployment badges unless they serve the reader

Prefer:

- A centered reading column
- Plain typography with clear hierarchy
- Sparse navigation
- Stable spacing
- Content-first pages
- Subtle borders only where they clarify structure
- Korean text that reads like notes written by a person

The design should feel like a maintained personal technical notebook, not a SaaS landing page.

## Layout Rules

- Keep root content centered.
- Keep max reading width conservative.
- Use a table-of-contents structure before detailed posts.
- Do not add cards inside cards.
- Do not add UI controls unless they solve a real navigation or reading problem.
- Make mobile layout single-column and readable.
- Check that text does not overflow on narrow screens.

## Content Style

- Write in Korean by default.
- Use short paragraphs.
- Explain concepts from first principles before naming advanced abstractions.
- Use code blocks or diagrams only when they make the concept clearer.
- Avoid filler phrases, hype, and motivational language.
- Avoid pretending certainty. If something is debated, version-dependent, or simplified, say so.

## File Structure

- Site rendering code lives in `src/`.
- Study content lives in `content/`.
- Each study folder has an `index.md`.
- Each track folder has an `index.md`.
- Each post is a Markdown file in a track folder.
- Do not maintain duplicate manual post arrays.
- Astro pages live in `src/pages/`.
- Shared layouts live in `src/layouts/`.

Example:

```text
content/blockchain/index.md
content/blockchain/ethereum/index.md
content/blockchain/ethereum/why-blockchain.md
src/lib/content.js
src/pages/index.astro
src/pages/[study]/[track]/[post].astro
src/styles.css
```

## Verification

Before finishing a code change:

- Run `npm run build`.
- If layout changed, inspect the page locally when possible.
- Commit only intentional files.

## Local Preview Rules

Use the content-aware dev server when writing or editing study posts:

```bash
npm run dev:content
```

`npm run dev:content` watches `content/**/*.md` and restarts Astro when Markdown changes, so local preview is less likely to serve stale HTML after content edits.

Use `npm run dev` only for regular UI, CSS, or Astro component work where Markdown content is not changing.

Before commit or deployment, always run:

```bash
npm run build
```

## Research References For These Guidelines

These project rules are based on current public guidance from:

- GOV.UK content design guidance: start with user needs and write for how people read online.
- GOV.UK Design System layout guidance: design for small screens first and use layout to support content.
- Apple Human Interface Guidelines typography guidance: typography should support legibility, hierarchy, and consistency.
- Nielsen Norman Group usability heuristics: aesthetic and minimalist design should avoid irrelevant information competing with useful content.
