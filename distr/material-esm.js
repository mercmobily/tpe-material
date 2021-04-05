// TPE Material Theme
// ==================
//
// This is a light implementation of material guidelines. It does not aim to be
// a comprehensive, completely accurate Material Design components library, but to
// showcase the flexiblity of the TPE theming system and serve as a reference
// for theme development. Guidelines can be found in:
// https://material.io/components.
//
// The main objective of this approach it to use as much of plain CSS power as
// possible to achieve the look and feel of material design. This keeps the
// theming system lightweight and approacheable to beginner developers and
// designers used to work with CSS, but not really with CSS preprocessors or
// advanced bundling tools.
//
// ## The shared theme styles
//
// First of all, the _Shared_ mixin is defined. It is required by the TPE Theme
// system, and applied to all elements, so it is not meant to force the actual
// styles directly to the elements, but to provide the shared patterns, global
// definitions and the CSS custom properties that will allow
//
const Shared = (base) => {
  return class Base extends base {
    // The _stylePatterns_ object is a collection of CSS styles that implement
    // Material Design guidelines visual patterns and behaviors. The
    // CSSTemplateResults are added accordingly in the static styles getter in
    // the theme mixin for each of the TPE elements.
    //
    // For example, to style the native input fields, the mixin assigned to `window.TP_THEME["nn-input-text"]" would have this minimum static styles getter:
    //
    // ```
    // static get styles () {
    //    return [
    //        this.stylesPatterns.inputField,
    //        this.stylesPatterns.inputLabel
    //    ]
    // }
    //
    // ```
    //
    // This version features styles
    static get stylePatterns () {
      const css = super.lit.css;
      return {
        // This adds a "*" character after the label for input fields that have the required attribute present.
        requiredLabelAsterisk: css`
           #native:required ~ label div#label-text::after,
          :host([required]) label div#label-text::after {
            content: '*';
            padding-left: 2px;
            position: relative;
          }
        `,
        // Changes elevation on mouse hover
        hoverStyle: css`
          :host(:hover) {
            --mat-theme-box-shadow: var(--mat-theme-box-shadow2);
          }

          :host([disabled]:hover) {
            --mat-theme-box-shadow: none;
          }
        `,
        // Styles can be adjusted on focused elements.
        focusStyle: css`
          :host([has-focus]), :host([has-focus][outlined]) {
            --mat-theme-border: 2px solid var(--mat-primary-color);
            --mat-label-color: var(--mat-primary-color);
          }

          :host([has-focus]) #native {
            padding-bottom: -1px;
          }
        `,
        // Text input field specific material implementation. This template is
        // responsible for the default, dense and outlined styles. (Material Text Fields)[https://material.io/components/text-fields#specs]
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
        `,

        // Base style for input labels.
        inputLabel: css`
           label {
            position: absolute;
            display: inline-flex;
            font-size: var(--mat-label-font-size, 14px);
            border: var(--mat-label-border, none);
            color: var(--mat-label-color,  var(--mat-primary-color-light));
            padding: var(--mat-label-padding, 0 6px);
            margin-left: var(--mat-label-margin-left, 8px);
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
            left: var(--mat-label-margin-left, 8px);
          }

          #native:invalid + label,
          #native:invalid ~ label {
            background-color: none;
            --mat-label-color: darkred;
          }
        `,
        // When applicable (i.e. text input fields), `floatingLabel` should be
        // used to enable the typical mateiral design label animation.
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

          :host([outlined]:not([dense][has-value])) label,
          :host([outlined]:not([dense])) #native:focus ~ label,
          :host([outlined]:not([dense])) #native:placeholder-shown ~ label {
            transform: translateY(calc(var(--half-height) / -1)) scale(0.8);
            transform-origin: 0 0;
            background: var(--mat-label-background, transparent);
          }
        `,
        // Alternative label style, fixed in the floating position, useful in
        // cases where the default position might clash with native features,
        // like the date input placeholder text.
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
        // Styling fo the error messages for the input fields.
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
        // Auxiliary style that will hide the native element, for cases in which
        // the broser style is not flexible enough for material design
        // implementation, as is the case for checkboxes and radio inputs.
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
      const css = super.lit.css;
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
            /* These properties as common to all elements and important to enable proper styling of native elements. */
            display: block;
            appearance: none;
            -moz-appearance: none;
            -webkit-appearance: none;
            box-sizing: border-box;
            /* These are the custom properties that make it possible to apply light themes, by changing colors and a few properties, like borders and shadows. */
            /* Default font */
            --mat-font-family: Roboto, sans-serif;
            /* The primary and secondary colors are applied to color accents and help with visual context. (Color Guidelines)[https://material.io/design/color/the-color-system.html#color-theme-creation] */
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
            /* Other aspects of the elements are used to convey the general look and feel of the theme. Material Design leans heavily on border and shadows. These are the default values taken from the guidelines. */
            --mat-theme-border-style: solid;
            --mat-theme-border-width: 1px;
            --mat-theme-border-color: var(--mat-boundaries-color);
            --mat-theme-border-radius: 4px;
            --mat-theme-border: var(--mat-theme-border-width) var(--mat-theme-border-style) var(--mat-theme-border-color);
            /* TPE uses five elevation levels */
            --mat-theme-box-shadow: none;
            --mat-theme-box-shadow1: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
            --mat-theme-box-shadow2: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            --mat-theme-box-shadow3: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            --mat-theme-box-shadow4: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            --mat-theme-box-shadow5: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
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
};

// Default theme colors in Material Design color tool:
// https://material.io/tools/color/#!/?view.left=0&view.right=0&primary.color=616161&secondary.color=512DA8

const EeDrawer = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.lit.css`
        `
      ]
    }
  }
};

