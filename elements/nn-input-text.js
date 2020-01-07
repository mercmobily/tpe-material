import { css } from 'lit-element'
import { AddHasValueAttributeMixin } from '../mixins/AddHasValueAttributeMixin'
import { inputLabel, inputField, floatingLabel, errorMessage } from '../style-patterns.js'

export const NnInputText = (base) => {
  return class Base extends AddHasValueAttributeMixin(base) {
    // Style depends on CSS being able to find label as sibling of the #native element.
    // CSS can select next siblings, but not previous.  This guarantees label is rendered after #native in the shadowDOM
    static get properties () {
      return {
        labelPosition: { type: String, attribute: false },
        validationMessagePosition: { type: String, attribute: false }
      }
    }

    constructor () {
      super()
      this.labelPosition = 'after'
      this.validationMessagePosition = 'after'
    }

    firstUpdated () {
      super.firstUpdated()
      for (const k of ['leading', 'trailing']) {
        const el = document.createElement('slot')
        el.setAttribute('name', k)
        this.shadowRoot.appendChild(el)
      }
    }

    static get styles () {
      return [
        super.styles,
        inputField,
        inputLabel,
        floatingLabel,
        errorMessage,
        css`
          :host([has-leading]) #native {
            padding-left: 36px;
          }

          :host([has-trailing]) #native {
            padding-right: 36px;
          }

          ::slotted([slot=leading]),
          ::slotted([slot=trailing]) {
            position: absolute;
            top: 16px;
            left: 16px;
            height: 24px;
            width: 24px;
          }

          ::slotted([slot=trailing]) {
            left: unset;
            right: 16px;
          }

          :host([has-leading]:not([has-value])) label{
            margin-left: 36px
          }

        `
      ]
    }
  }
}
