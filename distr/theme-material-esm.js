/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
const marker = `{{lit-${String(Math.random()).slice(2)}}}`;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// Detect event listener options support. If the `capture` property is read
// from the options object, then options are supported. If not, then the thrid
// argument to add/removeEventListener is interpreted as the boolean capture
// value so we should only pass the `capture` property.
let eventOptionsSupported = false;
try {
    const options = {
        get capture() {
            eventOptionsSupported = true;
            return false;
        }
    };
    // tslint:disable-next-line:no-any
    window.addEventListener('test', options, options);
    // tslint:disable-next-line:no-any
    window.removeEventListener('test', options, options);
}
catch (_e) {
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
// TODO(justinfagnani): inject version number at build time
(window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.0.0');

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
if (typeof window.ShadyCSS === 'undefined') ;
else if (typeof window.ShadyCSS.prepareTemplateDom === 'undefined') {
    console.warn(`Incompatible ShadyCSS version detected.` +
        `Please update to at least @webcomponents/webcomponentsjs@2.0.2 and` +
        `@webcomponents/shadycss@1.3.1.`);
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
 * replaced at compile time by the munged name for object[property]. We cannot
 * alias this function, so we have to use a small shim that has the same
 * behavior when not compiling.
 */
window.JSCompiler_renameProperty =
    (prop, _obj) => prop;

/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
const supportsAdoptingStyleSheets = ('adoptedStyleSheets' in Document.prototype) &&
    ('replace' in CSSStyleSheet.prototype);
const constructionToken = Symbol();
class CSSResult {
    constructor(cssText, safeToken) {
        if (safeToken !== constructionToken) {
            throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
        }
        this.cssText = cssText;
    }
    // Note, this is a getter so that it's lazy. In practice, this means
    // stylesheets are not created until the first element instance is made.
    get styleSheet() {
        if (this._styleSheet === undefined) {
            // Note, if `adoptedStyleSheets` is supported then we assume CSSStyleSheet
            // is constructable.
            if (supportsAdoptingStyleSheets) {
                this._styleSheet = new CSSStyleSheet();
                this._styleSheet.replaceSync(this.cssText);
            }
            else {
                this._styleSheet = null;
            }
        }
        return this._styleSheet;
    }
    toString() {
        return this.cssText;
    }
}
const textFromCSSResult = (value) => {
    if (value instanceof CSSResult) {
        return value.cssText;
    }
    else {
        throw new Error(`Value passed to 'css' function must be a 'css' function result: ${value}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`);
    }
};
/**
 * Template tag which which can be used with LitElement's `style` property to
 * set element styles. For security reasons, only literal string values may be
 * used. To incorporate non-literal values `unsafeCSS` may be used inside a
 * template string part.
 */
const css = (strings, ...values) => {
    const cssText = values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
    return new CSSResult(cssText, constructionToken);
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for LitElement usage.
// TODO(justinfagnani): inject version number at build time
(window['litElementVersions'] || (window['litElementVersions'] = []))
    .push('2.0.1');

// In Material Design color tool: https://material.io/tools/color/#!/?view.left=0&view.right=0&primary.color=616161&secondary.color=512DA8

const Global = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        ...super.styles,
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
            --nn-font-family: var(--app-font-family, Roboto, sans-serif);
            --nn-primary-color: var(--app-primary-color, #455a64);
            --nn-primary-color-light: var(--app-primary-color-light, #718792);
            --nn-primary-color-dark: var(--app-primary-color-dark, #1c313a);
            --nn-secondary-color: var(--app-secondary-color, #512da8);
            --nn-secondary-color-light: var(--app-secondary-color-light, #8559da);
            --nn-secondary-color-dark: var(--app-secondary-color-dark, #140078);
            --nn-boundaries-color: var(--app-boundaries-color, #777);
            --nn-primary-text: var(--app-primary-text, #777);
            --nn-secondary-text: var(--app-secondary-text, #000);
            --nn-text-on-dark: var(--app-text-on-dark, #fff);
            --nn-text-on-light: var(--app-text-on-light, #000);
            --nn-error-color: var(--app-error-color, pink);
            --nn-error-text: var(--app-error-text, darkred);
            --nn-theme-border-style: var(--app-theme-border-style, solid);
            --nn-theme-border-width: var(--app-theme-border-width, 1px);
            --nn-theme-border-color: var(--nn-boundaries-color);
            --nn-theme-border-radius: var(--app-theme-border-radius, 5px);
            --nn-theme-border: var(--app-theme-border, var(--nn-theme-border-width) var(--nn-theme-border-style) var(--nn-theme-border-color));
            --nn-theme-box-shadow: var(--app-theme-box-shadow, none);
            --nn-theme-box-shadow1: var(--app-theme-box-shadow1, 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06));
            --nn-theme-box-shadow2: var(--app-theme-box-shadow2, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06));
            --nn-theme-box-shadow3: var(--app-theme-box-shadow3, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05));
            --nn-theme-box-shadow4: var(--app-theme-box-shadow4, 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04));
            --nn-theme-box-shadow5: var(--app-theme-box-shadow5, 0 25px 50px -12px rgba(0, 0, 0, 0.25));
            --nn-theme-shadow-transition: var(--app-theme-shadow-transition, box-shadow 0.3s cubic-bezier(.25,.8,.25,1));
            --nn-form-element-height: var(--app-form-element-height, 56px);
            --nn-form-element-min-width: var(--app-form-element-height, 280px);
            --nn-background: var(--app-background, #eee);
            --nn-background-dark: var(--app-background-dark, #ccc);
          }

          :host([hidden]) {
            display: none;
          }
        `
      ]
    }
  }
};

const EeDrawer = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        ...super.styles || [],
        css`
        `
      ]
    }
  }
};

const EeNetwork = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        ...super.styles || [],
        css`
        `
      ]
    }
  }
};

const EeSnackBar = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        ...super.styles || [],
        css`
        `
      ]
    }
  }
};

const EeTabs = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        ...super.styles || [],
        css`
        `
      ]
    }
  }
};

const EnForm = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        ...super.styles || [],
        css`
          :invalid {
            border: unset;
            border-bottom: var(--nn-input-border, var(--nn-theme-border));
          }
        `
      ]
    }
  }
};

const EnInputRange = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        ...super.styles || [],
        css`
        `
      ]
    }
  }
};

const AddHasValueAttributeMixin = (base) => {
  return class Base extends base {
    _observeInput (e) {
      const target = e.currentTarget;
      this.toggleAttribute('has-value', !!target.value.length);
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
        this.toggleAttribute('has-value', !!newValue);
      }
    }

    firstUpdated () {
      super.firstUpdated();

      this.native.addEventListener('input', this._observeInput);
      this.native.addEventListener('focus', this._observeFocus);
      this.native.addEventListener('blur', this._observeBlur);
    }
  }
};

// This is a light implementation of material guidelines.
// It does not aim to be a complete, comprehensive, Material Design components library, but to showcase the flexiblity of the TPE theming system.
// Guidelines can be found in: https://material.io/components

const requiredLabelAsterisk = css`
  #native:required ~ label div#label-text::after {
    content: '*';
    padding-left: 2px;
    position: relative;
  }
`;

// export const requiredStyle
// export const invalidStyle
const hoverStyle = css`
  :host(:hover) {
    --nn-background: var(--nn-background-dark);
    --nn-theme-box-shadow: var(--nn-theme-box-shadow2);
  }
`;
const focusStyle = css`
  :host([has-focus]) {
    --nn-theme-border: 2px solid var(--nn-primary-color);
    --nn-background: var(--nn-background-dark);
    --nn-label-color: var(--nn-primary-color);
  }

  :host([has-focus]) #native {
    padding-bottom: 5px;
  }
`;

const inputField = css`
  :host {
    position: relative;
    padding: 0 12px;
    padding-bottom: 16px;
    margin: 10px;
    min-width: var(--nn-form-element-min-width, fit-content);
    font-family: var(--font-family);
    transition: all 0.3s ease-in-out; /* @raphael: THIS IS THE LINE */
  }

  #native {
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    box-sizing: border-box;
    display: block;
    border-radius: var(--nn-input-border-radius, 4px 4px 0 0);
    border-width: 0;
    border-style: none;
    border-color: transparent;
    border-bottom: var(--nn-input-border, var(--nn-theme-border));
    color: var(--nn-input-color, inherit);
    background-color: var(--nn-background, #eee);
    width: 100%;
    font-size: 1em;
    padding: 20px 16px 6px;
    height: var(--nn-form-element-height);
    box-shadow: var(--nn-theme-box-shadow);
    transition: all 0.3s ease-in-out;
  }

  #native:focus,
  #native:active {
    outline: none
  }

  #native::selection {
    background-color: var(--nn-background-dark);
  }

  #native:invalid {
    background-color: var(--nn-error-color);
    color: var(--nn-error-text);
    border-color: var(--nn-error-text);
  }

  ${hoverStyle}
  ${focusStyle}
`;

const inputLabel = css`
   label {
    position: absolute;
    display: inline-flex;
    font-size: 1em;
    border: var(--nn-label-border, none);
    color: var(--nn-label-color,  var(--nn-primary-color-light));
    padding-left: 12px;
    padding-right: 12px;
    min-width: fit-content;
    white-space: nowrap;
    top: calc(50% - 8px);
    transform: translateY(-50%);
    will-change: transform, background-color;
    transition: all 0.3s ease-in-out;
  }

  #native:invalid + label,
  #native:invalid ~ label {
    background-color: none;
    --nn-label-color: darkred;
  }

  ${requiredLabelAsterisk}
`;

const floatingLabel = css`

  :host([has-value]) label,
  #native:focus ~ label,
  #native:placeholder-shown ~ label {
    transform: translateY(-130%);
    font-size: 80%;
    transition: all 0.3s ease-in-out;
    margin-left: 0px;
  }

`;

const fixedLabel = css`
  label, #native:focus ~ label,
  :host([has-value]) label,
  #native:placeholder-shown ~ label {
    top: 12px !important;
    transform: translateY(-50%);;
    font-size: 80%;
    transition: all 0.3s ease-in-out;
  }

`;

const errorMessage = css`
  span.error-message {
    position: absolute;
    bottom: 0;
    transform: translateY(100%);
    left: 16px;
    font-size: 80%;
    white-space:nowrap;
    opacity: 0;
    will-change: transform, opacity;
    transition: all 0.3s ease-in-out;
  }

  #native:invalid ~ span.error-message {
    opacity: 1;
    transform: translateY(10%);
    transition: all 0.3s ease-in-out;
  }
`;

const hideNativeWidget = css`
  input {
    position: unset;
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
`;

const NnInputText = (base) => {
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
        super.styles || [],
        inputField,
        inputLabel,
        floatingLabel,
        errorMessage,
        css`
        `
      ]
    }
  }
};

const NnInputButton = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        ...super.styles || [],
        css`
          :host {
            display: inline-block;
            width: fit-content;
            padding: 10px;
          }

          :host > input {
            height: var(--button-height, 30px);
            -webkit-appearance: none;
            background-color: var(--button-background, var(--primary-color));
            border-radius: var(--nn-button-border-radius, 4px);
            border: var(--nn-button-border, var(--theme-border));
            border-color: transparent;
            text-transform: uppercase;
            color: var(--nn-button-color, var(--text-on-dark));
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
            border-color: var(--primary-color);
          }

          :host([text]:not([outlined])) input,
          :host([text]:not([raised])) input {
            background-color: transparent;
            color: var(--nn-button-color, var(--primary-color));
          }

          :host([text]:not([outlined])) input:active,
          :host([text]:not([raised])) input:active {
            border-style: solid;
            border-width: 1px;
            border-color: transparent;
          }

          :host([text]:not([outlined])) input:hover,
          :host([text]:not([raised])) input:hover {
            background-color: var(--primary-color-light);
            color: var(--primary-color-dark)
          }

          :host([outlined]:not([text])) input,
          :host([outlined]:not([raised])) input {
            background-color: transparent;
            color: var(--nn-button-color, var(--primary-color));
            border: var(--nn-button-border, var(--theme-border));
          }

          :host([outlined]:not([text])) input:hover,
          :host([outlined]:not([raised])) input:hover {
            background-color: var(--primary-color-light);
            color: var(--primary-color-dark)
          }

          :host([raised]:not([text])) input,
          :host([raised]:not([outlined])) input {
            box-shadow: var(--theme-box-shadow2);
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
        ...super.styles || [],
        css`
          :host {
            display: inline-block;
            width: fit-content;
            padding: 10px;
          }

          button {
            height: var(--nn-button-height, 30px);
            -webkit-appearance: none;
            background-color: var(--nn-button-background, var(--nn-primary-color));
            border-radius: var(--nn-button-border-radius, 4px);
            border: var(--nn-button-border, var(--nn-theme-border));
            border-color: transparent;
            text-transform: uppercase;
            color: var(--nn-button-color, var(--nn-text-on-dark));
            border-image: none;
          }

          button:hover {
            filter: brightness(130%);
          }

          button:active, button:focus {
            outline: none;
          }

          button:focus {
            border-color: rgba(255, 255, 255, 0.7);
            border-color: var(--nn-primary-color);
            box-shadow: var(--nn-theme-box-shadow2);
            filter: brightness(115%);
          }

          button:active {
            transition: all 0.2s ease-out;
            border-style: inset;
            border-color: var(--nn-primary-color);
          }

          :host([text]:not([outlined])) button,
          :host([text]:not([raised])) button {
            background-color: transparent;
            color: var(--nn-button-color, var(--nn-primary-color));
          }

          :host([text]:not([outlined])) button:focus,
          :host([text]:not([raised])) button:focus {
            background-color: transparent;
            color: var(--nn-button-color, var(--primary-color));
            box-shadow: var(--nn-theme-box-shadow2);
          }

          :host([text]:not([outlined])) button:active,
          :host([text]:not([raised])) button:active {
            border-style: solid;
            border-width: 1px;
            border-color: transparent;
          }

          :host([text]:not([outlined])) button:hover,
          :host([text]:not([raised])) button:hover {
            background-color: var(--nn-primary-color-light);
            color: var(--nn-primary-color-dark)
          }

          :host([outlined]:not([text])) button,
          :host([outlined]:not([raised])) button {
            background-color: transparent;
            color: var(--nn-button-color, var(--nn-primary-color));
            border: var(--nn-button-border, var(--nn-theme-border));
          }

          :host([outlined]:not([text])) button:hover,
          :host([outlined]:not([raised])) button:hover {
            background-color: var(--nn-primary-color-light);
            color: var(--nn-primary-color-dark)
          }

          :host([raised]:not([text])) button,
          :host([raised]:not([outlined])) button {
            box-shadow: var(--nn-theme-box-shadow3);
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
        ...super.styles || [],
        css`
          ::slotted(*) fieldset, ::slotted(fieldset) {
            border-radius: 5px;
            border-style: solid;
            padding: 16px;
          }

          ::slotted(*) legend, ::slotted(legend) {
            padding-inline-start: 10px !important;
            padding-inline-end: 10px !important;
          }
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

    static get styles () {
      return [
        ...super.styles || [],
        errorMessage,
        hideNativeWidget,
        requiredLabelAsterisk,
        css`
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
            background: var(--nn-primary-color);
            opacity: 0.1;
            transform: scale(4);
            transition: all 0.3s ease-in-out;
          }

          :host([has-focus])::after {
            background: var(--nn-primary-color);
            opacity: 0.4 !important;
            transform: scale(4);
            transition: all 0.3s ease-in-out;
          }

          div#label-text {
            padding-left: 16px;
          }

          #native:invalid + label, #native:invalid ~ label {
            background-color: none;
            --nn-label-color: darkred;
          }

          label::before { /* Background box */
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            height: 15px;
            width: 15px;
            border: 2px solid var(--nn-boundaries-color);
            border-radius: 3px;
            transition: background-color 0.3s ease-in-out;
            z-index: 1;
          }

          #native:checked ~ label::before {
            border-color: var(--nn-primary-color);
            background-color:  var(--nn-primary-color);
            transition: background-color 0.3s ease-in-out;
          }

          :host(:hover) label::before {
            filter: brightness(115%);
            transition: filter 0.3s ease-in-out;
            box-shadow: var(--nn-theme-box-shadow2);
          }

          #native:focus ~ label::before {
            box-shadow: var(--nn-theme-box-shadow2);
            border-color: var(--nn-primary-color);
            filter: brightness(115%);
          }

          #native:not([checked]):hover ~ label::before {
            filter: brightness(130%);
            background-color: var(--nn-primary-color);
            transition: background-color 0.3s ease-in-out;
          }

          label::after { /* Checkmark */
            content: "";
            position: absolute;
            opacity: 0;
            will-change: transform, opacity;
            transition: opacity 0.3s ease-out;
            z-index: 2;
          }

          #native:checked ~ label::after {
            display: block;
            left: 6px;
            top: 2px;
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
        ...super.styles || [],
        css`
        `
      ]
    }
  }
};

const NnInputDatalist = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        ...super.styles || [],
        css`
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
        super.styles || [],
        inputField,
        inputLabel,
        fixedLabel,
        errorMessage
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
        super.styles || [],
        inputField,
        inputLabel,
        fixedLabel,
        errorMessage
      ]
    }
  }
};

const NnInputEmail = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        ...super.styles || [],
        css`
        `
      ]
    }
  }
};

