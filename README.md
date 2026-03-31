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

## Tools
JavaScript / CSS3 / HTML5

## Author
Arturo Mora-Rioja