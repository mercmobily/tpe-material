export const EeAutocomplete = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.lit.css`
        `
      ]
    }
  }
}
