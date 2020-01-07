import { css } from 'lit-element'
import { hoverStyle, focusStyle } from '../style-patterns'

export const NnInputColor = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        hoverStyle,
        focusStyle,
        css`
         :host {
            position: relative;
            padding: 0 12px;
            padding-bottom: 16px;
            margin: 10px;
          }

          #native {
            appearance: none;
            -moz-appearance: none;
            -webkit-appearance: none;
            box-sizing: border-box;
            display: block;
            border-radius: var(--mat-input-border-radius, 4px 4px 0 0);
            border-width: 0;
            border-style: none;
            border-color: transparent;
            background-color: var(--mat-background, #eee);
            padding: 6px;
            height: 40px;
            box-shadow: var(--mat-theme-box-shadow);
            transition: background-color 0.3s ease-in-out,
                        color 0.3s ease-in-out,
                        box-shadow 0.3s ease-in-out;
          }
        `
      ]
    }
  }
}