const NnInputFile = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        ...super.styles || [],
        css`
        `
      ]
    }
  }
};

const NnInputMonth = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        ...super.styles || [],
        css`
        `
      ]
    }
  }
};

const NnInputNumber = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        ...super.styles || [],
        css`
        `
      ]
    }
  }
};

const NnInputPassword = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        ...super.styles || [],
        css`
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

    static get styles () {
      return [
        ...super.styles || [],
        errorMessage,
        hideNativeWidget,
        requiredLabelAsterisk,
        css`
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
            background: var(--nn-primary-color);
            opacity: 0.1;
            transform: scale(4);
            transition: all 0.3s ease-in-out;
          }

          :host([has-focus])::after {
            background: var(--nn-primary-color);
            opacity: 0.3;
            transform: scale(4);
            transition: all 0.3s ease-in-out;
          }

          div#label-text {
            padding-left: 16px;
          }

          #native:invalid {
            background-color: var(--nn-error-color);
            color: var(--nn-error-text);
            border-color: var(--nn-error-text);
          }

          :invalid {
            border: unset;
            border-bottom: var(--nn-input-border, var(--nn-theme-border));
          }

          #native:invalid + label, #native:invalid ~ label {
            background-color: none;
            --nn-label-color: darkred;
          }

          label::before { /* Background box */
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            height: 15px;
            width: 15px;
            border: 2px solid var(--nn-boundaries-color);
            border-radius: 50%;
            transition: background-color 0.3s ease-in-out;
            z-index: 1;
          }

          #native:checked ~ label::before {
            border-color: var(--nn-primary-color);
            background-color: transparent;
            transition: background-color 0.3s ease-in-out;
          }

          #native:hover ~ label::before {
            filter: brightness(115%);
            transition: filter 0.3s ease-in-out;
          }

          #native:focus ~ label::before {
            box-shadow: var(--nn-theme-box-shadow2);
            border-color: var(--nn-primary-color);
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
            background-color:  var(--nn-primary-color);
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
};

