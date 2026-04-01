/**
 * Utility functions for the Fake Data Generator Frontend
 */

/**
 * Format address data into readable string
 * @param {Object} address - Address object with street, number, floor, door, postal_code, town_name
 * @returns {string} Formatted address string
 */
export function formatAddress(address) {
  if (!address) return '';
  const { street, number, floor, door, postal_code, town_name } = address;
  return {
    street: `${street} ${number}, ${floor}.${door}`,
    town: `${postal_code} ${town_name}`,
  };
}

/**
 * Format person data for display
 * @param {Object} person - Person data object
 * @returns {Object} Formatted person data
 */
export function formatPersonData(person) {
  if (!person) return null;

  const formatted = {};

  if (person.CPR) formatted.cpr = person.CPR;
  if (person.firstName && person.lastName) {
    formatted.name = `${person.firstName} ${person.lastName}`;
  }
  if (person.gender) formatted.gender = person.gender;
  if (person.birthDate) formatted.birthDate = person.birthDate;
  if (person.address) {
    const addr = formatAddress(person.address);
    formatted.address = addr;
  }
  if (person.phoneNumber) formatted.phone = person.phoneNumber;

  return formatted;
}

/**
 * Validate form inputs
 * @param {number} personCount - Number of persons to generate
 * @returns {Object} Validation result { isValid: boolean, error?: string }
 */
export function validatePersonCount(personCount) {
  const num = parseInt(personCount);

  if (isNaN(num)) {
    return { isValid: false, error: 'Person count must be a number' };
  }

  if (num < 1) {
    return { isValid: false, error: 'Person count must be at least 1' };
  }

  if (num > 100) {
    return { isValid: false, error: 'Person count cannot exceed 100' };
  }

  return { isValid: true };
}

/**
 * Build API endpoint based on options
 * @param {boolean} isSinglePerson - Whether generating single person
 * @param {number} personCount - Number of persons
 * @param {string} partialOption - Partial option selected
 * @returns {string} API endpoint path
 */
export function buildApiEndpoint(isSinglePerson, personCount, partialOption) {
  if (isSinglePerson) {
    let endpoint = '/person';
    const count = parseInt(personCount);
    if (count > 1) {
      endpoint += `?n=${count}`;
    }
    return endpoint;
  }
  return `/${partialOption}`;
}

/**
 * Parse API response - ensure it's an array
 * @param {any} data - API response data
 * @returns {Array} Array of person objects
 */
export function parseApiResponse(data) {
  if (Array.isArray(data)) {
    return data;
  }
  return [data];
}

/**
 * Check if person object has specific field
 * @param {Object} person - Person object
 * @param {string} field - Field name to check
 * @returns {boolean} Whether field exists and is not undefined
 */
export function hasField(person, field) {
  return person && person[field] !== undefined && person[field] !== null;
}

/**
 * Get field display name
 * @param {string} field - Field name
 * @returns {string} Human-readable field name
 */
export function getFieldLabel(field) {
  const labels = {
    CPR: 'CPR',
    firstName: 'First Name',
    lastName: 'Last Name',
    gender: 'Gender',
    birthDate: 'Birth Date',
    address: 'Address',
    phoneNumber: 'Phone Number',
  };
  return labels[field] || field;
}

/**
 * Build CSS class names
 * @param {string} base - Base class name
 * @param {Object} conditionals - Object of condition: className pairs
 * @returns {string} Combined class names
 */
export function buildClasses(base, conditionals = {}) {
  const classes = [base];
  Object.entries(conditionals).forEach(([condition, className]) => {
    if (condition) classes.push(className);
  });
  return classes.join(' ');
}