const EeNetwork = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.lit.css`
        `
      ]
    }
  }
};

const EeSnackBar = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.lit.css`
        `
      ]
    }
  }
};

const EeTabs = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.lit.css`
        :host {
          --ee-tabs-selected-color: var(--mat-primary-color);
          --ee-tabs-active-color: var(--mat-primary-color);
          --ee-tabs-color: var(--mat-primary-text);
        }

        :host nav > ::slotted(:hover) {
          box-shadow: var(--mat-theme-box-shadow4);
        }

        :host nav > ::slotted(*) {
          border-bottom: 0 !important;
          transition: all 0.3s ease-in-out;
          position: relative;
          box-sizing: border-box;
        }

        :host nav > ::slotted([active]) {
          color: var(--ee-tabs-selected-color);
          border-bottom: 0;
        }

        :host nav > ::slotted(:focus),
        :host nav > ::slotted(:hover) {
          outline: 0;
          border-bottom: 0;
        }

        :host nav > ::slotted(*)::after,
        :host nav > ::slotted(:not([active]))::after {
          content: '';
          position: absolute;
          transition: height 0.3s ease-in-out, left 0.3s ease-in-out, right 0.3s ease-in-out;
          bottom: 0;
          left: 50%;
          right: 50%;
          height: 1px;
          background-color: var(--ee-tabs-selected-color);
        }

        :host nav > ::slotted(:focus)::after,
        :host nav > ::slotted(:hover)::after {
          height: 1px;
          left: 0.5px;
          right: 0.5px;
          transition: height 0.3s ease-in-out, left 0.3s ease-in-out, right 0.3s ease-in-out;
        }

        :host nav > ::slotted([active])::after {
          content: '';
          background-color: var(--ee-tabs-active-color);
          left: 0.5px;
          right: 0.5px;
          bottom: 0;
          height: 4px;
          transition: height 0.3s ease-in-out, left 0.3s ease-in-out, right 0.3s ease-in-out;;
        }

        :host nav > ::slotted(:active) {
          background: #cccccc;
          border-bottom: 0;
          box-shadow: none;
        }

        `
      ]
    }
  }
};

const EeFab = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.lit.css`
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
};

const EeToolbar = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.lit.css`
        `
      ]
    }
  }
};

const EeHeader = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.lit.css`
        `
      ]
    }
  }
};

const EnForm = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.lit.css`
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
};

const EnInputRange = (base) => {
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
      super();
      this.labelPosition = 'after';
      this.validationMessagePosition = 'after';
    }

    static get styles () {
      return [
        super.styles,
        super.stylePatterns.inputField,
        super.stylePatterns.errorMessage,
        super.lit.css`

        ::slotted(#range-amount) {}
        `
      ]
    }
  }
};