const NnInputRange = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        ...super.styles || [],
        css`
        `
      ]
    }
  }
};

const NnInputSearch = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        ...super.styles || [],
        css`
        `
      ]
    }
  }
};

const NnInputSubmit = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        ...super.styles || [],
        css`
        `
      ]
    }
  }
};

const NnInputTel = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        ...super.styles || [],
        css`
        `
      ]
    }
  }
};

const NnInputTime = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        ...super.styles || [],
        css`
        `
      ]
    }
  }
};

const NnInputUrl = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        ...super.styles || [],
        css`
        `
      ]
    }
  }
};

const NnInputWeek = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        ...super.styles || [],
        css`
        `
      ]
    }
  }
};

const NnMeter = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        ...super.styles || [],
        css`
        `
      ]
    }
  }
};

const NnProgress = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        ...super.styles || [],
        css`
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
        super.styles || [],
        inputField,
        inputLabel,
        fixedLabel,
        css`
          :host::after {
            position: absolute;
            content: '';
            border: 4px solid transparent;
            border-top-color: var(--nn-boundaries-color-color);
            right: 20px;
            bottom: 50%;
            user-select: none;
          }
        `
      ]
    }
  }
};

const NnTextArea = (base) => {
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
        super.styles || [],
        inputField,
        inputLabel,
        floatingLabel,
        errorMessage,
        css`
          :host {
            --nn-form-element-height: 80px;
          }
          /* Following material design guidelines, non-resizeable textarea */
          textarea {
            font-family: var(--nn-font-family);
            padding-top: 12px;
            min-height: 80px;
            max-height: 80px;
            resize: none;
          }

          :host([has-value]) label, 
          #native:focus ~ label, 
          #native:placeholder-shown ~ label {
            transform: translateY(-200%);
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
        ...super.styles || [],
        css`
        `
      ]
    }
  }
};

const EeAutocompleteInputSpans = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        ...super.styles || [],
        inputField,
        css`
        `
      ]
    }
  }
};

window.TP_THEME = {
  common: Global,

  'ee-drawer': EeDrawer,
  'ee-network': EeNetwork,
  'ee-snack-bar': EeSnackBar,
  'ee-tabs': EeTabs,
  'ee-autocomplete': EeAutocomplete,
  'ee-autocomplete-input-spans': EeAutocompleteInputSpans,

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
