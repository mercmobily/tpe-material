export const NnInputCheckBox = (base) => {
  return class Base extends base {
    // Style depends on CSS being able to find label as sibling of the #native element.
    // CSS can select next siblings, but not previous.  This guarantees label is rendered after #native in the shadowDOM
    static get properties () {
      return {
        labelPosition: { type: String, attribute: false },
        validationMessage: { type: String, attribute: false }
      }
    }

    constructor () {
      super()
      this.labelPosition = 'after'
      this.validationMessagePosition = 'after'
      this.label = ''
    }

    firstUpdated () {
      if (super.firstUpdated) super.firstUpdated()
      this.shadowRoot.querySelector('label').addEventListener('click', (e) => { e.stopPropagation() })
    }

    static get styles () {
      return [
        super.styles,
        super.stylePatterns.errorMessage,
        super.stylePatterns.hideNativeWidget,
        super.stylePatterns.requiredLabelAsterisk,
        super.lit.css`
          :host {
            display: block;
            position: relative;
            padding-left: 24px;
            margin-bottom: 12px;
            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }

          :host::after:not(:disabled) {
            content: '';
            user-select: none;
            position: absolute;
            height: 8px;
            width: 8px;
            border-radius: 50%;
            left: 5px;
            top: 5px;
            will-change: transform;
          }

          :host(:hover:not(:disabled))::after {
            background: var(--mat-primary-color);
            opacity: 0.1;
            transform: scale(4);
            transition: all 0.3s ease-in-out;
          }

          :host([has-focus])::after {
            background: var(--mat-primary-color);
            opacity: 0.4 !important;
            transform: scale(4);
            transition: all 0.3s ease-in-out;
          }

          div#label-text {
            padding: var(--nn-checkbox-label-padding);
          }

          #native:invalid + label, #native:invalid ~ label {
            background-color: none;
            --mat-label-color: darkred;
          }

          label::before { /* Background box */
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            height: 15px;
            width: 15px;
            border: 2px solid var(--mat-boundaries-color);
            border-radius: 3px;
            transition: background-color 0.3s ease-in-out;
          }

          #native:checked ~ label::before {
            border-color: var(--mat-primary-color);
            background-color:  var(--mat-primary-color);
            transition: background-color 0.3s ease-in-out;
          }

          :host(:hover:not(:disabled)) label::before {
            filter: brightness(135%);
            transition: filter 0.3s ease-in-out;
            box-shadow: var(--mat-theme-box-shadow2);
          }

          #native:focus ~ label::before {
            box-shadow: var(--mat-theme-box-shadow2);
            border-color: var(--mat-primary-color);
            filter: brightness(135%);
          }

          #native:not([checked]):hover:not(:disabled) ~ label::before {
            filter: brightness(150%);
            background-color: var(--mat-primary-color);
            transition: background-color 0.3s ease-in-out;
          }

          label::after { /* Checkmark */
            content: "";
            position: absolute;
            left: 6px;
            top: 2px;
            opacity: 0;
            will-change: transform, opacity;
            transition: opacity 0.3s ease-out;
          }

          #native:checked ~ label::after {
            display: block;
            width: 5px;
            height: 10px;
            opacity: 1;
            border: solid white;
            border-radius: 2px;
            border-width: 0 3px 3px 0;
            -webkit-transform: rotate(405deg);
            -ms-transform: rotate(405deg);
            transform: rotate(405deg);
            transition: transform 0.3s ease-in-out, opacity 0.3s ease-in;
          }
        `
      ]
    }
  }
}
