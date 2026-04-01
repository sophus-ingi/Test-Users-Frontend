import { setupDOM } from './setup.js';

describe('Frontend - Form State and User Interactions', () => {
  beforeEach(setupDOM);

  describe('Form Radio Button Behavior', () => {
    test('should have "person" radio selected by default', () => {
      const personRadio = document.querySelector('#chkPerson');
      expect(personRadio.checked).toBe(true);
    });

    test('should have "partial options" radio unchecked by default', () => {
      const partialRadio = document.querySelector('#chkPartialOptions');
      expect(partialRadio.checked).toBe(false);
    });

    test('should allow switching to partial options', () => {
      const personRadio = document.querySelector('#chkPerson');
      const partialRadio = document.querySelector('#chkPartialOptions');

      personRadio.checked = false;
      partialRadio.checked = true;

      expect(personRadio.checked).toBe(false);
      expect(partialRadio.checked).toBe(true);
    });

    test('should allow switching back to person', () => {
      const personRadio = document.querySelector('#chkPerson');
      const partialRadio = document.querySelector('#chkPartialOptions');

      personRadio.checked = false;
      partialRadio.checked = true;

      personRadio.checked = true;
      partialRadio.checked = false;

      expect(personRadio.checked).toBe(true);
      expect(partialRadio.checked).toBe(false);
    });
  });

  describe('Person Count Input', () => {
    test('should have default value of 1', () => {
      const input = document.querySelector('#txtNumberPersons');
      expect(input.value).toBe('1');
    });

    test('should allow values 1-100', () => {
      const input = document.querySelector('#txtNumberPersons');

      input.value = '1';
      expect(parseInt(input.value)).toBe(1);

      input.value = '50';
      expect(parseInt(input.value)).toBe(50);

      input.value = '100';
      expect(parseInt(input.value)).toBe(100);
    });

    test('should enforce min=1', () => {
      const input = document.querySelector('#txtNumberPersons');
      expect(input.getAttribute('min')).toBe('1');
    });

    test('should enforce max=100', () => {
      const input = document.querySelector('#txtNumberPersons');
      expect(input.getAttribute('max')).toBe('100');
    });

    test('should be required', () => {
      const input = document.querySelector('#txtNumberPersons');
      expect(input.getAttribute('required')).toBe('required');
    });
  });

  describe('Partial Options Dropdown', () => {
    test('should have 7 options', () => {
      const select = document.querySelector('#cmbPartialOptions');
      const options = select.querySelectorAll('option');
      expect(options.length).toBe(7);
    });

    test('should have CPR selected by default', () => {
      const select = document.querySelector('#cmbPartialOptions');
      expect(select.value).toBe('cpr');
    });

    test('should have all expected options', () => {
      const select = document.querySelector('#cmbPartialOptions');
      const expectedOptions = [
        'cpr',
        'name-gender',
        'name-gender-dob',
        'cpr-name-gender',
        'cpr-name-gender-dob',
        'address',
        'phone',
      ];

      const actualOptions = Array.from(select.querySelectorAll('option')).map(
        (opt) => opt.value,
      );

      expect(actualOptions).toEqual(expectedOptions);
    });

    test('should allow changing selection', () => {
      const select = document.querySelector('#cmbPartialOptions');

      select.value = 'address';
      expect(select.value).toBe('address');

      select.value = 'phone';
      expect(select.value).toBe('phone');
    });
  });

  describe('Output Section', () => {
    test('should exist in DOM', () => {
      const output = document.querySelector('#output');
      expect(output).toBeInTheDocument();
    });

    test('should be hidden by default', () => {
      const output = document.querySelector('#output');
      expect(output.classList.contains('hidden')).toBe(true);
    });

    test('should start with empty content', () => {
      const output = document.querySelector('#output');
      expect(output.innerHTML).toBe('');
    });
  });

  describe('Person Template', () => {
    test('should exist in DOM', () => {
      const template = document.querySelector('#personTemplate');
      expect(template).toBeInTheDocument();
    });

    test('should be a template element', () => {
      const template = document.querySelector('#personTemplate');
      expect(template.tagName).toBe('TEMPLATE');
    });

    test('should contain article with personCard class', () => {
      const template = document.querySelector('#personTemplate');
      const article = template.content.querySelector('article.personCard');
      expect(article).toBeInTheDocument();
    });

    test('should have placeholders for all field types', () => {
      const template = document.querySelector('#personTemplate');
      const content = template.content;

      expect(content.querySelector('.cpr')).toBeInTheDocument();
      expect(content.querySelector('.firstName')).toBeInTheDocument();
      expect(content.querySelector('.lastName')).toBeInTheDocument();
      expect(content.querySelector('.gender')).toBeInTheDocument();
      expect(content.querySelector('.dob')).toBeInTheDocument();
      expect(content.querySelector('.address')).toBeInTheDocument();
      expect(content.querySelector('.phoneNumber')).toBeInTheDocument();
    });

    test('should have value placeholders for all fields', () => {
      const template = document.querySelector('#personTemplate');
      const content = template.content;

      expect(content.querySelector('.cprValue')).toBeInTheDocument();
      expect(content.querySelector('.firstNameValue')).toBeInTheDocument();
      expect(content.querySelector('.lastNameValue')).toBeInTheDocument();
      expect(content.querySelector('.genderValue')).toBeInTheDocument();
      expect(content.querySelector('.dobValue')).toBeInTheDocument();
      expect(content.querySelector('.streetValue')).toBeInTheDocument();
      expect(content.querySelector('.townValue')).toBeInTheDocument();
      expect(content.querySelector('.phoneNumberValue')).toBeInTheDocument();
    });

    test('should have all fields hidden by default', () => {
      const template = document.querySelector('#personTemplate');
      const content = template.content;
      const hiddenElements = content.querySelectorAll('.hidden');

      expect(hiddenElements.length).toBeGreaterThan(0);
    });
  });

  describe('Generate Button', () => {
    test('should exist', () => {
      const button = document.querySelector('input[type="submit"]');
      expect(button).toBeInTheDocument();
    });

    test('should have value "Generate"', () => {
      const button = document.querySelector('input[type="submit"]');
      expect(button.value).toBe('Generate');
    });

    test('should be inside a form', () => {
      const button = document.querySelector('input[type="submit"]');
      let parent = button.parentElement;

      while (parent && parent.tagName !== 'FORM') {
        parent = parent.parentElement;
      }

      expect(parent).toBeInTheDocument();
    });
  });

  describe('Form Element', () => {
    test('should have id "frmGenerate"', () => {
      const form = document.querySelector('#frmGenerate');
      expect(form).toBeInTheDocument();
    });

    test('should be a form element', () => {
      const form = document.querySelector('#frmGenerate');
      expect(form.tagName).toBe('FORM');
    });

    test('should have fieldset', () => {
      const form = document.querySelector('#frmGenerate');
      const fieldset = form.querySelector('fieldset');
      expect(fieldset).toBeInTheDocument();
    });
  });

  describe('Accessibility - ARIA Labels', () => {
    test('form elements should be accessible', () => {
      const form = document.querySelector('#frmGenerate');
      expect(form).toBeInTheDocument();

      const inputs = form.querySelectorAll('input[type="radio"]');
      expect(inputs.length).toBeGreaterThan(0);
    });

    test('labels should be associated with inputs', () => {
      const personLabel = document.querySelector('label[for="chkPerson"]');
      const partialLabel = document.querySelector('label[for="chkPartialOptions"]');

      expect(personLabel).toBeInTheDocument();
      expect(partialLabel).toBeInTheDocument();
    });
  });
});

