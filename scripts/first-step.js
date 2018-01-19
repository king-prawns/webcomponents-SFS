class FirstStep extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.setDefault();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (this[attrName] !== newValue) {
      this[attrName] = newValue;
    }
  }

  static get observedAttributes() {
    return ['people'];
  }

  get people() {
    return this._people;
  }

  set people(value) {
    if (this.people === +value) return;
    this._people = +value;
    if (this.shadowRoot.children.length > 0) {
      this.setAttribute('people', value);
      this.render();
    }
  }

  get selected() {
    return this._selected;
  }

  set selected(value) {
    if (this.selected === +value) return;
    this._selected = +value;
  }

  disconnectedCallback() {
    this.shadowRoot
      .querySelector('#num_attendees')
      .removeEventListener('change', this.onAttChange);
    Array.from(
      this.shadowRoot.querySelectorAll('input[type="text"]')
    ).forEach(i => i.addEventListener('keyup', this.onInputkeyup));
  }

  connectedCallback() {
    this.render();
  }

  setDefault() {
    this.selected = 0;
    if (!this.hasAttribute('people')) {
      this.people = 5;
    }
    this.onAttChange = e => {
      this.selected = e.target.value;
      this.shadowRoot.querySelectorAll('#attendee_container > div').forEach(($el, i) => {
        this.changeAttribute($el, 'hide', this.selected >= (i + 1));
        this.changeAttribute($el.querySelector('input'), 'disabled', this.selected >= (i + 1));
      });
      this.sendResult(false);
    };
    this.onInputkeyup = e => {
      e.stopPropagation();
      this.sendResult(this.checkFieldset());
    };
  }

  addEvents() {
    this.shadowRoot
      .querySelector('#num_attendees')
      .addEventListener('change', this.onAttChange);
    Array.from(
      this.shadowRoot.querySelectorAll('input[type="text"]')
    ).forEach(i => i.addEventListener('keyup', this.onInputkeyup));
  }

  checkFieldset() {
    return Array.from(
      this.shadowRoot.querySelectorAll('input[type="text"]')
    ).reduce((a, i) => i.checkValidity() && a, true);
  }

  sendResult(f) {
    const $el = this.shadowRoot.querySelector('#step1_result');
    this.changeAttribute($el, 'hide', f)
    this.dispatchEvent(
      new CustomEvent('on-first-check', {
        detail: {
          isValid: f
        },
        bubbles: true
      })
    );
  }

  changeAttribute($el, attr, cond) {
    if (cond) {
      $el.removeAttribute(attr);
    } else {
      $el.setAttribute(attr, '');
    }
  }

  render() {
    this.renderComponent();
    this.addEvents();
  }

  renderComponent() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        legend {
          background-color: #fff;
          font-family: 'Arial Black', Arial;
          font-size: 18px;
          padding: 5px 7px;
          margin-bottom: 10px;
          border-radius: 10px;
        }
        fieldset {
          background-color: var(--first-step-background-color, #A9EAC5);
          border: 0;
          max-width: var(--fieldset-max-width, 300px);
        }
        label {
          font-style: var(--fieldset-question-font-style, italic);
        }
        #attendee_container h3 {
          font-size: 16px;
          font-family: 'Arial Black', Arial;
          margin: 20px 0 5px 0;
        }
        #attendee_container label {
          font-size: var(--fieldset-label-font-size, 17px);
        }
        #attendee_container input {
          width: 150px;
        }
        #step1_result,
        .attendee_wrap {
          overflow: hidden;
          height: auto;
          max-height: 0;
          transition: max-height 0.7s ease-in;
        }
        #step1_result:not([hide]),
        .attendee_wrap:not([hide]) {
          max-height: 400px;
        }
      </style>
      <fieldset id="step_1">
        <legend>Step 1</legend>
        <label for="num_attendees">
          How many people will be attending?
        </label>
        <select id="num_attendees">
          ${Array(this.people + 1)
            .fill()
            .map(
              (_, i) =>
                `<option id="opt_${i}" value="${i}">
                  ${i === 0 ? 'Please Choose' : i.toString()}
                </option>`
            ).join('')}
        </select>
        <br>
        <div id="attendee_container">
          ${Array(this.people)
            .fill()
            .map(
              (_, i) =>
              `<div id="attendee_${i + 1}_wrap" class="attendee_wrap" hide>
                ${i === 0 ? `<h3>Please provide full names:</h3>` : ''}
                <label for="name_attendee_${i + 1}">
                  Attendee ${i + 1} Name:
                </label>
                <input type="text" id="name_attendee_${i + 1}" required>
              </div>`
            ).join('')}
        </div>
        <div id="step1_result" hide>
          <icon-check></icon-check>
        </div>
      </fieldset>`;
  }
}

window.customElements.define('first-step', FirstStep);
