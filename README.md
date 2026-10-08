# Wellbeing Resource Centre

A React and TypeScript app for browsing wellbeing resources, built with Vite.
It uses mock data: 12 resources across six categories.

## Features

- Cards with a thumbnail, title, up to three tags and duration.
- Search by title or tag, ignoring case and surrounding whitespace.
- Sort categories alphabetically or resources by date within each category.
- Resource details in a keyboard-accessible dialog, with description and upload date.
- Responsive layout and a fallback for unavailable images.

## Run

Requires Node.js 24 and npm.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173. No API keys or environment variables are needed.

## Checks

```sh
npm run check
npm run test:coverage
npx playwright install chromium firefox
npm run test:e2e
```

`npm run check` runs TypeScript, ESLint, formatting, unit/component tests and the
production build. Browser tests use that build. GitHub Actions runs the checks in
Chromium and Firefox, including a mobile viewport.

## Notes

Filtering and sorting are pure functions; React state handles search, ordering
and the selected resource. Native `<dialog>` handles modal keyboard behaviour.

Resources are mock content, not playable media. Thumbnails use the supplied
external URLs. With more time, I would optimise the images and add manual
screen-reader testing.
