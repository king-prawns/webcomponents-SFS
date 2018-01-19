class SecondStep extends HTMLElement {
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

  get isCompanyName() {
    return this._isCompanyName;
  }

  set isCompanyName(value) {
    if (this.isCompanyName === value) return;
    this._isCompanyName = value;
  }

  get isAccomodation() {
    return this._isAccomodation;
  }

  set isAccomodation(value) {
    if (this.isAccomodation === value) return;
    this._isAccomodation = value;
  }

  get companyName() {
    return this._companyName;
  }

  set companyName(value) {
    if (this.companyName === value) return;
    this._companyName = value;
  }

  get accomodation() {
    return this._accomodation;
  }

  set accomodation(value) {
    if (this.accomodation === value) return;
    this._accomodation = value;
  }

  disconnectedCallback() {
    this.shadowRoot
      .querySelector('#company_name_toggle_on')
      .removeEventListener('change', this.onCompChange);
    this.shadowRoot
      .querySelector('#company_name_toggle_off')
      .removeEventListener('change', this.onCompChange);
    this.shadowRoot
      .querySelector('#special_accommodations_toggle_on')
      .removeEventListener('change', this.onAccChange);
    this.shadowRoot
      .querySelector('#special_accommodations_toggle_off')
      .removeEventListener('change', this.onAccChange);
    this.shadowRoot
      .querySelector('#company_name')
      .removeEventListener('keyup', this.onCompKeyup);
    this.shadowRoot
      .querySelector('#special_accomodations_text')
      .removeEventListener('keyup', this.onAccKeyup);
  }

  connectedCallback() {
    this.render();
  }

  setDefault() {
    this.disabled = true;
    this.isCompanyName = undefined;
    this.isAccomodation = undefined;
    this.companyName = '';
    this.accomodation = '';
    this.onCompChange = e => {
      const $el = this.shadowRoot.querySelector('#company_name_wrap');
      this.isCompanyName = e.target.value === 'true';
      this.changeAttribute($el, 'hide', this.isCompanyName)
      this.changeAttribute($el.querySelector('input'), 'disabled', this.isCompanyName);
      this.sendResult(this.checkFieldset());
    };
    this.onAccChange = e => {
      const $el = this.shadowRoot.querySelector('#special_accommodations_wrap');
      this.isAccomodation = e.target.value === 'true';
      this.changeAttribute($el, 'hide', this.isAccomodation)
      this.changeAttribute($el.querySelector('textarea'), 'disabled', this.isAccomodation);
      this.sendResult(this.checkFieldset());
    };
    this.onCompKeyup = e => {
      this.companyName = e.target.value;
      this.sendResult(this.checkFieldset());
    };
    this.onAccKeyup = e => {
      this.accomodation = e.target.value;
      this.sendResult(this.checkFieldset());
    };
  }

  addEvents() {
    this.shadowRoot
      .querySelector('#company_name_toggle_on')
      .addEventListener('change', this.onCompChange);
    this.shadowRoot
      .querySelector('#company_name_toggle_off')
      .addEventListener('change', this.onCompChange);
    this.shadowRoot
      .querySelector('#special_accommodations_toggle_on')
      .addEventListener('change', this.onAccChange);
    this.shadowRoot
      .querySelector('#special_accommodations_toggle_off')
      .addEventListener('change', this.onAccChange);
    this.shadowRoot
      .querySelector('#company_name')
      .addEventListener('keyup', this.onCompKeyup);
    this.shadowRoot
      .querySelector('#special_accomodations_text')
      .addEventListener('keyup', this.onAccKeyup);
  }

  checkFieldset() {
    return [
      ...this.shadowRoot.querySelectorAll('input'),
      this.shadowRoot.querySelector('textarea')
    ].reduce((a, f) => f.checkValidity() && a, true);
  }

  sendResult(f) {
    const $el = this.shadowRoot.querySelector('#step2_result');
    this.changeAttribute($el, 'hide', f)
    this.dispatchEvent(
      new CustomEvent('on-second-check', {
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
          margin: 0 8px;
          background-color: var(--second-step-background-color, #AADBEB);
          border: 0;
          max-width: var(--fieldset-max-width, 300px);
        }
        fieldset[disabled] {
          opacity: 0.6;
        }
        label {
          font-style: var(--fieldset-question-font-style, italic);
        }
        p {
          margin-bottom: 5px;
          font-style: italic;
        }
        fieldset > p {
          margin-top: 0;
        }
        #company_name_wrap label {
          font-size: var(--fieldset-label-font-size, 17px);
        }
        #company_name_wrap input {
          width: 150px;
        }
        #special_accommodations_wrap label {
          display: block;
          font-size: var(--fieldset-label-font-size, 17px);
          margin: 5px 0;
        }
        #special_accommodations_wrap textarea {
          width: calc(100% - 10px);
          resize: none;
        }
        #step2_result,
        #company_name_wrap,
        #special_accommodations_wrap {
          overflow:hidden;
          height:auto;
          max-height: 0;
          transition: max-height 0.7s ease-in;
        }
        #step2_result:not([hide]),
        #company_name_wrap:not([hide]),
        #special_accommodations_wrap:not([hide]) {
          max-height: 400px;
        }
      </style>
      <fieldset id="step_2" ${this.disabled ? 'disabled' : ''}>
        <legend>Step 2</legend>
        <p>Would you like your company name on your badges?</p>
        <input type="radio" id="company_name_toggle_on" name="company_name_toggle_group" 
          value="true" required>
        <label for="company_name_toggle_on">Yes</label> &emsp;
        <input type="radio" id="company_name_toggle_off" name="company_name_toggle_group"
          value="false" required>
        <label for="company_name_toggle_off">No</label>
        <div id="company_name_wrap" hide>
          <label for="company_name">
            Company Name:
          </label>
          <input type="text" id="company_name" disabled required>
        </div>
        <div>
          <p>Will anyone in your group require special accommodations?</p>
          <input type="radio" id="special_accommodations_toggle_on" name="special_accommodations_toggle"
            value="true" required>
          <label for="special_accommodations_toggle_on">Yes</label> &emsp;
          <input type="radio" id="special_accommodations_toggle_off" name="special_accommodations_toggle"
            value="false" required>
          <label for="special_accommodations_toggle_off">No</label>
        </div>
        <div id="special_accommodations_wrap" hide>
          <label for="special_accomodations_text">
            Please explain below:
          </label>
          <textarea rows="10" cols="10" id="special_accomodations_text" disabled required></textarea>
        </div>
        <div id="step2_result" hide>
          <icon-check></icon-check>
        </div>
      </fieldset>`;
  }
}

window.customElements.define('second-step', SecondStep);