const AddHasValueAttributeMixin = (base) => {
  return class Base extends base {
    _observeInput (e) {
      const target = e.currentTarget;
      this.toggleAttribute('has-value', __hasValue(target.value));
    }

    _observeFocus (e) {
      this.toggleAttribute('has-focus', true);
    }

    _observeBlur (e) {
      this.toggleAttribute('has-focus', false);
    }

    afterSettingProperty (prop, newValue) {
      super.afterSettingProperty();

      if (prop === 'value') {
        this.toggleAttribute('has-value', __hasValue(newValue));
      }
    }

    firstUpdated () {
      super.firstUpdated();

      this.native.addEventListener('input', this._observeInput.bind(this));
      this.native.addEventListener('focus', this._observeFocus.bind(this));
      this.native.addEventListener('blur', this._observeBlur.bind(this));

      this.toggleAttribute('has-value', __hasValue(this.value));
    }
  }
};

function __hasValue (v) {
  return v !== 'undefined' && v !== 'null' && v !== ''
}

const NnInputText = (base) => {
  return class Base extends AddHasValueAttributeMixin(base) {
    // Style depends on CSS being able to find label as sibling of the #native element.
    // CSS can select next siblings, but not previous.  This guarantees label is rendered after #native in the shadowDOM
    static get properties () {
      return {
        labelPosition: { type: String, attribute: false },
        validationMessagePosition: { type: String, attribute: false }
      }
    }

    constructor () {
      super();
      this.labelPosition = 'after';
      this.validationMessagePosition = 'after';
    }

    firstUpdated () {
      super.firstUpdated();
      for (const k of ['leading', 'trailing']) {
        const el = document.createElement('slot');
        el.setAttribute('name', k);
        this.shadowRoot.appendChild(el);
      }
    }

    static get styles () {
      return [
        super.styles,
        super.stylePatterns.inputField,
        super.stylePatterns.inputLabel,
        super.stylePatterns.floatingLabel,
        super.stylePatterns.hoverStyle,
        super.stylePatterns.focusStyle,
        super.stylePatterns.errorMessage,
        super.stylePatterns.requiredLabelAsterisk,
        super.lit.css`
          #native[has-leading] {
            padding-left: 36px;
          }

          #native[has-trailing] {
            padding-right: 36px;
          }

          ::slotted([slot=leading]),
          ::slotted([slot=trailing]) {
            position: absolute;
            top: var( --mat-input-icon-top, 16px);
            left: var( --mat-input-icon-left, 16px);
            height: var( --mat-input-icon-height, 24px);
            width: var( --mat-input-icon-width, 24px);
          }

          ::slotted([slot=trailing]) {
            left: unset;
            right: var( --mat-input-icon-right, 16px);
          }

          :host([has-leading]) label{
            margin-left: 30px
          }
        `
      ]
    }
  }
};

const NnInputButton = (base) => {
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
};

const NnButton = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.lit.css`
          :host {
            width: max-content;
            padding: 4px 10px;
          }

          button {
            display: var(--nn-button-display, inline);
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
            text-decoration: none !important;
          }

          #native:disabled {
            filter: saturate(0);
            opacity: 0.85;
          }

          #native:disabled:hover {
            background-color: grey;
            filter: brightness(130%);
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
};

const NnForm = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.lit.css`
        `
      ]
    }
  }
};

const NnInputCheckBox = (base) => {
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
      super();
      this.labelPosition = 'after';
      this.validationMessagePosition = 'after';
      this.label = '';
    }

    firstUpdated () {
      if (super.firstUpdated) super.firstUpdated();
      this.shadowRoot.querySelector('label').addEventListener('click', (e) => { e.stopPropagation(); });
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
};

const NnInputColor = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.stylePatterns.hoverStyle,
        super.stylePatterns.focusStyle,
        super.lit.css`
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
};

