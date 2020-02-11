export const EeAutocompleteInputSpans = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.stylePatterns.inputField,
        super.lit.css`
        `
      ]
    }
  }
}
