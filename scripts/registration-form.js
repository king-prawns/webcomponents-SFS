class RegistrationForm extends HTMLElement {
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
    return [''];
  }

  disconnectedCallback() {
    this.removeEventListener('on-first-check', this.checkFirstStep);
    this.removeEventListener('on-second-check', this.checkSecondStep);
    this.removeEventListener('on-third-check', this.checkThirdStep);
  }

  connectedCallback() {
    this.render();
  }

  setDefault() {
    this.validaty = [false, false];
    this.checkFirstStep = e => {
      if (e.detail.isValid) {
        this.querySelector('second-step').disabled = false;
      }
      this.validaty[0] = e.detail.isValid;
    };
    this.checkSecondStep = e => {
      if (e.detail.isValid) {
        this.querySelector('third-step').disabled = false;
      }
      this.validaty[1] = e.detail.isValid;
    };
    this.checkThirdStep = () =>
      this.validaty[0] && this.validaty[1] ? 
      window.location.reload() : alert('Please fill out required fields.');
  }

  addEvents() {
    this.addEventListener('on-first-check', this.checkFirstStep);
    this.addEventListener('on-second-check', this.checkSecondStep);
    this.addEventListener('on-third-check', this.checkThirdStep);
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
      form {
        display: flex;
      }
    </style>
    <form action="#" method="post">
        <slot></slot>
      </form>
    `;
  }
}

window.customElements.define('registration-form', RegistrationForm);
