// In Material Design color tool: https://material.io/tools/color/#!/?view.left=0&view.right=0&primary.color=616161&secondary.color=512DA8

export const Common = (base) => {
  return class Base extends base {
    static get stylePatterns () {
      const css = super.lit.css
      return {
        // This is a light implementation of material guidelines.
        // It does not aim to be a complete, comprehensive, Material Design components library, but to showcase the flexiblity of the TPE theming system.
        // Guidelines can be found in: https://material.io/components

        requiredLabelAsterisk: css`
          #native:required ~ label div#label-text::after {
            content: '*';
            padding-left: 2px;
            position: relative;
          }
        `,

        hoverStyle: css`
          :host(:hover) {
            --mat-theme-box-shadow: var(--mat-theme-box-shadow2);
          }

          :host([disabled]:hover) {
            --mat-theme-box-shadow: none;
          }
        `,
        focusStyle: css`
          :host([has-focus]), :host([has-focus][outlined]) {
            --mat-theme-border: 2px solid var(--mat-primary-color);
            --mat-label-color: var(--mat-primary-color);
          }

          :host([has-focus]) #native {
            padding-bottom: -1px;
          }
        `,

        inputField: css`
          :host {
            position: relative;
            padding: 0 12px;
            padding-bottom: 16px;
            margin: 5px;
            min-width: var(--mat-form-element-min-width, fit-content);
            font-family: var(--font-family);
          }

          :host([disabled]) {
            --mat-input-color: var(--mat-boundaries-color, #999)
          }

          :host([dense]) {
            --mat-form-element-height: 40px;
            padding-bottom: 8px;
          }

          :host([dense]) #native {
            padding: var(--mat-form-element-padding, 14px 10px 0);
          }

          :host([outlined]) {
            --mat-background: white;
            --mat-background-dark: white;
            --mat-theme-border: 2px solid #ccc;
          }

          :host([outlined]) #native {
            border-bottom: unset;
            border: var(--mat-input-border, var(--mat-theme-border));
            border-radius: var(--mat-input-border-radius, 4px);
          }

          #native {
            box-sizing: border-box;
            appearance: none;
            -moz-appearance: none;
            -webkit-appearance: none;
            box-sizing: border-box;
            display: block;
            border-radius: var(--mat-input-border-radius, 4px 4px 0 0);
            border-width: 0;
            border-style: solid;
            border-color: transparent;
            border-bottom: var(--mat-input-border, var(--mat-theme-border));
            color: var(--mat-input-color, inherit);
            background-color: var(--mat-background, #eee);
            width: 100%;
            font-size: 14px;
            padding:  var(--mat-form-element-padding, 20px 16px 0);
            height: var(--mat-form-element-height);
            box-shadow: var(--mat-theme-box-shadow);
          }

          #native:focus,
          #native:active {
            outline: none
          }

          #native::selection {
            background-color: var(--mat-background-dark);
          }

          #native:invalid {
            background-color: var(--mat-error-color);
            color: var(--mat-error-text);
            border-color: var(--mat-error-text);
          }

          #native:disabled {
            filter: saturate(0);
            opacity: 0.85;
          }

          #native:disabled:hover {
            background-color: initial !important;
          }

          /* this.hoverStyle */
          :host(:hover) {
            --mat-theme-box-shadow: var(--mat-theme-box-shadow2);
          }

          :host([disabled]:hover) {
            --mat-theme-box-shadow: none;
          }

          /* this.focusStyle */
          :host([has-focus]), :host([has-focus][outlined]) {
            --mat-theme-border: 2px solid var(--mat-primary-color);
            --mat-label-color: var(--mat-primary-color);
          }

          :host([has-focus]) #native {
            padding-bottom: -1px;
          }
        `,

        inputLabel: css`
           label {
            position: absolute;
            display: inline-flex;
            font-size: 16px;
            border: var(--mat-label-border, none);
            color: var(--mat-label-color,  var(--mat-primary-color-light));
            padding-left: 6px;
            padding-right: 6px;
            margin-left: 8px;
            min-width: fit-content;
            white-space: nowrap;
            --half-height: calc(var(--mat-form-element-height) / 2);
            top: calc(var(--half-height) + 8px);
            transform: translateY(-50%);
            left: 12px;
            will-change: transform;
            transition: transform 0.1s ease-in-out;
          }

          :host([dense]) label {
            top: var(--half-height);
            left: 8px;
          }

          #native:invalid + label,
          #native:invalid ~ label {
            background-color: none;
            --mat-label-color: darkred;
          }
        `,

        floatingLabel: css`
          :host([has-value]) label,
          #native:focus ~ label,
          #native:placeholder-shown ~ label {
            transform: translateY(calc(var(--half-height) / -1)) scale(0.8);
            transform-origin: 0 0;
            transition: transform 0.1s ease-in-out, background 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }

          :host([dense][has-value]) label,
          :host([dense]) #native:focus ~ label,
          :host([dense]) #native:placeholder-shown ~ label {
            background: var(--mat-label-background, transparent)
          }

          :host([outlined]:not([dense][has-value]) label,
          :host([outlined]:not([dense]) #native:focus ~ label,
          :host([outlined]:not([dense]) #native:placeholder-shown ~ label {
            transform: translateY(calc(var(--half-height) / -1)) scale(0.8);
            transform-origin: 0 0;
            background: var(--mat-label-background, transparent);
          }
        `,

        fixedLabel: css`
          label, #native:focus ~ label,
          :host([has-value]) label,
          #native:placeholder-shown ~ label {
            transform: translateY(calc(var(--half-height) / -1)) scale(0.8);
            transform-origin: 0 0;
          }

          :host([dense]) label, 
          :host([dense]) #native:focus ~ label,
          :host([dense]) :host([has-value]) label,
          :host([dense]) #native:placeholder-shown ~ label
           {
            top: var(--half-height);
            transform: translateY(calc(var(--half-height) / -1)) scale(0.8);
            left: 8px;
          }

        `,

        errorMessage: css`
          span.error-message {
            position: absolute;
            bottom: 0;
            left: 16px;
            font-size: 80%;
            white-space: nowrap;
            opacity: 0;
            line-height: 0;
          }

          #native:invalid ~ span.error-message {
            opacity: 1;
          }
        `,

        hideNativeWidget: css`
          input {
            position: unset;
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;
          }
        `
      }
    }

    static get styles () {
      const css = super.lit.css
      return [
        super.styles || [],
        css`
          @-webkit-keyframes fadeIn {
            0%   { opacity: 0; }
            100% { opacity: 1; }
          }
          @-moz-keyframes fadeIn {
            0%   { opacity: 0; }
            100% { opacity: 1; }
          }
          @-o-keyframes fadeIn {
            0%   { opacity: 0; }
            100% { opacity: 1; }
          }
          @keyframes fadeIn {
            0%   { opacity: 0; }
            100% { opacity: 1; }
          }

          @-webkit-keyframes fadeOut {
            0%   { opacity: 1; }
            100% { opacity: 0; }
          }
          @-moz-keyframes fadeOut {
            0%   { opacity: 1; }
            100% { opacity: 0; }
          }
          @-o-keyframes fadeOut {
            0%   { opacity: 1; }
            100% { opacity: 0; }
          }
          @keyframes fadeOut {
            0%   { opacity: 1; }
            100% { opacity: 0; }
          }

          :host {
            display: block;
            appearance: none;
            -moz-appearance: none;
            -webkit-appearance: none;
            box-sizing: border-box;
            --mat-font-family: Roboto, sans-serif;
            --mat-primary-color: #455a64;
            --mat-primary-color-light: #718792;
            --mat-primary-color-dark: #1c313a;
            --mat-secondary-color: #512da8;
            --mat-secondary-color-light: #8559da;
            --mat-secondary-color-dark: #140078;
            --mat-boundaries-color: #999;
            --mat-primary-text: #333;
            --mat-secondary-text: #000;
            --mat-text-on-dark: #fff;
            --mat-text-on-light: #000;
            --mat-error-color: pink;
            --mat-error-text: darkred;
            --mat-theme-border-style: solid;
            --mat-theme-border-width: 1px;
            --mat-theme-border-color: var(--mat-boundaries-color);
            --mat-theme-border-radius: 4px;
            --mat-theme-border: var(--mat-theme-border-width) var(--mat-theme-border-style) var(--mat-theme-border-color);
            --mat-theme-box-shadow: none;
            --mat-theme-box-shadow1: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
            --mat-theme-box-shadow2: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            --mat-theme-box-shadow3: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            --mat-theme-box-shadow4: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            --mat-theme-box-shadow5: 0 25px 50px -12px rgba(0, 0, 0, 0.25));
            --mat-theme-shadow-transition: box-shadow 0.3s cubic-bezier(.25,.8,.25,1);
            --mat-form-element-height: 56px;
            --mat-form-element-min-width: 280px;
            --mat-background: white;
            --mat-background-dark: #ccc;
            --mat-label-background: transparent;
          }

          :host([hidden]) {
            display: none;
          }
        `
      ]
    }
  }
}
