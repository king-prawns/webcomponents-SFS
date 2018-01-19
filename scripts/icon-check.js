class IconCheck extends HTMLElement {
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
    return ['size'];
  }

  get size() {
    return this._size;
  }

  set size(value) {
    if (this.size === +value) return;
    this._size = +value;
    if (this.shadowRoot.children.length > 0) {
      this.setAttribute('size', value);
      this.render();
    }
  }

  disconnectedCallback() {}

  connectedCallback() {
    this.render();
  }

  setDefault() {
    this.size = 70;
  }

  render() {
    this.renderComponent();
  }

  renderComponent() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .check {
          display: flex;
          justify-content: center;
          margin-top: var(--check-icon-margin-top, 30px);
        }
        .check > div {
          display: flex;
          justify-content: center;
          align-items: center;
          width: ${this.size}px;
          height: ${this.size}px;
          margin: 10px;
          background-color: var(--check-icon-background-color, #B7FDB2);
          border-radius: 50%;
          -webkit-box-shadow: 0px 2px 5px 1px rgba(0,0,0,0.75);
          -moz-box-shadow: 0px 2px 5px 1px rgba(0,0,0,0.75);
          box-shadow: 0px 2px 5px 1px rgba(0,0,0,0.75);
        }
        span {
          color: var(--check-icon-color, #509B1D);
          font-size: ${this.size - 10}px;
        }
      </style>
      <div class="check">
        <div>
          <span>✔</span>
        </div>
      </div>`;
  }
}

window.customElements.define('icon-check', IconCheck);
