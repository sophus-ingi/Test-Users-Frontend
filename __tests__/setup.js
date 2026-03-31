import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = jest.fn();

// Setup timers
jest.useFakeTimers();

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
  document.body.innerHTML = '';
});

// Helper to setup DOM with form
export function setupDOM() {
  document.body.innerHTML = `
    <form id="frmGenerate">
      <fieldset>
        <div id="person">
          <input type="radio" name="fake-data" id="chkPerson" checked>
          <input type="number" id="txtNumberPersons" min="1" max="100" value="1" required>
          <label for="chkPerson">person(s)</label>
        </div>
        <div id="partialOptions">
          <input type="radio" name="fake-data" id="chkPartialOptions">
          <label for="chkPartialOptions">Partial generation:</label>
          <select id="cmbPartialOptions">
            <option value="cpr" selected>CPR</option>
            <option value="name-gender">Name and gender</option>
            <option value="name-gender-dob">Name, gender and birthdate</option>
            <option value="cpr-name-gender">CPR, name and gender</option>
            <option value="cpr-name-gender-dob">CPR, name, gender, birthdate</option>
            <option value="address">Address</option>
            <option value="phone">Phone number</option>
          </select>
        </div>
        <div id="submit">
          <input type="submit" value="Generate">
        </div>
      </fieldset>
    </form>
    <section id="output" class="hidden"></section>
    <template id="personTemplate">
      <article class="personCard">
        <p class="hidden cpr">CPR: </p><p class="hidden cprValue"></p>
        <p class="hidden firstName">Name: </p><p class="hidden firstNameValue"></p><p class="hidden lastNameValue"></p>
        <p class="hidden gender">Gender: </p><p class="hidden genderValue"></p>
        <p class="hidden dob">DOB: </p><p class="hidden dobValue"></p>
        <p class="hidden address">Address: </p><p class="hidden streetValue"></p><p class="hidden townValue"></p>
        <p class="hidden phoneNumber">Phone: </p><p class="hidden phoneNumberValue"></p>
      </article>
    </template>
  `;
}