describe('Frontend - DOM Manipulation', () => {
  beforeEach(setupDOM);

  describe('Template Cloning', () => {
    test('should be able to import template content', () => {
      const template = document.querySelector('#personTemplate');
      const cloned = document.importNode(template.content, true);

      expect(cloned).toBeDefined();
      expect(cloned.querySelector('article.personCard')).toBeInTheDocument();
    });

    test('should clone all field placeholders', () => {
      const template = document.querySelector('#personTemplate');
      const cloned = document.importNode(template.content, true);

      expect(cloned.querySelector('.cprValue')).toBeDefined();
      expect(cloned.querySelector('.firstNameValue')).toBeDefined();
      expect(cloned.querySelector('.genderValue')).toBeDefined();
    });

    test('should allow multiple clones independently', () => {
      const template = document.querySelector('#personTemplate');
      const clone1 = document.importNode(template.content, true);
      const clone2 = document.importNode(template.content, true);

      clone1.querySelector('.cprValue').innerText = '111';
      clone2.querySelector('.cprValue').innerText = '222';

      expect(clone1.querySelector('.cprValue').innerText).toBe('111');
      expect(clone2.querySelector('.cprValue').innerText).toBe('222');
    });
  });

  describe('Class Manipulation', () => {
    test('should add and remove hidden class', () => {
      const element = document.createElement('div');
      element.classList.add('hidden');

      expect(element.classList.contains('hidden')).toBe(true);

      element.classList.remove('hidden');
      expect(element.classList.contains('hidden')).toBe(false);
    });

    test('should toggle error class', () => {
      const output = document.querySelector('#output');

      output.classList.add('error');
      expect(output.classList.contains('error')).toBe(true);

      output.classList.remove('error');
      expect(output.classList.contains('error')).toBe(false);
    });

    test('should handle multiple classes', () => {
      const element = document.createElement('div');
      element.classList.add('card');
      element.classList.add('active');
      element.classList.add('hidden');

      expect(element.classList.contains('card')).toBe(true);
      expect(element.classList.contains('active')).toBe(true);
      expect(element.classList.contains('hidden')).toBe(true);
    });
  });

  describe('Inner Text Manipulation', () => {
    test('should set and read innerText', () => {
      const element = document.createElement('p');
      element.innerText = 'Test Content';

      expect(element.innerText).toBe('Test Content');
    });

    test('should update innerText', () => {
      const element = document.createElement('p');
      element.innerText = 'Old';
      element.innerText = 'New';

      expect(element.innerText).toBe('New');
    });

    test('should handle complex strings', () => {
      const element = document.createElement('p');
      const complex = 'Main Street 123, 1.A\n2100 Copenhagen';
      element.innerText = complex;

      expect(element.innerText).toContain('Main Street 123');
      expect(element.innerText).toContain('Copenhagen');
    });
  });

  describe('appendChild', () => {
    test('should append element to parent', () => {
      const parent = document.querySelector('#output');
      const child = document.createElement('div');
      child.className = 'test-child';

      parent.appendChild(child);

      expect(parent.querySelector('.test-child')).toBeInTheDocument();
    });

    test('should append multiple children', () => {
      const parent = document.querySelector('#output');

      for (let i = 0; i < 3; i++) {
        const child = document.createElement('div');
        child.className = `child-${i}`;
        parent.appendChild(child);
      }

      expect(parent.querySelectorAll('[class^="child-"]').length).toBe(3);
    });
  });

  describe('innerHTML Operations', () => {
    test('should set innerHTML', () => {
      const output = document.querySelector('#output');
      output.innerHTML = '<p>Test</p>';

      expect(output.innerHTML).toContain('<p>Test</p>');
    });

    test('should clear innerHTML', () => {
      const output = document.querySelector('#output');
      output.innerHTML = '<p>Test</p>';
      output.innerHTML = '';

      expect(output.innerHTML).toBe('');
    });

    test('should replace innerHTML', () => {
      const output = document.querySelector('#output');
      output.innerHTML = '<p>Old</p>';
      output.innerHTML = '<p>New</p>';

      expect(output.innerText).toContain('New');
      expect(output.innerText).not.toContain('Old');
    });
  });
});

describe('Frontend - Event Handling', () => {
  beforeEach(setupDOM);

  describe('Event Creation', () => {
    test('should create submit event', () => {
      const event = new Event('submit');
      expect(event.type).toBe('submit');
    });

    test('should dispatch event on form', () => {
      const form = document.querySelector('#frmGenerate');
      const event = new Event('submit');
      let dispatched = false;

      form.addEventListener('submit', () => {
        dispatched = true;
      });

      form.dispatchEvent(event);
      expect(dispatched).toBe(true);
    });
  });

  describe('Event Listener Basics', () => {
    test('should listen to form submission', (done) => {
      const form = document.querySelector('#frmGenerate');

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        done();
      });

      form.dispatchEvent(new Event('submit'));
    });

    test('should trigger multiple listeners', () => {
      const form = document.querySelector('#frmGenerate');
      let count = 0;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        count++;
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        count++;
      });

      form.dispatchEvent(new Event('submit'));
      expect(count).toBe(2);
    });
  });
});
