import { css } from 'lit-element'

export const EeFab = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        css`
          button:focus, button:active {
            outline:0 ;
          }

          button:active {
            border: none;
            filter: brightness(130%);
          }

          button[disabled] {
            box-shadow: none;
            opacity: 0.5;
            pointer-events: none;
          }

          button.icon:active {
            background: #cccccc;
            border: unset;
          }

          button {
            cursor: pointer;
            height: 56px;
            width: 56px;
            margin: 6px;
            border-radius: 50%;
            box-shadow: 4px 2px 10px 0 rgba(0,0,0,0.12);
            padding-top: 5px;
            fill: var(--mat-fab-color, white);
            background-color: var(--mat-fab-background, black);
            color: var(--mat-fab-color, white);
          }

          :host([mini]) button {
            height: 40px;
            width: 40px;
          }

          button[data-descr]::after {
            content: '';
            right: 0;
            display: inline-block;
            opacity: 0;
            position: absolute;
            width: 0;
            transform: translateY(-50%);
            top: 50%;
            text-align: center;
            white-space: nowrap;
            padding: 10px 16px;
          }

          button[data-descr]:hover::after {
            content: attr(data-descr);
            width: fit-content;
            opacity: 1;
            background-color: var(--mat-fab-background, black);
            color: var(--mat-fab-color, white);
            border-radius: calc(1em + 20px);
            z-index: 1;
            right: 105%;
            font-size: 1em;
            transition: all 0.3s ease-in-out;
          }

          button svg {
            width: var(--mat-fab-icon-width, 24px);
            height: var(--mat-fab-icon-height, 24px);
          }
        `
      ]
    }
  }
}
