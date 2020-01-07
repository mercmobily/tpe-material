import { css } from 'lit-element'

export const NnForm = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        css`
        `
      ]
    }
  }
}
