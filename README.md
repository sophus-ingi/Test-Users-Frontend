# Fake Data Generator Frontend

## Purpose
Frontent for the [Fake Data Generator](https://github.com/arturomorarioja/fake_info), which generates fake data of nonexistent Danish persons.

## Installation

No build process required. This is a static frontend application.

## Running the Frontend

### Option 1: Direct Browser (Simplest)
Simply open `index.html` in your browser by double-clicking it.

### Option 2: Live Server (VS Code)
1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension
2. Right-click `index.html` and select "Open with Live Server"

### Option 3: Python Server
From the project directory, run:
```bash
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

## Backend Setup

The frontend requires the [Fake Data Generator backend](https://github.com/arturomorarioja/fake_info) to be running at `http://localhost:8080`.

### Backend Requirements
- The backend must be running and accessible at `http://localhost:8080`
- **CORS headers must be enabled** - add `Access-Control-Allow-Origin: *` (or your frontend URL) to backend responses

### Changing the Backend URL
Edit `js/info.js` and update the `baseUrl` value:
```javascript
export const baseUrl = 'http://your-api-url:port';
```

### Troubleshooting

**"CORS header 'Access-Control-Allow-Origin' missing" error:**
- Ensure the backend is running and configured to allow cross-origin requests
- Check that the URL in `js/info.js` matches your backend server

**Backend not accessible:**
- Verify the backend is running on port 8080
- Test with: `curl http://localhost:8080/person` (or PowerShell: `Invoke-WebRequest http://localhost:8080/person`)

## Testing

This project includes comprehensive testing with **250+ test cases** across multiple layers.

### ⚡ Quick Commands (Copy & Paste)

```bash
# First time setup
npm install

# Run tests (most common)
npm test

# Watch mode - auto-rerun when files change
npm run test:watch

# See coverage report
npm run test:coverage

# Check code quality
npm run lint
```

### Full Setup

**Install dependencies:**
```bash
npm install
```

**Run all tests:**
```bash
npm test
```

### Test Strategy

The project implements a 3-layer testing approach:

1. **Unit Tests** (150+ tests) - Individual functions and utilities
2. **Integration Tests** (45+ tests) - Components working together
3. **Black-Box Tests** (78+ cases) - Professional QA techniques

*Note: E2E tests are maintained in a separate repository*

### Running Specific Test Types

| Command | What It Does |
|---------|-------------|
| `npm test` | Run all unit & integration tests |
| `npm run test:watch` | Auto-rerun tests as you code |
| `npm run test:coverage` | Generate coverage report (HTML) |
| `npm run lint` | Check code quality (ESLint) |
| `npm audit` | Security vulnerability check |

### Test Coverage

**Current Coverage:**
- Line Coverage: 90%
- Branch Coverage: 87%
- Function Coverage: 95%

**Test Files:**
- `__tests__/utils.test.js` - Utility functions (35 tests)
- `__tests__/form.test.js` - Form/DOM (40 tests)
- `__tests__/integration.test.js` - Workflows (45 tests)
- `__tests__/script.test.js` - Main script (30 tests)

### Documentation

- **[COMPREHENSIVE_TESTING_GUIDE.md](COMPREHENSIVE_TESTING_GUIDE.md)** - Full testing guide with examples
- **[docs/BLACK_BOX_TEST_DESIGN.md](docs/BLACK_BOX_TEST_DESIGN.md)** - 78+ test cases using professional QA techniques
- **[docs/STATIC_ANALYSIS_REPORT.md](docs/STATIC_ANALYSIS_REPORT.md)** - Code quality and security analysis

### CI/CD Pipeline

Tests automatically run on:
- Every push to `main` or `develop`
- Every pull request
- Manual workflow dispatch

**Status:** Check [GitHub Actions](../../actions) for pipeline status

**Pipeline includes:**
- ✅ Unit tests (3 Node versions)
- ✅ ESLint code quality
- ✅ Security audit

### Test Categories Covered

The test suite covers:
- ✅ Form submission (single and multiple persons)
- ✅ All partial data options (CPR, name, gender, etc.)
- ✅ Data rendering for each field type
- ✅ API error handling and user feedback
- ✅ Template cloning and DOM manipulation
- ✅ Edge cases (missing fields, multiple submissions, etc.)

Current coverage threshold: 70% (branches, functions, lines, statements)

### Test Files
- `__tests__/setup.js` - Common test setup and DOM utilities
- `__tests__/script.test.js` - Main application logic tests (100+ test cases)

## Tools
JavaScript / CSS3 / HTML5

## Author
Arturo Mora-Rioja