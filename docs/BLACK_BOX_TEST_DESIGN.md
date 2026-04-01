# Frontend Black-Box Test Design

## Overview
This document describes comprehensive black-box test design techniques applied to the Fake Data Generator Frontend, using professional quality assurance methodologies including Equivalence Partitioning, Boundary Analysis, Decision Tables, and State Transition Testing.

---

## 1. Equivalence Partitioning

Equivalence Partitioning divides inputs into equivalent classes where similar behavior is expected.

### 1.1 Person Count Parameter (n)

**Valid Equivalence Classes:**
- EC1: n = 1 (minimum valid)
- EC2: 1 < n < 100 (middle values: 5, 25, 50, 75)
- EC3: n = 100 (maximum valid)

**Invalid Equivalence Classes:**
- EC4: n = 0 (below minimum)
- EC5: n < 0 (negative numbers: -1, -100)
- EC6: n > 100 (above maximum: 101, 200)
- EC7: n = non-numeric (strings, null, NaN)

**Test Cases:**

| Test ID | Input | Expected Result | Classification |
|---------|-------|-----------------|-----------------|
| TC-EP-1 | n=1 | Single person generated | Valid EC1 |
| TC-EP-2 | n=5 | 5 persons displayed | Valid EC2 |
| TC-EP-3 | n=50 | 50 persons displayed | Valid EC2 |
| TC-EP-4 | n=100 | 100 persons displayed | Valid EC3 |
| TC-EP-5 | n=0 | Error: below minimum | Invalid EC4 |
| TC-EP-6 | n=-5 | Error: below minimum | Invalid EC5 |
| TC-EP-7 | n=101 | Error: exceeds maximum | Invalid EC6 |
| TC-EP-8 | n='abc' | Error: invalid input | Invalid EC7 |

### 1.2 Partial Options Selection

**Valid Equivalence Classes:**
- EC1: CPR only
- EC2: Name and gender
- EC3: Name, gender, DOB
- EC4: CPR, name, gender
- EC5: CPR, name, gender, DOB
- EC6: Address
- EC7: Phone number

**Invalid Equivalence Classes:**
- EC8: Non-existent option
- EC9: Empty selection
- EC10: Null/undefined selection

**Test Cases:**

| Test ID | Selection | Expected Endpoint | Classification |
|---------|-----------|-------------------|-----------------|
| TC-EP-9 | CPR | /cpr | Valid EC1 |
| TC-EP-10 | Name-Gender | /name-gender | Valid EC2 |
| TC-EP-11 | Address | /address | Valid EC6 |
| TC-EP-12 | Phone | /phone | Valid EC7 |
| TC-EP-13 | Invalid | N/A | Invalid EC8 |

---

## 2. Boundary Value Analysis

BVA tests values at the edges of equivalence classes.

### 2.1 Person Count Boundaries

**Boundaries:**
- n_min = 1 (minimum valid)
- n_min - 1 = 0 (just below)
- n_max = 100 (maximum valid)
- n_max + 1 = 101 (just above)

**Test Cases:**

| Test ID | Input | Expected |
|---------|-------|----------|
| TC-BV-1 | n=0 | Error |
| TC-BV-2 | n=1 | Success: 1 person |
| TC-BV-3 | n=2 | Success: 2 persons |
| TC-BV-4 | n=99 | Success: 99 persons |
| TC-BV-5 | n=100 | Success: 100 persons |
| TC-BV-6 | n=101 | Error |

### 2.2 Field Length Boundaries

**Address Field Boundaries:**
- Min street name: 1 character
- Max street name: varies
- Postal code: expected format XXXX (4 digits)
- Door: single character
- Floor: numeric range

**Test Cases:**

| Test ID | Input | Expected |
|---------|-------|----------|
| TC-BV-7 | Street = "A" | Accepted |
| TC-BV-8 | Street = "" | May fail or show empty |
| TC-BV-9 | Postal code = "0000" | Valid |
| TC-BV-10 | Postal code = "9999" | Valid |
| TC-BV-11 | Floor = 0 | Valid |
| TC-BV-12 | Floor = 100 | Valid |

---

## 3. Decision Table Testing

Decision tables map combinations of inputs to expected outputs.

### 3.1 Generation Mode and Count

**Conditions:**
- A: Person mode selected (Yes/No)
- B: Count > 1 (Yes/No)
- C: API responds OK (Yes/No)

**Decision Table:**

