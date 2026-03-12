# FRONTEND TEST GUIDELINES (For Copilot)

Use this document as the required workflow whenever creating, updating, or executing frontend unit tests in this repository.

## 1) Required Stack

- Test runner: **Vitest**
- UI testing: **React Testing Library**
- Matchers: **@testing-library/jest-dom**
- User interactions: **@testing-library/user-event**

If these are not configured yet, create or update test setup in the same change before adding tests.

## 2) Scope to Cover

Create tests for all relevant frontend layers touched by a change:

1. **API modules** (`src/components/**/api/*.ts`)
2. **React components** (`src/components/**/*.tsx`)
3. **Domain models/value objects** (`src/components/**/domain/*.ts`)
4. **Auth/config utilities** (`src/config/*.ts`, auth helpers)

Do not skip a layer if behavior changed there.

## 3) Non-Negotiable Rules

1. Write tests for behavior, not implementation details.
2. Include at least one success path and one failure/edge path.
3. Keep tests deterministic (no real network calls, no time-based flakiness).
4. Use the simplest valid mocking strategy per test.
5. Keep test files focused and readable.
6. Do not modify production code only to make testing easier unless necessary and justified.

## 4) Test File Placement & Naming

- Prefer colocated test files next to the source file.
- Use one of:
  - `*.test.ts`
  - `*.test.tsx`
  - `*.spec.ts`
  - `*.spec.tsx`

Examples:

- `src/components/orders/api/order-list.test.ts`
- `src/components/orders/orders-main.test.tsx`
- `src/config/authHeader.test.ts`

## 5) Standard Workflow (Must Follow Every Time)

### Step A: Understand change impact

- Identify the changed behavior and affected modules/components.
- List expected user-visible outcomes and failure modes.

### Step B: Choose test type(s)

- API module unit test
- Component test
- Domain/unit logic test
- Utility/auth config test

Select all that apply for the change.

### Step C: Prepare test environment

- For component tests requiring routing, use `MemoryRouter`.
- For React Query hooks/components, wrap with `QueryClientProvider` using an isolated test client.
- Reset global mocks between tests (`beforeEach`/`afterEach`).

### Step D: Implement tests

- Arrange: build inputs/mocks with minimal required data.
- Act: execute the function or render/interact with component.
- Assert: verify outputs/UI/side-effects.

### Step E: Run quality gates

Run all relevant checks and ensure they pass:

1. `npm run test`
2. `npm run lint`

If scripts are missing, add them as part of the same change before finalizing.

### Step F: Report results

Summarize:

- What was tested
- Which files were added/updated
- Command results (`test`, `lint`)
- Any known limitations or follow-ups

## 6) Mocking Strategy (Flexible, Choose Simplest)

Allowed approaches:

1. `vi.mock` + direct `fetch` mocking
2. **MSW** request handlers

Decision rule:

- Use direct mocks for small isolated unit tests.
- Use MSW when multiple request scenarios are needed and readability improves.

Always avoid real API calls.

## 7) Layer-Specific Expectations

### 7.1 API Module Tests

For modules like `order-list.ts`, `create-order.ts`, `customer-list.ts`, etc.:

- Assert request URL and HTTP method.
- Assert headers/body formation (including auth headers where relevant).
- Assert success parsing behavior.
- Assert non-OK response handling and thrown error message.

### 7.2 Component Tests

For screens like orders/customers/users main/detail pages:

- Validate loading state.
- Validate error state.
- Validate empty state (when applicable).
- Validate success rendering (table/list rows, key text).
- Validate user interaction outcomes (button click, navigation intent, callback).

### 7.3 Domain Model Tests

For pure domain/value objects:

- Validate construction and invariants.
- Validate computed getters/formatting behavior.
- Validate invalid input behavior (throw/fallback).

### 7.4 Auth/Config Utility Tests

For `authHeader.ts`, config helpers, and browser-global usage:

- Mock `localStorage` access explicitly.
- Mock/restore `window.location` only when needed.
- Validate token-present and token-absent branches.
- Validate env-based configuration branches where applicable.

## 8) Test Quality Checklist

Before finalizing, verify all are true:

- [ ] Tests are meaningful and behavior-focused.
- [ ] Happy path + failure/edge path are covered.
- [ ] No real network dependency exists.
- [ ] Mocks are reset/isolated.
- [ ] Test names clearly describe behavior.
- [ ] `npm run test` passes.
- [ ] `npm run lint` passes.

## 9) Anti-Patterns (Do Not Do)

- Do not assert internal implementation details when public behavior is sufficient.
- Do not over-mock React internals.
- Do not create brittle selectors when semantic queries are available.
- Do not leave skipped tests without clear TODO context.
- Do not finalize work without executing tests and lint.

## 10) Lint Auto-Fix Retry Rule

If `npm run lint` fails and the error is specifically about unused variables or unused imports, automatically:

1. Remove or refactor the unused code.
2. Run `npm run lint` again.
3. Repeat until lint passes or the issue is no longer an unused-variable/unused-import error.

Do not stop at the first lint failure when this category of error is fixable.

## 11) Minimal Result Template for Copilot

Use this summary format after test work:

1. **Added/Updated tests:** `<list of test files>`
2. **Covered behaviors:** `<short bullet list>`
3. **Commands run:**
   - `npm run test` → `<pass/fail>`
   - `npm run lint` → `<pass/fail>`
4. **Open follow-ups (if any):** `<none or short list>`