const NnInputDatalist = (base) => {
  return class Base extends AddHasValueAttributeMixin(base) {
    static get properties () {
      return {
        labelPosition: { type: String, attribute: false },
        validationMessage: { type: String, attribute: false }
      }
    }

    constructor () {
      super();
      this.labelPosition = 'after';
      this.validationMessagePosition = 'after';
    }

    connectedCallback () {
      super.connectedCallback();
      this.onclick = () => { this.native.click(); };
    }

    static get styles () {
      return [
        super.styles,
        super.stylePatterns.inputField,
        super.stylePatterns.inputLabel,
        super.stylePatterns.floatingLabel,
        super.lit.css`
          :host::after {
            position: absolute;
            content: '';
            border: 4px solid transparent;
            border-top-color: var(--mat-boundaries-color);
            right: 20px;
            bottom: 50%;
            user-select: none;
          }

          #native {
            width: 100%;
          }
        `
      ]
    }
  }
};

const NnInputDate = (base) => {
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
      super();
      this.labelPosition = 'after';
      this.validationMessagePosition = 'after';
    }

    static get styles () {
      return [
        super.styles,
        super.stylePatterns.inputField,
        super.stylePatterns.inputLabel,
        super.stylePatterns.fixedLabel,
        super.stylePatterns.errorMessage
      ]
    }
  }
};

const NnInputDateTimeLocal = (base) => {
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
      super();
      this.labelPosition = 'after';
      this.validationMessagePosition = 'after';
    }

    static get styles () {
      return [
        super.styles,
        super.stylePatterns.inputField,
        super.stylePatterns.inputLabel,
        super.stylePatterns.fixedLabel,
        super.stylePatterns.errorMessage
      ]
    }
  }
};

const NnInputEmail = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.lit.css`
        `
      ]
    }
  }
};

const NnInputFile = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.lit.css`
          :host {
            min-width: 130px;
          }

          #filename {
            box-sizing: border-box;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin: 4px 10px;
            border-radius: 4px;
            border: 1px solid #ccc;
            background-color: whitesmoke;
          }
        `
      ]
    }

    static get properties () {
      return {
        labelPosition: { type: String, attribute: false },
        validationMessagePosition: { type: String, attribute: false },
        buttonLabel: { type: String, attribute: 'button-label' }
      }
    }

    constructor () {
      super();
      this.labelPosition = 'after';
      this.validationMessagePosition = 'after';
      this.hideNative = true;
      this.buttonLabel = 'Choose File';
    }

    themeRender () {
      return this.lit.html`
        <nn-button @click=${this._chooseFile}>${this.buttonLabel}</nn-button>
        <input type="file" id="native" @change="${this.fileNameChanged}" ?hidden=${this.hideNative}>
        ${this.ifValidationMessageAfter}
        ${this.fileName
        ? this.lit.html`
            <div id="filename" title="${this.fileName}">${this.fileName}</div>
          `
        : ''
        }
        ${this.ifLabelAfter}
      `
    }

    _chooseFile (e) {
      this.shadowRoot.querySelector('#native').click();
    }
  }
};

const NnInputMonth = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.lit.css`
        `
      ]
    }
  }
};

const NnInputNumber = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.lit.css`
        `
      ]
    }
  }
};

const NnInputPassword = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.lit.css`
        `
      ]
    }
  }
};

