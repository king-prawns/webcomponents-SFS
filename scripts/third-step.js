class ThirdStep extends HTMLElement {
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
    return [];
  }

  get disabled() {
    return this._disabled;
  }

  set disabled(value) {
    if (this.disabled === value) return;
    this._disabled = value;
    if (this.shadowRoot.children.length > 0) {
      this.render();
    }
  }

  get isRock() {
    return this._isRock;
  }

  set isRock(value) {
    if (this.isRock === value) return;
    this._isRock = value;
    if (this.shadowRoot.children.length > 0) {
      this.render();
    }
  }

  disconnectedCallback() {
    this.shadowRoot
      .querySelector('#rock')
      .removeEventListener('change', this.onRockChange);
  }

  connectedCallback() {
    this.render();
  }

  setDefault() {
    this.disabled = true;
    this.isRock = false;
    this.onRockChange = e => (this.isRock = e.target.checked);
    this.onFormSubmit = () => this.sendResult();
  }

  addEvents() {
    this.shadowRoot
      .querySelector('#rock')
      .addEventListener('change', this.onRockChange);
    this.shadowRoot
      .querySelector('#submit_button')
      .addEventListener('click', this.onFormSubmit);
  }

  sendResult() {
    this.dispatchEvent(new CustomEvent('on-third-check', { bubbles: true }));
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
          background-color: var(--third-step-background-color, #ECC6AA);
          border: 0;
          max-width: var(--fieldset-max-width, 300px);
        }
        fieldset[disabled] {
          opacity: 0.6;
        }
        label {
          font-style: var(--fieldset-question-font-style, italic);
        }
        #submit_button {
          margin-top: 20px;
        }
      </style>
      <fieldset id="step_3" ${this.disabled ? 'disabled' : ''}>
        <legend>Step 3</legend>
        <label for="rock">
          Are you ready to rock?
        </label>
        <input type="checkbox" id="rock" ${this.isRock ? 'checked' : ''}>
        <input type="submit" id="submit_button"
          value="Complete Registration" ${this.isRock ? '' : 'disabled'}>
      </fieldset>`;
  }
}

window.customElements.define('third-step', ThirdStep);
