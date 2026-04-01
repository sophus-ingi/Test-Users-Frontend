import {
  formatAddress,
  formatPersonData,
  validatePersonCount,
  buildApiEndpoint,
  parseApiResponse,
  hasField,
  getFieldLabel,
  buildClasses,
} from '../js/utils.js';

describe('Utils - Data Formatting', () => {
  describe('formatAddress', () => {
    test('should format complete address correctly', () => {
      const address = {
        street: 'Main Street',
        number: '123',
        floor: '1',
        door: 'A',
        postal_code: '2100',
        town_name: 'Copenhagen',
      };

      const result = formatAddress(address);

      expect(result.street).toBe('Main Street 123, 1.A');
      expect(result.town).toBe('2100 Copenhagen');
    });

    test('should handle null address', () => {
      expect(formatAddress(null)).toBe('');
    });

    test('should handle undefined address', () => {
      expect(formatAddress(undefined)).toBe('');
    });

    test('should handle address with missing fields', () => {
      const address = {
        street: 'Main Street',
        number: '123',
      };

      const result = formatAddress(address);
      expect(result.street).toContain('Main Street 123');
    });
  });

  describe('formatPersonData', () => {
    test('should format complete person data', () => {
      const person = {
        CPR: '1234567890',
        firstName: 'John',
        lastName: 'Doe',
        gender: 'M',
        birthDate: '1990-01-01',
        phoneNumber: '+45 12345678',
      };

      const result = formatPersonData(person);

      expect(result.cpr).toBe('1234567890');
      expect(result.name).toBe('John Doe');
      expect(result.gender).toBe('M');
      expect(result.birthDate).toBe('1990-01-01');
      expect(result.phone).toBe('+45 12345678');
    });

    test('should handle partial person data', () => {
      const person = { CPR: '1234567890' };
      const result = formatPersonData(person);

      expect(result.cpr).toBe('1234567890');
      expect(result.name).toBeUndefined();
    });

    test('should not include name if firstName missing', () => {
      const person = { lastName: 'Doe' };
      const result = formatPersonData(person);

      expect(result.name).toBeUndefined();
    });

    test('should not include name if lastName missing', () => {
      const person = { firstName: 'John' };
      const result = formatPersonData(person);

      expect(result.name).toBeUndefined();
    });

    test('should handle null person', () => {
      expect(formatPersonData(null)).toBeNull();
    });

    test('should handle undefined person', () => {
      expect(formatPersonData(undefined)).toBeNull();
    });

    test('should format address within person data', () => {
      const person = {
        address: {
          street: 'Main St',
          number: '100',
          floor: '2',
          door: 'B',
          postal_code: '1000',
          town_name: 'Aarhus',
        },
      };

      const result = formatPersonData(person);

      expect(result.address).toBeDefined();
      expect(result.address.street).toContain('Main St 100');
    });
  });
});

describe('Utils - Validation', () => {
  describe('validatePersonCount', () => {
    test('should accept valid counts', () => {
      expect(validatePersonCount(1).isValid).toBe(true);
      expect(validatePersonCount(5).isValid).toBe(true);
      expect(validatePersonCount(100).isValid).toBe(true);
    });

    test('should reject count of 0', () => {
      const result = validatePersonCount(0);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at least 1');
    });

    test('should reject negative count', () => {
      const result = validatePersonCount(-5);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at least 1');
    });

    test('should reject count over 100', () => {
      const result = validatePersonCount(101);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('cannot exceed 100');
    });

    test('should reject non-numeric input', () => {
      const result = validatePersonCount('abc');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be a number');
    });

    test('should accept string numbers', () => {
      expect(validatePersonCount('5').isValid).toBe(true);
      expect(validatePersonCount('100').isValid).toBe(true);
    });

    test('should handle boundary: 1 (min)', () => {
      expect(validatePersonCount(1).isValid).toBe(true);
    });

    test('should handle boundary: 100 (max)', () => {
      expect(validatePersonCount(100).isValid).toBe(true);
    });

    test('should reject float values above max', () => {
      const result = validatePersonCount(100.5);
      expect(result.isValid).toBe(false);
    });
  });
});

