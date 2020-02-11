export const NnInputRadio = (base) => {
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
      this.shadowRoot.querySelector('label').addEventListener('click', (e) => { e.preventDefault() })
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

          :host::after {
            content: '';
            user-select: none;
            position: absolute;
            height: 8px;
            width: 8px;
            border-radius: 50%;
            left: 5px;
            top: 5px;
            will-change: transform;
            z-index: 0;
          }

          :host(:hover)::after {
            background: var(--mat-primary-color);
            opacity: 0.1;
            transform: scale(4);
            transition: all 0.3s ease-in-out;
          }

          :host([has-focus])::after {
            background: var(--mat-primary-color);
            opacity: 0.3;
            transform: scale(4);
            transition: all 0.3s ease-in-out;
          }

          div#label-text {
            padding-left: 16px;
          }

          #native:invalid {
            background-color: var(--mat-error-color);
            color: var(--mat-error-text);
            border-color: var(--mat-error-text);
          }

          :invalid {
            border: unset;
            border-bottom: var(--mat-input-border, var(--mat-theme-border));
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
            border-radius: 50%;
            transition: background-color 0.3s ease-in-out;
            z-index: 1;
          }

          #native:checked ~ label::before {
            border-color: var(--mat-primary-color);
            background-color: transparent;
            transition: background-color 0.3s ease-in-out;
          }

          #native:hover ~ label::before {
            filter: brightness(115%);
            transition: filter 0.3s ease-in-out;
          }

          #native:focus ~ label::before {
            box-shadow: var(--mat-theme-box-shadow2);
            border-color: var(--mat-primary-color);
            filter: brightness(115%);
          }

          #native:not([checked]):hover ~ label::before {
            filter: brightness(130%);
            transition: background-color 0.3s ease-in-out;
          }

          label::after { /* Checkmark */
            content: "";
            position: absolute;
            opacity: 0;
            width: 19px;
            height: 19px;
            will-change: transform, opacity;
            transition: opacity 0.3s ease-out;
            z-index: 2;
          }

          #native:checked ~ label::after {
            display: block;
            left: 0;
            top: 0;
            opacity: 1;
            background-color:  var(--mat-primary-color);
            border-radius: 50%;
            -webkit-transform: scale(0.5);
            -ms-transform: scale(0.5);
            transform: scale(0.5);
            transition: transform 0.3s ease-in-out, opacity 0.3s ease-in;
          }

        `
      ]
    }
  }
}
