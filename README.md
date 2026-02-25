# Shady Meadows B&B — Playwright Test Automation

Automated tests for [automationintesting.online](https://automationintesting.online/), a hotel booking demo app.

---

## About the Application

I started by spending some time clicking through the app to understand what it does. It's a B&B hotel site with two sides:
- **Public site** — homepage with room listings, a booking flow, and a contact form
- **Admin panel** at `/admin` — login, room management (CRUD), reports, branding, messages

The backend has a REST API with proper validation rules, which makes it good for both positive and negative testing.

---

## What I Automated and Why

After exploring the app, I picked flows based on what a real user would actually do, and what gives the best coverage without being flaky.

### 1. Guest Room Booking — End to End (`tests/booking.spec.ts`)

This is the main thing a guest comes to the site to do: find a room and book it.

**Steps:** Homepage → browse rooms → click "Book now" → land on reservation page → verify room details and price → click "Reserve Now" → fill in guest details (name, email, phone) → submit → see "Booking Confirmed" with correct dates → return to homepage.

I picked this because it's the **primary user journey** and touches multiple pages. One thing I had to figure out was that the "Book now" on room cards goes to `/reservation/{id}?checkin=...&checkout=...` — the dates come from the URL params, not a manual calendar pick, which made it more stable to automate.

### 2. Admin Room CRUD — End to End (`tests/e2e.spec.ts`)

**Steps:** Go to `/admin` → login → verify redirect to `/admin/rooms` → create a new room (Suite, £250, with features) → verify it shows up in the list → delete it → verify it's gone → logout → verify redirect to homepage.

I chose this because it covers **auth + create + read + delete + session management** in one test. The key challenge was making it work on a shared public instance — other people's data is there too. So I used a unique room name (timestamp-based) and relative count assertions instead of hardcoded numbers.

### 3. Validation & Negative Tests (`tests/validation.spec.ts`)

| Test | What I'm checking |
|------|-------------------|
| **Invalid login** | Wrong credentials → "Invalid credentials" error, still on login page, can't access rooms |
| **Empty contact form** | Submit with nothing filled → 5 validation errors show up (Name, Email, Phone, Subject, Message) |
| **Too-short inputs** | Fill form with values that are too short → specific length errors (e.g., "Phone must be between 11 and 21 characters") |
| **Valid contact submission** | Fill everything correctly → success message: "Thanks for getting in touch {name}!" |

I went with the contact form for validation testing because it has **clear, specific error messages** returned from the backend — good for asserting exact behavior. The invalid login test is a straightforward negative case that every app should have.

---

## Test Summary

| # | Test | File | Type |
|---|------|------|------|
| 1 | Guest books a room end-to-end | `booking.spec.ts` | E2E |
| 2 | Admin login → create room → delete → logout | `e2e.spec.ts` | E2E |
| 3 | Invalid admin login | `validation.spec.ts` | Negative |
| 4 | Contact form — blank submission | `validation.spec.ts` | Validation |
| 5 | Contact form — invalid input lengths | `validation.spec.ts` | Validation |
| 6 | Contact form — successful submission | `validation.spec.ts` | Positive |

---

## Project Structure

```
├── tests/                      # Test specs
│   ├── booking.spec.ts         # Guest booking journey
│   ├── e2e.spec.ts             # Admin room management
│   └── validation.spec.ts      # Login + contact form validation (4 tests)
├── pages/                      # Page Object Models
│   ├── reservation.page.ts     # Reservation/booking page
│   ├── admin-login.page.ts     # Admin login
│   ├── admin-rooms.page.ts     # Admin rooms management
│   ├── admin-nav.page.ts       # Admin navigation bar
│   ├── contact-form.page.ts    # Public contact form
│   ├── home.page.ts            # Public homepage
│   └── index.ts                # Barrel export
├── fixtures/
│   └── test-fixtures.ts        # Custom Playwright fixtures
├── data/
│   └── test-data.ts            # Test data (credentials, guest info, error messages)
├── utils/
│   └── helpers.ts              # Utility functions
├── playwright.config.ts        # Config (base URL, timeouts, reporters, artifacts)
├── .env.example                # Environment variable template
└── test-results/               # Screenshots, traces, videos (generated on failure)
```

---

## Setup & Run

### Prerequisites

- Node.js >= 18
- npm

### Installation

```bash
git clone https://github.com/jhasaurav316/Shady-Meadows.git
cd Shady-Meadows

npm install
npx playwright install chromium
cp .env.example .env
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BASE_URL` | `https://automationintesting.online` | App URL |
| `ADMIN_USERNAME` | `admin` | Admin username |
| `ADMIN_PASSWORD` | `password` | Admin password |

### Running

```bash
npm test                    # All tests, headless
npm run test:headed         # See the browser
npm run test:ui             # Playwright UI mode (interactive)
npm run test:debug          # Step-by-step debugger
npm run test:e2e            # Only admin E2E
npm run test:validation     # Only validation tests
npm run report              # Open HTML report
```

---

## Test Report

After running `npm test`, an HTML report is generated in `playwright-report/`. View it with `npm run report`.

On failure, these are auto-captured in `test-results/`:

| Artifact | When | How to view |
|----------|------|-------------|
| Screenshots | On failure | Open the PNG directly |
| Traces | On failure | `npx playwright show-trace <path>` |
| Videos | On failure | Open the WebM file |

---

## Decisions I Made

### Picking the flows

I wanted a mix: one flow that covers what a **guest** does (booking), one that covers what an **admin** does (room CRUD), and a few validation tests for negative coverage. I skipped things like the branding page or reports because they don't add much new coverage on top of what the CRUD test already exercises.

### Locators

I went with a priority order:
1. `data-testid` attributes first — the contact form has these (`ContactName`, `ContactEmail`, etc.)
2. `#id` selectors for elements that have stable IDs (`#doLogin`, `#createRoom`, `#doReservation`)
3. `:has-text()` filters when I need to find a specific row in a list (e.g., finding a room by name)
4. CSS classes as a last resort (`.roomDelete`, `.room-firstname`)

I avoided XPath entirely and tried to stay away from brittle positional selectors.

### Page Object Model

I created a separate page class for each page/section of the app (6 total). Each one owns its locators and exposes action methods like `login()`, `createRoom()`, `fillGuestDetails()`. The tests themselves just call these methods — if a selector changes, I fix it in one place.

### Dealing with the shared instance

This is a public demo app that anyone can use, so I couldn't assume a clean state. Here's how I handled it:
- **Room names** are generated with a timestamp suffix so they don't collide with other users' data
- **Booking dates** are randomized 120–180 days in the future — avoids stepping on existing bookings
- **The admin test cleans up after itself** — it creates a room then deletes it
- **Assertions are relative** — I check "room count increased" not "room count is exactly 4"

### Network-level waits

For the room delete, I initially had a flaky test because the UI hadn't updated by the time I asserted. I fixed it by using `waitForResponse()` to wait for the actual DELETE API call to complete before checking the DOM. This made it reliable.

### Why TypeScript

The app is a Next.js/React project, so staying in the TypeScript ecosystem felt natural. Also, the type safety helps catch issues early — especially with the page object method signatures and test data shapes.

---

## AI Usage

I used **Claude Code** (Anthropic's CLI tool) to help with parts of this assignment. Here's what it helped with and what I did myself:

- **Exploring the app:** I used Claude to fetch pages and inspect the DOM structure — element IDs, form fields, API endpoints, error messages. This saved time compared to doing it all through browser DevTools manually.
- **Scaffolding:** Claude helped generate the initial project structure, playwright config, and tsconfig. I reviewed and adjusted the config values.
- **Writing page objects and tests:** Claude wrote the initial versions based on the DOM analysis. I ran them, they failed (wrong selectors, wrong URLs), and I iterated on fixes — this back-and-forth took about 3 rounds.
- **Documentation:** Claude drafted the README. I rewrote sections to reflect my actual thought process.

The core decisions — which flows to automate, how to handle the shared instance, the locator priority — those were mine. Claude was the implementation accelerator.

---

## Total Time Spent

| Phase | Time |
|-------|------|
| Exploring the app, clicking around, understanding the flows | ~20 min |
| Setting up the project (init, install, config) | ~10 min |
| Building page objects (6 pages) | ~20 min |
| Writing tests (booking + admin CRUD + validation) | ~25 min |
| Debugging selectors and fixing flaky bits (3 rounds) | ~25 min |
| Generating reports and capturing screenshots | ~5 min |
| Writing this README | ~15 min |
| **Total** | **~2 hours** |
