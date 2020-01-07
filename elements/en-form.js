import { css } from 'lit-element'

export const EnForm = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        css`
          :invalid {
            border: unset;
            border-bottom: var(--mat-input-border, var(--mat-theme-border));
          }

          ::slotted(*) fieldset {
            border-radius: 5px;
            border-style: solid;
            padding: 16px;
          }

          ::slotted(*) legend {
            padding-inline-start: 10px;
            padding-inline-end: 10px;
          }
        `
      ]
    }
  }
}
