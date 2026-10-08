# Wellbeing Resource Centre

A single-page React and TypeScript application for browsing wellbeing resources.
Resources are grouped into Podcasts, Articles, Newsletters, Recipes, Fitness and
Meditation on first load. The implementation covers all three optional features:
resource details, title/tag filtering, and category/date sorting.

## Run

Use Node.js 24 LTS (see `.nvmrc`) and npm.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173. For the production build:

```sh
npm run build
npm run preview
```

Dependency lifecycle scripts are disabled in `.npmrc`. There are no environment
variables, credentials, backend services or API keys to configure.

## Behaviour and scope

- **Initial view:** all resources in the six categories, in the order in the
  brief. Empty categories are omitted when filtering.
- **Cards:** title, thumbnail, up to three tags, and duration in minutes.
- **Details:** a modal displays the title, image, category, every tag, duration,
  description, upload date and resource ID. Close with the close button or Escape.
- **Search:** case-insensitive substring matching against the title or any tag.
  Surrounding whitespace is ignored. A clear control and a no-results message
  make it easy to recover from an unsuccessful search.
- **Sort:** category A–Z / Z–A changes the order of category sections. Newest /
  oldest sorts cards **within each category**, retaining the grouped layout.
  Equal dates keep source order; default order restores the supplied ordering.
- **Dates:** ISO calendar dates are compared directly and displayed in British
  English using UTC, avoiding an off-by-one date in other time zones.
- **Data:** the six example resources plus six original mock entries, so each
  category has two items and date sorting has a visible effect.

The supplied task explicitly requests mock data and does not require an external
API. The absence/conflict endpoints in the accompanying generic feedback concern
a different task and are not used here. Audio/video playback, accounts, favourites,
pagination and a CMS are outside this brief.

## Design decisions

- React hooks own the small amount of UI state. A global store, router and query
  library would add indirection without solving a requirement here.
- TypeScript models a resource with a closed union of six categories and readonly
  input data. Small pure functions handle filtering and grouping/sorting.
- Components render data and handle user interaction. The catalogue is injectable
  through `App` props, so tests use small, explicit datasets without exposing
  component internals.
- Native `<dialog>` provides modal semantics, background inertness and keyboard
  focus containment. The application handles opening/closing, scroll locking and
  focus return; real-browser tests cover behaviour that jsdom cannot reproduce.
- CSS tokens and a responsive grid keep styling local and avoid a UI framework
  dependency. Lucide provides consistent icons.
- The thumbnails use the URLs supplied with the sample data. They are the only
  external runtime requests. Broken images have a local visual fallback, and
  `referrerPolicy="no-referrer"` avoids sending the app URL to the image host.
- There is no HTML injection, analytics, browser storage or secret handling.

## Checks

```sh
npm test                 # unit and component behaviour
npm run test:watch       # test watch mode
npm run test:coverage    # coverage report
npm run typecheck
npm run lint
npm run format:check
npm run build
npx playwright install chromium firefox
npm run test:e2e         # real-browser keyboard, responsive and accessibility checks
```

GitHub Actions installs dependencies and runs checks on hosted Ubuntu runners.
No project build, application server or tests were run on the local workstation.
The CI workflow has read-only repository permissions and does not receive secrets.

## Development process

The history starts with an empty catalogue and incrementally adds grouping,
filtering/sorting, the catalogue UI and details. Focused `test: ... (red)` commits
record expected failures before the corresponding `feat: ... (green)` changes.
Early failed CI runs are intentional evidence of that process, not a claim that
every historical commit is a releasable build. The latest commit should be green.

Tests focus on observable results: returned resource groups, accessible controls,
visible cards, search results and modal behaviour. Browser tests supplement unit
tests for native dialog behaviour, keyboard focus, accessibility and narrow
viewports.

## Structure

```text
src/
  App.tsx                 Page composition and UI state
  resources/
    types.ts              Resource and category definitions
    mockResources.ts      Local sample catalogue
    catalogue.ts          Grouping and ordering
    filterResources.ts    Title/tag search
    ResourceCard.tsx      Resource summary
    ResourceSection.tsx   Category presentation
    ResourceDialog.tsx    Full resource details
    ResourceImage.tsx     Thumbnail and failure fallback
  test/                   Test setup and small data fixtures
e2e/                      Browser acceptance tests
```

## With more time

All required features are implemented. Before shipping a real service, I would
validate assumptions with the product team: whether dates should reorder whole
categories, how large the catalogue can become, and the source of final imagery.
I would then consider API boundary validation and loading/error states if a real
API is introduced, approved and optimised images served from our own host,
screen-reader testing with real users, and pagination only if data size warrants
it. The current descriptions are mock content, not full playable/readable media.

## Review access

This repository is private because the assessment was marked confidential. Add
the reviewers as collaborators before sharing the link. The original task PDFs,
recruiter correspondence and personal documents are not committed.
