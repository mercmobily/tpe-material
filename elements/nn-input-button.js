export const NnInputButton = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.lit.css`
          :host {
            display: inline-block;
            width: fit-content;
            padding: 10px;
          }

          :host > input {
            height: var(--button-height, 30px);
            -webkit-appearance: none;
            background-color: var(--nn-input-button-background, var(--mat-primary-color));
            border-radius: var(--nn-input-button-border-radius, 4px);
            border: var(--nn-input-button-border, var(--mat-theme-border));
            border-color: transparent;
            text-transform: uppercase;
            color: var(--nn-input-button-color, var(--mat-text-on-dark));
            border-image: none;
          }

          input:hover {
            filter: brightness(130%);
          }

          input:active, input:focus {
            outline: none;
          }

          input:active, :host([outlined]:not([text])) input:active {
            transition: all 0.2s ease-out;
            border-color: rgba(0, 0, 0, 0.1);
            border-style: inset;
            border-color: var(--mat-primary-color);
          }

          :host([text]:not([outlined])) input,
          :host([text]:not([raised])) input {
            background-color: transparent;
            color: var(--nn-input-button-color, var(--mat-primary-color));
          }

          :host([text]:not([outlined])) input:active,
          :host([text]:not([raised])) input:active {
            border-style: solid;
            border-width: 1px;
            border-color: transparent;
          }

          :host([text]:not([outlined])) input:hover,
          :host([text]:not([raised])) input:hover {
            background-color: var(--mat-primary-color-light);
            color: var(--mat-primary-color-dark)
          }

          :host([outlined]:not([text])) input,
          :host([outlined]:not([raised])) input {
            background-color: transparent;
            color: var(--nn-input-button-color, var(--mat-primary-color));
            border: var(--nn-input-button-border, var(--mat-theme-border));
          }

          :host([outlined]:not([text])) input:hover,
          :host([outlined]:not([raised])) input:hover {
            background-color: var(--mat-primary-color-light);
            color: var(--mat-primary-color-dark)
          }

          :host([raised]:not([text])) input,
          :host([raised]:not([outlined])) input {
            box-shadow: var(--mat-theme-box-shadow2);
            transition: box-shadow 0.2s ease-out;
          }

          :host([raised]:not([text])) input:active,
          :host([raised]:not([outlined])) input:active {
            box-shadow: none;
            transition: box-shadow 0.2s ease-out;
            filter: brightness(90%);
          }
        `
      ]
    }
  }
}
