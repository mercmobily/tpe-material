import { AddHasValueAttributeMixin } from '../mixins/AddHasValueAttributeMixin'

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
        super.stylePatterns.inputField,
        super.stylePatterns.inputLabel,
        super.stylePatterns.floatingLabel,
        super.stylePatterns.hoverStyle,
        super.stylePatterns.focusStyle,
        super.stylePatterns.errorMessage,
        super.stylePatterns.requiredLabelAsterisk,
        super.lit.css`
          #native[has-leading] {
            padding-left: 36px;
          }

          #native[has-trailing] {
            padding-right: 36px;
          }

          ::slotted([slot=leading]),
          ::slotted([slot=trailing]) {
            position: absolute;
            top: var( --mat-input-icon-top, 16px);
            left: var( --mat-input-icon-left, 16px);
            height: var( --mat-input-icon-height, 24px);
            width: var( --mat-input-icon-width, 24px);
          }

          ::slotted([slot=trailing]) {
            left: unset;
            right: var( --mat-input-icon-right, 16px);
          }

          :host([has-leading]) label{
            margin-left: 30px
          }
        `
      ]
    }
  }
}
