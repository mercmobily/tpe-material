export const NnInputTime = (base) => {
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