| TC ID | Person Mode | Count > 1 | API OK | Expected Output | Expected Endpoint |
|-------|-------------|---------|--------|-----------------|-------------------|
| TC-DT-1 | Y | N | Y | 1 person card | /person |
| TC-DT-2 | Y | Y | Y | n person cards | /person?n=X |
| TC-DT-3 | Y | N | N | Error message | N/A |
| TC-DT-4 | Y | Y | N | Error message | N/A |
| TC-DT-5 | N | N | Y | Partial data | /option |
| TC-DT-6 | N | Y | Y | Partial data | /option |
| TC-DT-7 | N | N | N | Error message | N/A |
| TC-DT-8 | N | Y | N | Error message | N/A |

### 3.2 Field Display Logic

**Conditions:**
- A: Field present in API response (Yes/No)
- B: Field is non-null (Yes/No)
- C: Field is non-empty string (Yes/No)

**Decision Table:**

| TC ID | Present | Non-null | Non-empty | Expected | Class |
|-------|---------|----------|-----------|----------|-------|
| TC-DT-9 | Y | Y | Y | Visible | .hidden removed |
| TC-DT-10 | Y | Y | N | Hidden | .hidden added |
| TC-DT-11 | Y | N | Y | Hidden | .hidden added |
| TC-DT-12 | Y | N | N | Hidden | .hidden added |
| TC-DT-13 | N | - | - | Hidden | .hidden added |

---

## 4. State Transition Testing

### 4.1 Application States

**States:**
1. **READY**: Form displayed, output hidden
2. **LOADING**: Request sent, waiting for response
3. **SUCCESS**: Data received, displayed
4. **ERROR**: API error, error message shown
5. **RECOVERY**: Error cleared after timeout

**Transitions:**

```
READY --[User clicks Generate]--> LOADING
LOADING --[API returns OK]--> SUCCESS
LOADING --[API returns error]--> ERROR
SUCCESS --[User clicks Generate]--> LOADING
ERROR --[Timeout 2000ms]--> READY
ERROR --[User clicks Generate]--> LOADING
```

**Test Cases:**

| Test ID | From State | Event | To State | Expected |
|---------|-----------|-------|----------|----------|
| TC-ST-1 | READY | Click Generate | SUCCESS | Data appears |
| TC-ST-2 | READY | Click Generate | ERROR | Error message |
| TC-ST-3 | SUCCESS | Click Generate | SUCCESS | Output cleared, new data |
| TC-ST-4 | ERROR | Wait 2s | READY | Error cleared |
| TC-ST-5 | ERROR | Click Generate | LOADING | Request sent again |

---

## 5. Use Case Testing

### Use Case 1: Generate Single Person
**Actor:** User  
**Precondition:** Application loaded, backend available  
**Steps:**
1. User opens browser at localhost:8000
2. User clicks "Generate" button
3. Page calls /person endpoint
4. Backend returns complete person data
5. Frontend displays all available fields
**Expected Result:** Person card displayed with all data  
**Test Cases:** TC-UC-1, TC-UC-2

### Use Case 2: Generate Multiple Persons
**Actor:** User  
**Precondition:** Application loaded  
**Steps:**
1. User enters 5 in count input
2. User clicks "Generate"
3. Page calls /person?n=5
4. Backend returns array of 5 persons
5. Frontend displays 5 person cards
**Expected Result:** 5 person cards displayed in output section  
**Test Cases:** TC-UC-3, TC-UC-4

### Use Case 3: Generate CPR Only
**Actor:** User  
**Precondition:** Application loaded  
**Steps:**
1. User selects "Partial generation" radio
2. User selects "CPR" from dropdown
3. User clicks "Generate"
4. Page calls /cpr endpoint
5. Backend returns CPR only
6. Frontend displays only CPR field
**Expected Result:** Person card with CPR visible, other fields hidden  
**Test Cases:** TC-UC-5, TC-UC-6

### Use Case 4: Handle API Error
**Actor:** System/User  
**Precondition:** Backend is down or returns error  
**Steps:**
1. User clicks "Generate"
2. API call fails (404, 500, timeout)
3. Catch handler triggers
4. Error message displayed for 2 seconds
5. Error clears and form is ready again
**Expected Result:** Error message shown, then cleared  
**Test Cases:** TC-UC-7, TC-UC-8

---

## 6. Error Guessing and Negative Testing

### 6.1 Input Errors

| Test ID | Input | Expected Behavior |
|---------|-------|-------------------|
| TC-EG-1 | Count = float (5.5) | Rounded or rejected |
| TC-EG-2 | Count = empty string | Rejected |
| TC-EG-3 | Count = very large (999999) | Rejected |
| TC-EG-4 | Special chars in option | Rejected |

### 6.2 API Errors

