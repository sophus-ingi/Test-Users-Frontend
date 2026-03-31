import { setupDOM } from './setup.js';

// We need to mock the module before importing it
jest.mock('../js/info.js', () => ({
  baseUrl: 'http://localhost:8080',
}));

describe('Fake Data Generator Frontend - script.js', () => {
  
  beforeEach(() => {
    setupDOM();
    global.fetch.mockClear();
  });

  describe('Form Submission - Single Person', () => {
    test('should submit form for single person and fetch from /person endpoint', async () => {
      const mockData = {
        CPR: '1234567890',
        firstName: 'John',
        lastName: 'Doe',
        gender: 'M',
        birthDate: '1990-01-01',
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      // Import and run the script
      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      const submitEvent = new Event('submit');
      form.dispatchEvent(submitEvent);

      // Wait for fetch to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/person');
    });

    test('should display person data in output section', async () => {
      const mockData = {
        CPR: '1234567890',
        firstName: 'John',
        lastName: 'Doe',
        gender: 'M',
        birthDate: '1990-01-01',
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      const submitEvent = new Event('submit');
      form.dispatchEvent(submitEvent);

      await new Promise(resolve => setTimeout(resolve, 100));

      const output = document.querySelector('#output');
      expect(output.classList.contains('hidden')).toBe(false);
      expect(output.innerHTML).not.toBe('');
    });
  });

  describe('Form Submission - Multiple Persons', () => {
    test('should fetch with query parameter for multiple persons', async () => {
      const mockData = [
        { CPR: '1111111111', firstName: 'John', lastName: 'Doe' },
        { CPR: '2222222222', firstName: 'Jane', lastName: 'Smith' },
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      const numberInput = document.querySelector('#txtNumberPersons');
      numberInput.value = '2';

      const submitEvent = new Event('submit');
      form.dispatchEvent(submitEvent);

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/person?n=2');
    });

    test('should render multiple person cards', async () => {
      const mockData = [
        { CPR: '1111111111', firstName: 'John', lastName: 'Doe' },
        { CPR: '2222222222', firstName: 'Jane', lastName: 'Smith' },
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      const numberInput = document.querySelector('#txtNumberPersons');
      numberInput.value = '2';

      const submitEvent = new Event('submit');
      form.dispatchEvent(submitEvent);

      await new Promise(resolve => setTimeout(resolve, 100));

      const output = document.querySelector('#output');
      const cards = output.querySelectorAll('.personCard');
      expect(cards.length).toBe(2);
    });
  });

  describe('Partial Data Options', () => {
    const testPartialOptions = [
      'cpr',
      'name-gender',
      'name-gender-dob',
      'cpr-name-gender',
      'cpr-name-gender-dob',
      'address',
      'phone',
    ];

    testPartialOptions.forEach((option) => {
      test(`should fetch from /${option} endpoint when selected`, async () => {
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ CPR: '1234567890' }),
        });

        await import('../js/script.js');

        const form = document.querySelector('#frmGenerate');
        const partialRadio = document.querySelector('#chkPartialOptions');
        const partialSelect = document.querySelector('#cmbPartialOptions');

        partialRadio.checked = true;
        partialSelect.value = option;

        const submitEvent = new Event('submit');
        form.dispatchEvent(submitEvent);

        await new Promise(resolve => setTimeout(resolve, 100));

        expect(global.fetch).toHaveBeenCalledWith(`http://localhost:8080/${option}`);
      });
    });
  });

  describe('Data Rendering', () => {
    test('should render CPR when present in data', async () => {
      const mockData = { CPR: '1234567890' };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      form.dispatchEvent(new Event('submit'));

      await new Promise(resolve => setTimeout(resolve, 100));

      const cprValue = document.querySelector('.cprValue');
      expect(cprValue.innerText).toBe('1234567890');
      expect(cprValue.classList.contains('hidden')).toBe(false);
    });

    test('should render name when present in data', async () => {
      const mockData = { firstName: 'John', lastName: 'Doe' };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      form.dispatchEvent(new Event('submit'));

      await new Promise(resolve => setTimeout(resolve, 100));

      const firstNameValue = document.querySelector('.firstNameValue');
      const lastNameValue = document.querySelector('.lastNameValue');
      expect(firstNameValue.innerText).toBe('John');
      expect(lastNameValue.innerText).toBe('Doe');
      expect(firstNameValue.classList.contains('hidden')).toBe(false);
      expect(lastNameValue.classList.contains('hidden')).toBe(false);
    });

    test('should render gender when present in data', async () => {
      const mockData = { gender: 'M' };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      form.dispatchEvent(new Event('submit'));

      await new Promise(resolve => setTimeout(resolve, 100));

      const genderValue = document.querySelector('.genderValue');
      expect(genderValue.innerText).toBe('M');
      expect(genderValue.classList.contains('hidden')).toBe(false);
    });

    test('should render birth date when present in data', async () => {
      const mockData = { birthDate: '1990-01-01' };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      form.dispatchEvent(new Event('submit'));

      await new Promise(resolve => setTimeout(resolve, 100));

      const dobValue = document.querySelector('.dobValue');
      expect(dobValue.innerText).toBe('1990-01-01');
      expect(dobValue.classList.contains('hidden')).toBe(false);
    });

    test('should render address when present in data', async () => {
      const mockData = {
        address: {
          street: 'Main Street',
          number: '123',
          floor: '1',
          door: 'A',
          postal_code: '2100',
          town_name: 'Copenhagen',
        },
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      form.dispatchEvent(new Event('submit'));

      await new Promise(resolve => setTimeout(resolve, 100));

      const streetValue = document.querySelector('.streetValue');
      const townValue = document.querySelector('.townValue');
      expect(streetValue.innerText).toBe('Main Street 123, 1.A');
      expect(townValue.innerText).toBe('2100 Copenhagen');
      expect(streetValue.classList.contains('hidden')).toBe(false);
      expect(townValue.classList.contains('hidden')).toBe(false);
    });

    test('should render phone number when present in data', async () => {
      const mockData = { phoneNumber: '+45 12345678' };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      form.dispatchEvent(new Event('submit'));

      await new Promise(resolve => setTimeout(resolve, 100));

      const phoneValue = document.querySelector('.phoneNumberValue');
      expect(phoneValue.innerText).toBe('+45 12345678');
      expect(phoneValue.classList.contains('hidden')).toBe(false);
    });

    test('should not render fields that are undefined', async () => {
      const mockData = { CPR: '1234567890' };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      form.dispatchEvent(new Event('submit'));

      await new Promise(resolve => setTimeout(resolve, 100));

      const firstNameValue = document.querySelector('.firstNameValue');
      expect(firstNameValue.classList.contains('hidden')).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should display error message on fetch failure', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      form.dispatchEvent(new Event('submit'));

      await new Promise(resolve => setTimeout(resolve, 100));

      const output = document.querySelector('#output');
      expect(output.innerText).toContain('There was a problem communicating with the API');
    });

    test('should display error message on 404 response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      form.dispatchEvent(new Event('submit'));

      await new Promise(resolve => setTimeout(resolve, 100));

      const output = document.querySelector('#output');
      expect(output.innerText).toContain('There was a problem communicating with the API');
    });

    test('should add error class on API error', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      form.dispatchEvent(new Event('submit'));

      await new Promise(resolve => setTimeout(resolve, 100));

      const output = document.querySelector('#output');
      expect(output.classList.contains('error')).toBe(true);
    });

    test('should clear error message after 2 seconds', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      form.dispatchEvent(new Event('submit'));

      await new Promise(resolve => setTimeout(resolve, 100));

      const output = document.querySelector('#output');
      expect(output.innerText).toContain('There was a problem');

      jest.advanceTimersByTime(2000);

      expect(output.innerHTML).toBe('');
      expect(output.classList.contains('error')).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    test('should handle single object response (not array)', async () => {
      const mockData = { CPR: '1234567890', firstName: 'John' };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      form.dispatchEvent(new Event('submit'));

      await new Promise(resolve => setTimeout(resolve, 100));

      const cards = document.querySelectorAll('.personCard');
      expect(cards.length).toBe(1);
    });

    test('should clear previous output on new submission', async () => {
      const mockData1 = { CPR: '1111111111' };
      const mockData2 = { CPR: '2222222222' };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData1,
      });

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      form.dispatchEvent(new Event('submit'));

      await new Promise(resolve => setTimeout(resolve, 100));

      let output = document.querySelector('#output');
      expect(output.innerText).toContain('1111111111');

      // Second submission
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData2,
      });

      form.dispatchEvent(new Event('submit'));

      await new Promise(resolve => setTimeout(resolve, 100));

      output = document.querySelector('#output');
      expect(output.innerText).not.toContain('1111111111');
      expect(output.innerText).toContain('2222222222');
    });

    test('should prevent default form submission', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ CPR: '1234567890' }),
      });

      await import('../js/script.js');

      const form = document.querySelector('#frmGenerate');
      const submitEvent = new Event('submit');
      const preventDefaultSpy = jest.spyOn(submitEvent, 'preventDefault');

      form.dispatchEvent(submitEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });
});