const NnInputRadio = (base) => {
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
      super();
      this.labelPosition = 'after';
      this.validationMessagePosition = 'after';
      this.label = '';
    }

    firstUpdated () {
      if (super.firstUpdated) super.firstUpdated();
      this.shadowRoot.querySelector('label').addEventListener('click', (e) => { e.stopPropagation(); });
    }

    static get styles () {
      return [
        super.styles,
        super.stylePatterns.errorMessage,
        super.stylePatterns.hideNativeWidget,
        super.stylePatterns.requiredLabelAsterisk,
        super.lit.css`
        :host {
          display: inline-block;
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
          border-radius: 50%;
          transition: background-color 0.3s ease-in-out;
        }

        #native:checked ~ label::before {
          border-color: var(--mat-primary-color);
          background-color:  transparent;
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

        label::after {
          content: "";
          position: absolute;
          opacity: 0;
          width: 19px;
          height: 19px;
          will-change: transform, opacity;
          transition: opacity 0.3s ease-out;
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
        // super.lit.css`
        //   :host {
        //     display: block;
        //     position: relative;
        //     padding-left: 24px;
        //     margin-bottom: 12px;
        //     cursor: pointer;
        //     -webkit-user-select: none;
        //     -moz-user-select: none;
        //     -ms-user-select: none;
        //     user-select: none;
        //   }

        //   :host::after {
        //     content: '';
        //     user-select: none;
        //     position: absolute;
        //     height: 8px;
        //     width: 8px;
        //     border-radius: 50%;
        //     left: 5px;
        //     top: 5px;
        //     will-change: transform;
        //   }

        //   :host(:hover)::after {
        //     background: var(--mat-primary-color);
        //     opacity: 0.1;
        //     transform: scale(4);
        //     transition: all 0.3s ease-in-out;
        //   }

        //   :host([has-focus])::after {
        //     background: var(--mat-primary-color);
        //     opacity: 0.3;
        //     transform: scale(4);
        //     transition: all 0.3s ease-in-out;
        //   }

        //   div#label-text {
        //     padding-left: 16px;
        //   }

        //   #native:invalid {
        //     background-color: var(--mat-error-color);
        //     color: var(--mat-error-text);
        //     border-color: var(--mat-error-text);
        //   }

        //   :invalid {
        //     border: unset;
        //     border-bottom: var(--mat-input-border, var(--mat-theme-border));
        //   }

        //   #native:invalid + label, #native:invalid ~ label {
        //     background-color: none;
        //     --mat-label-color: darkred;
        //   }

        //   label::before { /* Background box */
        //     content: '';
        //     position: absolute;
        //     top: 0;
        //     left: 0;
        //     height: 15px;
        //     width: 15px;
        //     border: 2px solid var(--mat-boundaries-color);
        //     border-radius: 50%;
        //     transition: background-color 0.3s ease-in-out;
        //   }

        //   #native:checked ~ label::before {
        //     border-color: var(--mat-primary-color);
        //     background-color: transparent;
        //     transition: background-color 0.3s ease-in-out;
        //   }

        //   #native:hover ~ label::before {
        //     filter: brightness(115%);
        //     transition: filter 0.3s ease-in-out;
        //   }

        //   #native:focus ~ label::before {
        //     box-shadow: var(--mat-theme-box-shadow2);
        //     border-color: var(--mat-primary-color);
        //     filter: brightness(115%);
        //   }

        //   #native:not([checked]):hover ~ label::before {
        //     filter: brightness(130%);
        //     transition: background-color 0.3s ease-in-out;
        //   }

        //   label::after { /* Checkmark */
        //     content: "";
        //     position: absolute;
        //     opacity: 0;
        //     width: 19px;
        //     height: 19px;
        //     will-change: transform, opacity;
        //     transition: opacity 0.3s ease-out;
        //   }

        //   #native:checked ~ label::after {
        // display: block;
        // left: 0;
        // top: 0;
        // opacity: 1;
        // background-color:  var(--mat-primary-color);
        // border-radius: 50%;
        // -webkit-transform: scale(0.5);
        // -ms-transform: scale(0.5);
        // transform: scale(0.5);
        // transition: transform 0.3s ease-in-out, opacity 0.3s ease-in;
        //   }

        // `
      ]
    }
  }
};

const NnInputRange = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.lit.css`
        `
      ]
    }
  }
};

const NnInputSearch = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.lit.css`
        `
      ]
    }
  }
};

const NnInputSubmit = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.lit.css`
        `
      ]
    }
  }
};

const NnInputTel = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.lit.css`
        `
      ]
    }
  }
};

const NnInputTime = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.lit.css`
        `
      ]
    }
  }
};

const NnInputUrl = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.lit.css`
        `
      ]
    }
  }
};

const NnInputWeek = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.lit.css`
        `
      ]
    }
  }
};

const NnMeter = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.lit.css`
        `
      ]
    }
  }
};

const NnProgress = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.lit.css`
        `
      ]
    }
  }
};

