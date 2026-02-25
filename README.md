# Shady Meadows B&B — Playwright Test Automation Suite

Automated QA test suite for [Shady Meadows B&B](https://automationintesting.online/), a demo hotel booking application built on the Restful-Booker-Platform.

## Flows Automated

### 1. E2E Happy Path — Admin Room Management (`tests/e2e.spec.ts`)

Full CRUD lifecycle through the admin panel:

1. Navigate to `/admin` and verify the login form
2. Login with valid admin credentials
3. Verify redirect to `/admin/rooms` and admin navigation visibility
4. Record the initial room count
5. Create a new room (Suite type, with WiFi/TV/Safe/Views features)
6. Verify the new room appears in the room listing
7. Delete the newly created room (waits for DELETE API response)
8. Verify the room is removed from the listing
9. Logout and verify redirect to the public homepage

**Why this flow?** It exercises authentication, CRUD operations, and navigation — the core admin workflow. It's deterministic because it creates and deletes its own test data.

### 2. Validation & Negative Scenarios (`tests/validation.spec.ts`)

Four focused tests covering input validation:

| Test | What it verifies |
|------|-----------------|
| **Invalid Login** | Wrong credentials show "Invalid credentials" error, user stays on `/admin`, room management is not accessible |
| **Blank Contact Form** | Submitting empty form shows 5 validation errors (Name, Email, Phone, Subject, Message) |
| **Invalid Input Lengths** | Too-short values trigger length validation (Phone 11-21 chars, Subject 5-100 chars, Message 20-2000 chars) |
| **Successful Contact Submission** | Valid data produces a personalized success message ("Thanks for getting in touch {name}!") |

**Why these flows?** They cover the two main public-facing interaction points (admin login, contact form) and verify both positive and negative paths with specific error message assertions.

## Project Structure

```
├── tests/                  # Test specifications
│   ├── e2e.spec.ts         # Admin room management happy path
│   └── validation.spec.ts  # Login + contact form validation
├── pages/                  # Page Object Models
│   ├── admin-login.page.ts # Admin login page
│   ├── admin-rooms.page.ts # Admin rooms management page
│   ├── admin-nav.page.ts   # Admin navigation bar
│   ├── contact-form.page.ts# Public contact form
│   ├── home.page.ts        # Public homepage
│   └── index.ts            # Barrel export
├── fixtures/               # Playwright test fixtures
│   └── test-fixtures.ts    # Custom fixtures injecting page objects
├── data/                   # Test data
│   └── test-data.ts        # Credentials, room data, expected errors
├── utils/                  # Helpers
│   └── helpers.ts          # Utility functions
├── playwright.config.ts    # Playwright configuration
├── .env                    # Environment variables (not committed)
├── .env.example            # Template for environment variables
└── test-results/           # Screenshots, traces, videos (on failure)
```

## Setup

### Prerequisites

- Node.js >= 18
- npm

### Installation

```bash
# Install dependencies
npm install

# Install Chromium browser
npx playwright install chromium

# Copy environment variables (adjust if needed)
cp .env.example .env
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BASE_URL` | `https://automationintesting.online` | Application base URL |
| `ADMIN_USERNAME` | `admin` | Admin login username |
| `ADMIN_PASSWORD` | `password` | Admin login password |

## Running Tests

```bash
# Run all tests (headless)
npm test

# Run tests in headed mode (see the browser)
npm run test:headed

# Run with Playwright UI mode (interactive)
npm run test:ui

# Run with step-by-step debugger
npm run test:debug

# Run only E2E tests
npm run test:e2e

# Run only validation tests
npm run test:validation

# Open the last HTML report
npm run report
```

## Reporting & Artifacts

### HTML Report

After running tests, an HTML report is generated in `playwright-report/`. Open it with:

```bash
npm run report
```

A screenshot of the report summary is saved at `test-results/html-report-summary.png`.

### Failure Artifacts

On test failure, the following are automatically captured in `test-results/`:

| Artifact | Policy | Description |
|----------|--------|-------------|
| **Screenshots** | `only-on-failure` | Full-page screenshot at point of failure |
| **Traces** | `retain-on-failure` | Playwright trace file (open with `npx playwright show-trace <path>`) |
| **Videos** | `retain-on-failure` | Full test execution recording |

## Design Decisions

### Locator Strategy

- **`data-testid` attributes** used where available (e.g., `ContactName`, `ContactEmail`, `roomlisting`)
- **`#id` selectors** for stable form elements (`#username`, `#password`, `#doLogin`, `#roomName`, `#createRoom`)
- **`:has-text()` filters** for matching specific rows in dynamic lists
- **CSS class selectors** only as fallback for elements without test IDs (e.g., `.roomDelete`, `.alert-danger`)

### Page Object Model

Each page/component has its own class encapsulating locators and actions. This provides:
- Single source of truth for selectors (change once, fix everywhere)
- Readable test code that reads like user stories
- Reusable methods across multiple tests

### Test Fixtures

Custom Playwright fixtures inject page objects into tests, avoiding manual instantiation and ensuring clean setup per test.

### Network-Aware Assertions

The delete room operation waits for the actual DELETE API response before asserting removal, preventing race conditions with the shared backend.

### Shared Environment Handling

The app at `automationintesting.online` is a shared public instance. Tests are designed to be safe:
- Room names use timestamp-based unique suffixes to avoid collisions
- Each test creates and cleans up its own data
- Count assertions use relative comparisons (`toBeGreaterThan`) rather than absolute values

### Why Not Booking Flow?

The room booking flow requires date-picker interaction with `react-datepicker`, which is notoriously flaky in automation. The admin room CRUD flow provides equivalent E2E coverage with more reliable interactions.

## AI Usage Disclosure

This test suite was developed with assistance from **Claude Code** (Claude Opus 4.6, Anthropic's CLI tool). Specifically:

| Area | AI Contribution |
|------|----------------|
| **Application exploration** | Claude fetched and analyzed the app's DOM structure, API endpoints, form fields, and error messages to map out testable flows |
| **Project scaffolding** | Generated initial project structure, `playwright.config.ts`, `tsconfig.json`, and `package.json` scripts |
| **Page Object Models** | Authored all page object classes based on discovered DOM selectors |
| **Test implementation** | Wrote both test spec files with assertions matched to actual app behavior |
| **Locator debugging** | Iteratively inspected the live DOM to fix selectors (e.g., `/admin` vs `/#/admin`, `#contact` vs `.contact`, network-aware delete) |
| **README & documentation** | Generated this README with setup instructions and design rationale |

All code was reviewed and validated through multiple test runs against the live application.

## Total Time Spent

| Phase | Estimated Time |
|-------|---------------|
| Application exploration & flow identification | ~20 min |
| Project scaffolding & configuration | ~10 min |
| Page Object Model implementation | ~15 min |
| Test implementation (E2E + validation) | ~20 min |
| Debugging & locator fixes (3 iterations) | ~25 min |
| Report generation & screenshots | ~5 min |
| README & documentation | ~10 min |
| **Total** | **~1 hour 45 minutes** |
