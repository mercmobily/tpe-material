import { css } from 'lit-element'

export const NnButton = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        css`
          :host {
            width: fit-content;
            padding: 4px 10px;
          }

          button {
            display: inline-block;
            white-space: nowrap;
            height: var(--nn-button-height, 30px);
            -webkit-appearance: none;
            background-color: var(--mat-primary-color);
            border-radius: var(--nn-button-border-radius, 4px);
            border: var(--nn-button-border, var(--mat-theme-border));
            border-color: transparent;
            text-transform: uppercase;
            font-size: 14px;
            color: var(--nn-button-color, var(--mat-text-on-dark));
            fill: var(--nn-button-color, var(--mat-text-on-dark));
            border-image: none;
            width: 100%;
            align-items: center;
          }

          :host ::slotted(*) {
            vertical-align: middle;
          }

          :host ::slotted(svg) {
            display: inline-block;
            vertical-align: middle;
          }

          #native:disabled {
            filter: saturate(0);
            opacity: 0.85;
          }

          #native:disabled:hover {
            background-color: initial !important;
          }

          button:hover {
            filter: brightness(130%);
          }

          button:active {
            outline: none;
          }

          button:focus {
            border-color: var(--mat-primary-color, rgba(255, 255, 255, 0.7));
            background-color: var(--mat-primary-color-light);
            filter: brightness(115%);
          }

          button:active {
            transition: all 0.2s ease-out;
            border-style: inset;
            border-color: var(--mat-primary-color);
          }

          :host([text]:not([outlined])) button,
          :host([text]:not([raised])) button {
            background-color: transparent;
            color: var(--nn-button-color, var(--mat-primary-color));
            fill: var(--nn-button-color, var(--mat-primary-color));
          }

          :host([text]:not([outlined])) button:focus,
          :host([text]:not([raised])) button:focus {
            background-color: transparent;
            color: var(--nn-button-color, var(--mat-primary-color));
            fill: var(--nn-button-color, var(--mat-primary-color));
            box-shadow: var(--mat-theme-box-shadow2);
          }

          :host([text]:not([outlined])) button:active,
          :host([text]:not([raised])) button:active {
            border-style: solid;
            border-width: 1px;
            border-color: transparent;
          }

          :host([text]:not([outlined])) button:hover,
          :host([text]:not([raised])) button:hover {
            background-color: var(--mat-primary-color-light);
            color: var(--mat-primary-color-dark);
            fill: var(--mat-primary-color-dark);
          }

          :host([outlined]:not([text])) button,
          :host([outlined]:not([raised])) button {
            background-color: transparent;
            color: var(--nn-button-color, var(--mat-primary-color));
            fill: var(--nn-button-color, var(--mat-primary-color));
            border: var(--nn-button-border, var(--mat-theme-border));
          }

          :host([outlined]:not([text])) button:hover,
          :host([outlined]:not([raised])) button:hover {
            background-color: var(--mat-primary-color-light);
            color: var(--mat-primary-color-dark);
            fill: var(--mat-primary-color-dark);
          }

          :host([raised]:not([text])) button,
          :host([raised]:not([outlined])) button {
            box-shadow: var(--mat-theme-box-shadow3);
            transition: box-shadow 0.2s ease-out;
          }

          :host([raised]:not([text])) button:active,
          :host([raised]:not([outlined])) button:active {
            box-shadow: none;
            transition: box-shadow 0.2s ease-out;
            filter: brightness(90%);
          }
        `
      ]
    }
  }
}
