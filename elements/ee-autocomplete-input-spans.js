import { css } from 'lit-element'
import { inputField } from '../style-patterns.js'

export const EeAutocompleteInputSpans = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        inputField,
        css`
        `
      ]
    }
  }
}
