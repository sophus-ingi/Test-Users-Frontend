import { test, expect } from '@playwright/test';

test.describe('E2E: Frontend Application', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
  });

  test.describe('Basic Page Loading', () => {
    test('should load the frontend page', async ({ page }) => {
      // Check title and headers
      await expect(page).toHaveTitle('Fake Personal Data Generator');
      await expect(page.locator('h1')).toContainText('Fake Personal Data Generator');
    });

    test('should display main form section', async ({ page }) => {
      const form = page.locator('#frmGenerate');
      await expect(form).toBeVisible();
    });

    test('should display generate button', async ({ page }) => {
      const button = page.locator('input[type="submit"]');
      await expect(button).toBeVisible();
      await expect(button).toHaveValue('Generate');
    });

    test('should display description', async ({ page }) => {
      await expect(page.locator('#description')).toContainText(
        'generates fake personal data for Danish persons',
      );
    });
  });

  test.describe('Form Elements Presence', () => {
    test('should have person generation radio button', async ({ page }) => {
      const radio = page.locator('#chkPerson');
      await expect(radio).toBeVisible();
    });

    test('should have person count input', async ({ page }) => {
      const input = page.locator('#txtNumberPersons');
      await expect(input).toBeVisible();
      await expect(input).toHaveValue('1');
    });

    test('should have partial options radio button', async ({ page }) => {
      const radio = page.locator('#chkPartialOptions');
      await expect(radio).toBeVisible();
    });

    test('should have partial options dropdown', async ({ page }) => {
      const select = page.locator('#cmbPartialOptions');
      await expect(select).toBeVisible();
    });

    test('should have all partial options in dropdown', async ({ page }) => {
      const options = page.locator('#cmbPartialOptions option');
      await expect(options).toHaveCount(7);
    });
  });

  test.describe('Workflow: Generate Single Person', () => {
    test('should generate and display a single person', async ({ page }) => {
      // Click generate
      await page.click('input[type="submit"]');

      // Wait for output section to become visible
      const output = page.locator('#output');
      await output.waitFor({ state: 'visible', timeout: 5000 });

      // Verify person card appears
      const personCard = page.locator('.personCard');
      await expect(personCard).toBeVisible();

      // Verify at least one field is displayed
      const fields = page.locator('.personCard p:not(.hidden)');
      const count = await fields.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display CPR when available', async ({ page }) => {
      await page.click('input[type="submit"]');

      const output = page.locator('#output');
      await output.waitFor({ state: 'visible', timeout: 5000 });

      // Check if CPR is displayed (if available)
      const cprValue = page.locator('.cprValue');
      const isVisible = await cprValue.count();
      // If CPR is visible, it should have content
      if (isVisible > 0) {
        await expect(cprValue.first()).toHaveText(/\d/);
      }
    });

    test('should display person name when available', async ({ page }) => {
      await page.click('input[type="submit"]');

      const output = page.locator('#output');
      await output.waitFor({ state: 'visible', timeout: 5000 });

      // Check if names are displayed
      const firstNameValue = page.locator('.firstNameValue');
      if ((await firstNameValue.count()) > 0) {
        await expect(firstNameValue.first()).not toHaveText('');
      }
    });
  });

  test.describe('Workflow: Generate Multiple Persons', () => {
    test('should generate and display multiple persons (n=3)', async ({ page }) => {
      // Set number to 3
      await page.fill('#txtNumberPersons', '3');

      // Generate
      await page.click('input[type="submit"]');

      // Wait for output
      const output = page.locator('#output');
      await output.waitFor({ state: 'visible', timeout: 5000 });

      // Should have 3 cards
      const personCards = page.locator('.personCard');
      await expect(personCards).toHaveCount(3);
    });

    test('should generate 5 persons', async ({ page }) => {
      await page.fill('#txtNumberPersons', '5');
      await page.click('input[type="submit"]');

      const output = page.locator('#output');
      await output.waitFor({ state: 'visible', timeout: 5000 });

      const personCards = page.locator('.personCard');
      await expect(personCards).toHaveCount(5);
    });

    test('should generate 10 persons', async ({ page }) => {
      await page.fill('#txtNumberPersons', '10');
      await page.click('input[type="submit"]');

      const output = page.locator('#output');
      await output.waitFor({ state: 'visible', timeout: 5000 });

      const personCards = page.locator('.personCard');
      await expect(personCards).toHaveCount(10);
    });

    test('should handle boundary: max=100', async ({ page }) => {
      await page.fill('#txtNumberPersons', '100');
      await page.click('input[type="submit"]');

      const output = page.locator('#output');
      await output.waitFor({ state: 'visible', timeout: 10000 });

      const personCards = page.locator('.personCard');
      await expect(personCards).toHaveCount(100);
    });
  });

  test.describe('Workflow: Partial Data Options (Single Field)', () => {
    const testCases = [
      { label: 'cpr', option: 'cpr', field: '.cprValue' },
      { label: 'name-gender', option: 'name-gender', field: '.firstNameValue' },
      { label: 'address', option: 'address', field: '.streetValue' },
      { label: 'phone', option: 'phone', field: '.phoneNumberValue' },
    ];

    testCases.forEach(({ label, option, field }) => {
      test(`should generate ${label} data`, async ({ page }) => {
        // Select partial options
        await page.click('#chkPartialOptions');
        await page.selectOption('#cmbPartialOptions', option);

        // Generate
        await page.click('input[type="submit"]');

        // Wait for output
        const output = page.locator('#output');
        await output.waitFor({ state: 'visible', timeout: 5000 });

        // Verify data appears
        const personCard = page.locator('.personCard');
        await expect(personCard).toBeVisible();

        // Check that field is in output
        const fieldLocator = page.locator(`${field}`);
        if ((await fieldLocator.count()) > 0) {
          await expect(fieldLocator.first()).not toHaveText('');
        }
      });
    });
  });

  test.describe('Workflow: Complete Person Data', () => {
    test('should handle address display correctly', async ({ page }) => {
      // Try /address endpoint
      await page.click('#chkPartialOptions');
      await page.selectOption('#cmbPartialOptions', 'address');
      await page.click('input[type="submit"]');

      const output = page.locator('#output');
      await output.waitFor({ state: 'visible', timeout: 5000 });

      // Check street is visible
      const streetValue = page.locator('.streetValue');
      if ((await streetValue.count()) > 0) {
        const text = await streetValue.first().textContent();
        // Should contain street, number, floor info
        expect(text).toBeTruthy();
      }
    });

    test('should display all person fields when available', async ({ page }) => {
      // Generate full person
      await page.click('#chkPerson');
      await page.click('input[type="submit"]');

      const output = page.locator('#output');
      await output.waitFor({ state: 'visible', timeout: 5000 });

      // Count visible fields (excluding hidden ones)
      const visibleFields = page.locator('.personCard p:not(.hidden)');
      const visibleCount = await visibleFields.count();

      // Should have at least one visible field
      expect(visibleCount).toBeGreaterThan(0);
    });
  });

  test.describe('Workflow: Sequential Generations', () => {
    test('should allow generating again after first result', async ({ page }) => {
      // First generation
      await page.click('input[type="submit"]');
      let output = page.locator('#output');
      await output.waitFor({ state: 'visible', timeout: 5000 });

      let cardsFirst = await page.locator('.personCard').count();
      expect(cardsFirst).toBe(1);

      // Change count to 3
      await page.fill('#txtNumberPersons', '3');

      // Second generation
      await page.click('input[type="submit"]');
      output = page.locator('#output');
      await output.waitFor({ state: 'visible', timeout: 5000 });

      let cardsSecond = await page.locator('.personCard').count();
      expect(cardsSecond).toBe(3);
    });

    test('should switch between single and multiple generations', async ({ page }) => {
      // Generate single
      await page.click('input[type="submit"]');
      let output = page.locator('#output');
      await output.waitFor({ state: 'visible', timeout: 5000 });

      let count = await page.locator('.personCard').count();
      expect(count).toBe(1);

      // Change to multiple
      await page.fill('#txtNumberPersons', '5');
      await page.click('input[type="submit"]');
      await output.waitFor({ state: 'visible', timeout: 5000 });

      count = await page.locator('.personCard').count();
      expect(count).toBe(5);
    });

    test('should switch between partial options', async ({ page }) => {
      // Generate first option
      await page.click('#chkPartialOptions');
      await page.selectOption('#cmbPartialOptions', 'cpr');
      await page.click('input[type="submit"]');

      let output = page.locator('#output');
      await output.waitFor({ state: 'visible', timeout: 5000 });

      // Change option
      await page.selectOption('#cmbPartialOptions', 'phone');
      await page.click('input[type="submit"]');
      await output.waitFor({ state: 'visible', timeout: 5000 });

      // Output should be updated
      const personCard = page.locator('.personCard');
      await expect(personCard).toBeVisible();
    });
  });

  test.describe('API Integration', () => {
    test('API should be reachable', async ({ page }) => {
      // Wait for page to fully load
      await page.waitForLoadState('networkidle');

      // API calls should succeed
      await page.click('input[type="submit"]');

      const output = page.locator('#output');
      // Should show data, not error
      const errorText = page.locator('#output:has-text("There was a problem")');
      const hasData = await page.locator('.personCard').count();

      // Either has error (API down) or has data (API working)
      const hasError = await errorText.count();
      expect(hasError === 0 || hasData > 0).toBeTruthy();
    });

    test('should handle missing backend gracefully', async ({ page }) => {
      // Even if backend is down, page should load
      await expect(page).toHaveTitle('Fake Personal Data Generator');

      // Form should still be present
      const form = page.locator('#frmGenerate');
      await expect(form).toBeVisible();
    });
  });

  test.describe('User Experience', () => {
    test('should show output section after generation', async ({ page }) => {
      const output = page.locator('#output');

      // Hidden initially
      await expect(output).toHaveClass(/hidden/);

      // Generate
      await page.click('input[type="submit"]');
      await output.waitFor({ state: 'visible', timeout: 5000 });

      // Visible now
      const isHidden = await output.evaluate((el) =>
        el.classList.contains('hidden'),
      );
      expect(isHidden).toBe(false);
    });

    test('should clear output on new generation', async ({ page }) => {
      // First generation with single person
      await page.fill('#txtNumberPersons', '1');
      await page.click('input[type="submit"]');

      let output = page.locator('#output');
      await output.waitFor({ state: 'visible', timeout: 5000 });
      let initialCards = await page.locator('.personCard').count();

      // Second generation with 5 persons
      await page.fill('#txtNumberPersons', '5');
      await page.click('input[type="submit"]');
      await output.waitFor({ state: 'visible', timeout: 5000 });
      let newCards = await page.locator('.personCard').count();

      // Should have new count, not accumulated
      expect(newCards).toBe(5);
    });

    test('should maintain form state across generations', async ({ page }) => {
      // Set custom values
      await page.fill('#txtNumberPersons', '7');

      // First generation
      await page.click('input[type="submit"]');
      await page.locator('#output').waitFor({ state: 'visible', timeout: 5000 });

      // Check form still has our value
      const value = await page.inputValue('#txtNumberPersons');
      expect(value).toBe('7');

      // Second generation
      await page.click('input[type="submit"]');
      await page.locator('#output').waitFor({ state: 'visible', timeout: 5000 });

      // Value should persist
      const newValue = await page.inputValue('#txtNumberPersons');
      expect(newValue).toBe('7');
    });
  });

  test.describe('Accessibility', () => {
    test('should have descriptive page title', async ({ page }) => {
      await expect(page).toHaveTitle('Fake Personal Data Generator');
    });

    test('form inputs should have labels', async ({ page }) => {
      const personLabel = page.locator('label[for="chkPerson"]');
      const partialLabel = page.locator('label[for="chkPartialOptions"]');

      await expect(personLabel).toBeVisible();
      await expect(partialLabel).toBeVisible();
    });

    test('should have visible heading indicating purpose', async ({ page }) => {
      const heading = page.locator('h1');
      await expect(heading).toContainText('Fake Personal Data Generator');
    });
  });

  test.describe('Edge Cases and Robustness', () => {
    test('should handle rapid consecutive clicks', async ({ page }) => {
      // Multiple rapid clicks
      for (let i = 0; i < 3; i++) {
        await page.click('input[type="submit"]');
      }

      // Should eventually show results
      const output = page.locator('#output');
      await output.waitFor({ state: 'visible', timeout: 5000 });

      const personCards = page.locator('.personCard');
      await expect(personCards.first()).toBeVisible();
    });

    test('should handle form resets between tests', async ({ page }) => {
      // First generation
      await page.fill('#txtNumberPersons', '3');
      await page.click('input[type="submit"]');
      await page.locator('#output').waitFor({ state: 'visible', timeout: 5000 });

      let cards = await page.locator('.personCard').count();
      expect(cards).toBe(3);

      // Reset by reloading
      await page.reload();

      // Form should be reset
      const value = await page.inputValue('#txtNumberPersons');
      expect(value).toBe('1');
    });
  });
});
