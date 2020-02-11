import { AddHasValueAttributeMixin } from '../mixins/AddHasValueAttributeMixin'

export const NnInputDatalist = (base) => {
  return class Base extends AddHasValueAttributeMixin(base) {
    static get properties () {
      return {
        labelPosition: { type: String, attribute: false },
        validationMessage: { type: String, attribute: false }
      }
    }

    constructor () {
      super()
      this.labelPosition = 'after'
      this.validationMessagePosition = 'after'
    }

    connectedCallback () {
      super.connectedCallback()
      this.onclick = () => { this.native.click() }
    }

    static get styles () {
      return [
        super.styles,
        super.stylePatterns.inputField,
        super.stylePatterns.inputLabel,
        super.stylePatterns.floatingLabel,
        super.lit.css`
          :host::after {
            position: absolute;
            content: '';
            border: 4px solid transparent;
            border-top-color: var(--mat-boundaries-color);
            right: 20px;
            bottom: 50%;
            user-select: none;
          }

          #native {
            width: 100%;
          }
        `
      ]
    }
  }
}