describe('Utils - API Endpoint Building', () => {
  describe('buildApiEndpoint', () => {
    test('should build /person for single person', () => {
      const endpoint = buildApiEndpoint(true, 1, null);
      expect(endpoint).toBe('/person');
    });

    test('should build /person?n=X for multiple persons', () => {
      const endpoint = buildApiEndpoint(true, 5, null);
      expect(endpoint).toBe('/person?n=5');
    });

    test('should build /cpr for CPR partial option', () => {
      const endpoint = buildApiEndpoint(false, null, 'cpr');
      expect(endpoint).toBe('/cpr');
    });

    test('should build /name-gender for name-gender option', () => {
      const endpoint = buildApiEndpoint(false, null, 'name-gender');
      expect(endpoint).toBe('/name-gender');
    });

    test('should build /address for address option', () => {
      const endpoint = buildApiEndpoint(false, null, 'address');
      expect(endpoint).toBe('/address');
    });

    test('should build /phone for phone option', () => {
      const endpoint = buildApiEndpoint(false, null, 'phone');
      expect(endpoint).toBe('/phone');
    });

    const allPartialOptions = [
      'cpr',
      'name-gender',
      'name-gender-dob',
      'cpr-name-gender',
      'cpr-name-gender-dob',
      'address',
      'phone',
    ];

    allPartialOptions.forEach((option) => {
      test(`should handle ${option} partial option`, () => {
        const endpoint = buildApiEndpoint(false, null, option);
        expect(endpoint).toBe(`/${option}`);
      });
    });
  });
});

describe('Utils - Response Parsing', () => {
  describe('parseApiResponse', () => {
    test('should return single object as array', () => {
      const data = { CPR: '1234567890' };
      const result = parseApiResponse(data);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
      expect(result[0]).toEqual(data);
    });

    test('should return array as-is', () => {
      const data = [
        { CPR: '1111111111' },
        { CPR: '2222222222' },
      ];
      const result = parseApiResponse(data);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result).toEqual(data);
    });

    test('should handle empty array', () => {
      const result = parseApiResponse([]);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    test('should handle null', () => {
      const result = parseApiResponse(null);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
      expect(result[0]).toBeNull();
    });
  });
});

describe('Utils - Field Checking', () => {
  describe('hasField', () => {
    const person = {
      CPR: '1234567890',
      firstName: 'John',
      gender: null,
    };

    test('should return true for existing field with value', () => {
      expect(hasField(person, 'CPR')).toBe(true);
      expect(hasField(person, 'firstName')).toBe(true);
    });

    test('should return false for null field', () => {
      expect(hasField(person, 'gender')).toBe(false);
    });

    test('should return false for undefined field', () => {
      expect(hasField(person, 'nonexistent')).toBe(false);
    });

    test('should return false for null person', () => {
      expect(hasField(null, 'CPR')).toBe(false);
    });

    test('should return false for undefined person', () => {
      expect(hasField(undefined, 'CPR')).toBe(false);
    });
  });

  describe('getFieldLabel', () => {
    test('should return correct labels for known fields', () => {
      expect(getFieldLabel('CPR')).toBe('CPR');
      expect(getFieldLabel('firstName')).toBe('First Name');
      expect(getFieldLabel('lastName')).toBe('Last Name');
      expect(getFieldLabel('gender')).toBe('Gender');
      expect(getFieldLabel('birthDate')).toBe('Birth Date');
      expect(getFieldLabel('address')).toBe('Address');
      expect(getFieldLabel('phoneNumber')).toBe('Phone Number');
    });

    test('should return field name for unknown fields', () => {
      expect(getFieldLabel('unknown')).toBe('unknown');
    });
  });
});

describe('Utils - CSS Classes', () => {
  describe('buildClasses', () => {
    test('should return base class', () => {
      const result = buildClasses('button');
      expect(result).toBe('button');
    });

    test('should add conditional classes when true', () => {
      const result = buildClasses('card', { true: 'active' });
      expect(result).toBe('card active');
    });

    test('should not add conditional classes when false', () => {
      const result = buildClasses('card', { false: 'active' });
      expect(result).toBe('card');
    });

    test('should handle multiple conditionals', () => {
      const result = buildClasses('card', {
        true: 'active',
        false: 'hidden',
        true: 'visible',
      });
      expect(result).toContain('card');
      expect(result).toContain('active');
      // Note: object key collision means only one true: value
    });

    test('should handle empty conditionals', () => {
      const result = buildClasses('button', {});
      expect(result).toBe('button');
    });
  });
});