const NnSelect = (base) => {
  return class Base extends AddHasValueAttributeMixin(base) {
    // Style depends on CSS being able to find label as sibling of the #native element.
    // CSS can select next siblings, but not previous.  This guarantees label is rendered after #native in the shadowDOM
    static get properties () {
      return {
        labelPosition: { type: String, attribute: false },
        validationMessage: { type: String, attribute: false }
      }
    }

    constructor () {
      super();
      this.labelPosition = 'after';
      this.validationMessagePosition = 'after';
    }

    connectedCallback () {
      super.connectedCallback();
      this.onclick = () => { this.native.click(); };
    }

    static get styles () {
      return [
        super.styles,
        super.stylePatterns.inputField,
        super.stylePatterns.inputLabel,
        super.stylePatterns.fixedLabel,
        super.stylePatterns.errorMessage,
        super.stylePatterns.requiredLabelAsterisk,
        super.lit.css`
          :host::after {
            position: absolute;
            content: '';
            border: 4px solid transparent;
            border-top-color: var(--mat-boundaries-color);
            right: 20px;
            bottom: 50%;
            user-select: none;
            pointer-events: none;
          }

          #native {
            width: 100%;
          }
        `
      ]
    }
  }
};

const NnTextArea = (base) => {
  return class Base extends AddHasValueAttributeMixin(base) {
    // Style depends on CSS being able to find label as sibling of the #native element.
    // CSS can select next siblings, but not previous.  This guarantees label is rendered after #native in the shadowDOM
    static get properties () {
      return {
        labelPosition: { type: String, attribute: false },
        validationMessage: { type: String, attribute: false }
      }
    }

    constructor () {
      super();
      this.labelPosition = 'after';
      this.validationMessagePosition = 'after';
    }

    static get styles () {
      return [
        super.styles,
        super.stylePatterns.inputField,
        super.stylePatterns.inputLabel,
        super.stylePatterns.floatingLabel,
        super.stylePatterns.errorMessage,
        super.stylePatterns.requiredLabelAsterisk,
        super.lit.css`
          :host {
            --mat-form-element-height: 80px;
          }
          /* Following material design guidelines, non-resizeable textarea */
          textarea#native {
            font-family: var(--mat-font-family);
            padding-top: 12px;
            min-height: 80px;
            height: unset;
            padding-top: 30px;
            width: -webkit-fill-available;
          }
        `
      ]
    }
  }
};

const EeAutocomplete = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.lit.css`
        `
      ]
    }
  }
};

const EeAutocompleteInputSpans = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.stylePatterns.inputField,
        super.lit.css`
        `
      ]
    }
  }
};

window.TP_THEME = {
  shared: Shared,

  'ee-drawer': EeDrawer,
  'ee-network': EeNetwork,
  'ee-snack-bar': EeSnackBar,
  'ee-tabs': EeTabs,
  'ee-fab': EeFab,
  'ee-autocomplete': EeAutocomplete,
  'ee-autocomplete-input-spans': EeAutocompleteInputSpans,

  'ee-toolbar': EeToolbar,
  'ee-header': EeHeader,

  'en-form': EnForm,
  'en-input-Range': EnInputRange,

  'nn-button': NnButton,
  'nn-form': NnForm,
  'nn-input-button': NnInputButton,
  'nn-input-checkbox': NnInputCheckBox,
  'nn-input-color': NnInputColor,
  'nn-input-datalist': NnInputDatalist,
  'nn-input-date': NnInputDate,
  'nn-input-date-time-local': NnInputDateTimeLocal,
  'nn-input-email': NnInputEmail,
  'nn-input-file': NnInputFile,
  'nn-input-month': NnInputMonth,
  'nn-input-number': NnInputNumber,
  'nn-input-password': NnInputPassword,
  'nn-input-radio': NnInputRadio,
  'nn-input-range': NnInputRange,
  'nn-input-search': NnInputSearch,
  'nn-input-submit': NnInputSubmit,
  'nn-input-tel': NnInputTel,
  'nn-input-text': NnInputText,
  'nn-input-time': NnInputTime,
  'nn-input-url': NnInputUrl,
  'nn-input-week': NnInputWeek,
  'nn-meter': NnMeter,
  'nn-progress': NnProgress,
  'nn-select': NnSelect,
  'nn-textarea': NnTextArea
};

const TP_THEME = window.TP_THEME;

export { TP_THEME };
