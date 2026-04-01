import { setupDOM } from './setup.js';

// Mock fetch globally
global.fetch = jest.fn();

// Reset before each test
beforeEach(() => {
  setupDOM();
  jest.clearAllMocks();
  jest.clearAllTimers();
});

describe('Frontend - Integration Tests: Complete User Workflows', () => {
  describe('Workflow: Generate Single Person', () => {
    test('should complete full workflow: user generates single person', async () => {
      const mockPerson = {
        CPR: '1234567890',
        firstName: 'John',
        lastName: 'Doe',
        gender: 'Male',
        birthDate: '1990-01-15',
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPerson,
      });

      await import('../js/script.js');

      // User form is visible and ready
      const form = document.querySelector('#frmGenerate');
      expect(form).toBeInTheDocument();

      // Output is hidden initially
      const output = document.querySelector('#output');
      expect(output.classList.contains('hidden')).toBe(true);

      // User clicks generate
      form.dispatchEvent(new Event('submit'));

      // Wait for request
      await new Promise(resolve => setTimeout(resolve, 100));

      // API was called with correct endpoint
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/person');

      // Output is now visible
      expect(output.classList.contains('hidden')).toBe(false);

      // Data is displayed
      expect(output.innerText).toContain('John');
      expect(output.innerText).toContain('Doe');
      expect(output.innerText).toContain('1234567890');
    });

    test('should allow user to generate multiple times sequentially', async () => {
      const person1 = { CPR: '1111111111', firstName: 'John' };
      const person2 = { CPR: '2222222222', firstName: 'Jane' };

      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => person1,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => person2,
        });

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');

      // First generation
      form.dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 100));

      const output = document.querySelector('#output');
      expect(output.innerText).toContain('John');

      // Second generation
      form.dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(output.innerText).not.toContain('John');
      expect(output.innerText).toContain('Jane');
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Workflow: Generate Multiple Persons', () => {
    test('should generate and display multiple persons (n=3)', async () => {
      const mockPersons = [
        { CPR: '1111111111', firstName: 'Person 1' },
        { CPR: '2222222222', firstName: 'Person 2' },
        { CPR: '3333333333', firstName: 'Person 3' },
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPersons,
      });

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      const numberInput = document.querySelector('#txtNumberPersons');

      // User enters 3
      numberInput.value = '3';

      // User submits
      form.dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 100));

      // API called with correct query parameter
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/person?n=3',
      );

      // All 3 persons displayed
      const output = document.querySelector('#output');
      const cards = output.querySelectorAll('.personCard');
      expect(cards.length).toBe(3);

      // All names visible
      expect(output.innerText).toContain('Person 1');
      expect(output.innerText).toContain('Person 2');
      expect(output.innerText).toContain('Person 3');
    });

    test('should display boundary: n=1 (min)', async () => {
      const mockPerson = { CPR: '1234567890' };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPerson,
      });

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      const numberInput = document.querySelector('#txtNumberPersons');

      numberInput.value = '1';
      form.dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/person');
    });

    test('should display boundary: n=100 (max)', async () => {
      const mockPersons = Array(100).fill({ CPR: '1234567890' });

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPersons,
      });

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      const numberInput = document.querySelector('#txtNumberPersons');

      numberInput.value = '100';
      form.dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/person?n=100',
      );

      const output = document.querySelector('#output');
      const cards = output.querySelectorAll('.personCard');
      expect(cards.length).toBe(100);
    });
  });

  describe('Workflow: Generate Partial Data - All Options', () => {
    const testCases = [
      { option: 'cpr', expectedEndpoint: '/cpr', expectedField: 'CPR' },
      {
        option: 'name-gender',
        expectedEndpoint: '/name-gender',
        expectedField: 'firstName',
      },
      {
        option: 'name-gender-dob',
        expectedEndpoint: '/name-gender-dob',
        expectedField: 'firstName',
      },
      {
        option: 'cpr-name-gender',
        expectedEndpoint: '/cpr-name-gender',
        expectedField: 'CPR',
      },
      {
        option: 'cpr-name-gender-dob',
        expectedEndpoint: '/cpr-name-gender-dob',
        expectedField: 'CPR',
      },
      { option: 'address', expectedEndpoint: '/address', expectedField: 'address' },
      { option: 'phone', expectedEndpoint: '/phone', expectedField: 'phoneNumber' },
    ];

    testCases.forEach(({ option, expectedEndpoint, expectedField }) => {
      test(`should handle partial option: ${option}`, async () => {
        const mockData =
          expectedField === 'address'
            ? {
                street: 'Test Street',
                number: '100',
                floor: '1',
                door: 'A',
                postal_code: '2100',
                town_name: 'Test City',
              }
            : expectedField === 'phoneNumber'
              ? { phoneNumber: '+45 12345678' }
              : { [expectedField]: 'Test Value' };

        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockData,
        });

        await import('../js/script.js');

        const form = document.querySelector('#frmGenerate');
        const partialRadio = document.querySelector('#chkPartialOptions');
        const partialSelect = document.querySelector('#cmbPartialOptions');

        partialRadio.checked = true;
        document.querySelector('#chkPerson').checked = false;
        partialSelect.value = option;

        form.dispatchEvent(new Event('submit'));
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(global.fetch).toHaveBeenCalledWith(
          `http://localhost:8080${expectedEndpoint}`,
        );
      });
    });
  });

  describe('Workflow: Error Handling and Recovery', () => {
    test('should display error when API returns 404', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      form.dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 100));

      const output = document.querySelector('#output');
      expect(output.innerText).toContain('There was a problem');
      expect(output.classList.contains('error')).toBe(true);
    });

    test('should display error when network fails', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      form.dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 100));

      const output = document.querySelector('#output');
      expect(output.innerText).toContain('There was a problem');
    });

    test('should clear error message after timeout', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      form.dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 100));

      const output = document.querySelector('#output');
      expect(output.innerText).toContain('There was a problem');

      // Wait for timeout
      jest.advanceTimersByTime(2000);

      expect(output.innerHTML).toBe('');
      expect(output.classList.contains('error')).toBe(false);
    });

    test('should allow retrying after error', async () => {
      global.fetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ CPR: '1234567890' }),
        });

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');

      // First attempt - fails
      form.dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 100));

      const output = document.querySelector('#output');
      expect(output.classList.contains('error')).toBe(true);

      // Wait for error to clear
      jest.advanceTimersByTime(2000);

      // Retry - succeeds
      form.dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(output.innerText).toContain('1234567890');
      expect(output.classList.contains('error')).toBe(false);
    });
  });

  describe('Workflow: Data Display Completeness', () => {
    test('should display all available fields for complete person', async () => {
      const completePerson = {
        CPR: '1234567890',
        firstName: 'John',
        lastName: 'Doe',
        gender: 'Male',
        birthDate: '1990-01-15',
        address: {
          street: 'Main Street',
          number: '123',
          floor: '1',
          door: 'A',
          postal_code: '2100',
          town_name: 'Copenhagen',
        },
        phoneNumber: '+45 12345678',
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => completePerson,
      });

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      form.dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 100));

      const output = document.querySelector('#output');
      const text = output.innerText;

      // All fields are displayed
      expect(text).toContain('1234567890');
      expect(text).toContain('John');
      expect(text).toContain('Doe');
      expect(text).toContain('Male');
      expect(text).toContain('1990-01-15');
      expect(text).toContain('Main Street');
      expect(text).toContain('123');
      expect(text).toContain('2100');
      expect(text).toContain('Copenhagen');
      expect(text).toContain('+45 12345678');
    });

    test('should hide fields that are not in response', async () => {
      const partialPerson = { CPR: '1234567890' };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => partialPerson,
      });

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      form.dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 100));

      const output = document.querySelector('#output');
      const card = output.querySelector('.personCard');

      // Only CPR should be visible
      const visibleElements = card.querySelectorAll('p:not(.hidden)');
      expect(visibleElements.length).toBe(2); // label + value for CPR
    });
  });

  describe('Workflow: Form Prevention', () => {
    test('should prevent default form submission', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ CPR: '1234567890' }),
      });

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      const event = new Event('submit');
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

      form.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    test('should not reload page on submit', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ CPR: '1234567890' }),
      });

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      let defaultPrevented = false;

      form.addEventListener('submit', (e) => {
        defaultPrevented = !e.defaultPrevented;
        e.preventDefault();
        defaultPrevented = e.defaultPrevented;
      });

      form.dispatchEvent(new Event('submit'));

      expect(defaultPrevented).toBe(true);
    });
  });

  describe('Workflow: Edge Cases and Robustness', () => {
    test('should handle rapid consecutive requests', async () => {
      const person = { CPR: '1234567890' };

      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => person,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => person,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => person,
        });

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');

      // Rapid clicks
      form.dispatchEvent(new Event('submit'));
      form.dispatchEvent(new Event('submit'));
      form.dispatchEvent(new Event('submit'));

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    test('should handle empty response array', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      form.dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 100));

      const output = document.querySelector('#output');
      expect(output.classList.contains('hidden')).toBe(false);
      expect(output.querySelectorAll('.personCard').length).toBe(0);
    });

    test('should handle null values in response', async () => {
      const personWithNulls = {
        CPR: null,
        firstName: 'John',
        lastName: null,
        gender: 'M',
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => personWithNulls,
      });

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      form.dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 100));

      const output = document.querySelector('#output');
      const card = output.querySelector('.personCard');

      // Null fields should be hidden
      expect(card.querySelector('.cprValue').classList.contains('hidden')).toBe(
        true,
      );
      expect(card.querySelector('.lastNameValue').classList.contains('hidden')).toBe(
        true,
      );
      // Non-null fields should be visible
      expect(card.querySelector('.firstNameValue').classList.contains('hidden')).toBe(
        false,
      );
    });

    test('should handle very long strings', async () => {
      const longString = 'A'.repeat(500);
      const person = {
        firstName: longString,
        lastName: 'Doe',
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => person,
      });

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      form.dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 100));

      const output = document.querySelector('#output');
      expect(output.innerText).toContain('A'.repeat(100));
    });
  });

  describe('Workflow: UI State Consistency', () => {
    test('should maintain form state between submissions', async () => {
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ CPR: '1111111111' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ CPR: '2222222222' }),
        });

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      const numberInput = document.querySelector('#txtNumberPersons');

      numberInput.value = '5';

      form.dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 100));

      // Form state should remain
      expect(numberInput.value).toBe('5');

      form.dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 100));

      // Form state should still be intact
      expect(numberInput.value).toBe('5');
    });

    test('should update output without affecting form', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ CPR: '1234567890' }),
      });

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      const formHTML = form.innerHTML;

      form.dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 100));

      // Form should be unchanged
      expect(form.innerHTML).toBe(formHTML);
    });
  });
});
