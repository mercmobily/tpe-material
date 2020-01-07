import { fixedLabel, errorMessage, inputField, inputLabel } from '../style-patterns.js'

export const NnInputDate = (base) => {
  return class Base extends base {
    // Style depends on CSS being able to find label as sibling of the #native element.
    // CSS can select next siblings, but not previous.  This guarantees label is rendered after #native in the shadowDOM
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

    static get styles () {
      return [
        super.styles,
        inputField,
        inputLabel,
        fixedLabel,
        errorMessage
      ]
    }
  }
}