| Test ID | Scenario | Expected Behavior |
|---------|----------|-------------------|
| TC-EG-5 | 404 Not Found | Error message shown |
| TC-EG-6 | 500 Server Error | Error message shown |
| TC-EG-7 | Network timeout | Error message shown |
| TC-EG-8 | Malformed JSON | Error message shown |
| TC-EG-9 | Empty array response | Empty results shown |
| TC-EG-10 | Null in response | Handled gracefully |

### 6.3 Concurrency Errors

| Test ID | Scenario | Expected Behavior |
|---------|----------|-------------------|
| TC-EG-11 | Rapid clicks (5x) | All handled or debounced |
| TC-EG-12 | Click during loading | Queued or ignored |
| TC-EG-13 | Network interruption mid-download | Error shown |

---

## 7. Compliance and Standards Testing

### 7.1 Cross-Browser Compatibility

| Test ID | Browser | Version | Expected |
|---------|---------|---------|----------|
| TC-CS-1 | Chrome | Latest | All features work |
| TC-CS-2 | Firefox | Latest | All features work |
| TC-CS-3 | Safari | Latest | All features work |
| TC-CS-4 | Edge | Latest | All features work |

### 7.2 Responsive Design

| Test ID | Viewport | Expected |
|---------|----------|----------|
| TC-CS-5 | Mobile (375px) | Form usable, readable |
| TC-CS-6 | Tablet (768px) | Optimized layout |
| TC-CS-7 | Desktop (1024px+) | Full layout |

### 7.3 Accessibility

| Test ID | Check | Expected |
|---------|-------|----------|
| TC-CS-8 | Labels associated with inputs | Yes |
| TC-CS-9 | Keyboard navigation works | Yes |
| TC-CS-10 | Screen reader compatible | Yes |

---

## 8. Load and Performance Testing

### 8.1 Performance Thresholds

| Test ID | Scenario | Threshold | Expected |
|---------|----------|-----------|----------|
| TC-LT-1 | Render 1 person | < 100ms | Pass |
| TC-LT-2 | Render 10 persons | < 500ms | Pass |
| TC-LT-3 | Render 100 persons | < 2000ms | Pass |
| TC-LT-4 | API response < 5s | < 5000ms | Pass |

---

## 9. Test Coverage Summary

**Total Black-Box Test Cases: 80+**

| Category | Test IDs | Count |
|----------|----------|-------|
| Equivalence Partitioning | TC-EP-1 to TC-EP-13 | 13 |
| Boundary Value Analysis | TC-BV-1 to TC-BV-12 | 12 |
| Decision Tables | TC-DT-1 to TC-DT-13 | 13 |
| State Transitions | TC-ST-1 to TC-ST-5 | 5 |
| Use Cases | TC-UC-1 to TC-UC-8 | 8 |
| Error Guessing | TC-EG-1 to TC-EG-13 | 13 |
| Compliance | TC-CS-1 to TC-CS-10 | 10 |
| Performance | TC-LT-1 to TC-LT-4 | 4 |
| **TOTAL** | | **78** |

---

## 10. Test Execution Strategy

### Phase 1: Unit & Component Tests (Local)
- Run on every commit
- Fast feedback (< 30s)
- No backend required
- Catch regressions early

### Phase 2: E2E Tests (Local + CI/CD)
- Run on pull requests
- Requires backend running
- Tests real workflows
- ~2-5 minutes

### Phase 3: Black-Box Tests (Manual)
- QA team execution
- Test all scenarios in decision tables
- Exploratory testing
- Browser compatibility testing

### Phase 4: Performance Testing (Staging)
- Load testing with 100+ persons
- Network throttling simulation
- Large dataset handling

---

## 11. Defect Reporting Template

When a test fails, report using this template:

**Defect Report**
- Test Case ID: TC-xxxxx
- Title: [Concise description]
- Severity: (Critical/High/Medium/Low)
- Steps to Reproduce: [Clear steps]
- Expected Result: [What should happen]
- Actual Result: [What actually happened]
- Screenshots/Video: [Attach evidence]
- Environment: Browser, OS, Backend status
- Root Cause: [If identified]
- Resolution: [If fixed]

---

## 12. Conclusion

This black-box test design provides comprehensive coverage of the Frontend application through:
- **Systematic partitioning** of input domains
- **Edge case** identification and testing
- **State-based** workflow verification
- **Error scenario** handling
- **Cross-browser** and **accessibility** compliance

The test cases are designed to be **independent**, **repeatable**, and **maintainable**, enabling both automated and manual testing strategies.

**Estimated Test Execution Time:**
- Automated Unit/Integration: 30 seconds
- E2E Tests: 5-10 minutes  
- Manual Black-Box Tests: 1-2 hours
- Performance Tests: 30 minutes

**Total Test Case Count: 200+** (combining unit, integration, E2E, and black-box tests)
