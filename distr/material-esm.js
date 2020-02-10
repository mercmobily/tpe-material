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
(window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.1.2');

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
    console.warn(`Incompatible ShadyCSS version detected. ` +
        `Please update to at least @webcomponents/webcomponentsjs@2.0.2 and ` +
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
    else if (typeof value === 'number') {
        return value;
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
    .push('2.2.1');

// In Material Design color tool: https://material.io/tools/color/#!/?view.left=0&view.right=0&primary.color=616161&secondary.color=512DA8

const Global = (base) => {
  return class Base extends base {
    static get styles () {
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
};

const EeDrawer = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
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
        super.styles,
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
        super.styles,
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
        super.styles,
        css`
        :host {
          --ee-tabs-selected-color: var(--mat-primary-color);
          --ee-tabs-color: var(--mat-primary-text);
        }

        :host nav > ::slotted(*:hover) {
          box-shadow: var(--mat-theme-box-shadow4);
        }

        :host nav > ::slotted(*) {
          border-bottom: 0 !important; 
          transition: all 0.3s ease-in-out;
          position: relative;
          box-sizing: border-box;
        }

        :host nav > ::slotted(*[active]) {
          color: var(--ee-tabs-selected-color);
          border-bottom: 0;
        }

        :host nav > ::slotted(*:focus),
        :host nav > ::slotted(*:hover) {
          outline:0 ;
          border-bottom: 0;
          filter: brightness(150%);
        }

        :host nav > ::slotted(*)::after,
        :host nav > ::slotted(*:not([active]))::after {
          content: '';
          position: absolute;
          transition: height 0.3s ease-in-out, left 0.3s ease-in-out, right 0.3s ease-in-out;
          bottom: 0;
          left: 50%;
          right: 50%;
          height: 1px;
          background-color: var(--ee-tabs-selected-color); 
        }
        
        :host nav > ::slotted(*:focus)::after,
        :host nav > ::slotted(*:hover)::after {
          height: 1px;
          left: 0.5px;
          right: 0.5px;
          transition: height 0.3s ease-in-out, left 0.3s ease-in-out, right 0.3s ease-in-out;
        }

        :host nav > ::slotted(*[active])::after {
          content: '';
          background-color: var(--ee-tabs-selected-color); 
          left: 0.5px;
          right: 0.5px;
          bottom: 0;
          height: 4px;
          transition: height 0.3s ease-in-out, left 0.3s ease-in-out, right 0.3s ease-in-out;;
        }

        :host nav > ::slotted(*:active) {
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
};

const EeToolbar = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        css`
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

const hoverStyle = css`
  :host(:hover) {
    --mat-theme-box-shadow: var(--mat-theme-box-shadow2);
  }

  :host([disabled]:hover) {
    --mat-theme-box-shadow: none;
  }
`;
const focusStyle = css`
  :host([has-focus]), :host([has-focus][outlined]) {
    --mat-theme-border: 2px solid var(--mat-primary-color);
    --mat-label-color: var(--mat-primary-color);
  }

  :host([has-focus]) #native {
    padding-bottom: -1px;
  }
`;

const inputField = css`
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

  ${hoverStyle}
  ${focusStyle}
`;

const inputLabel = css`
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
    top: var(--half-height);
    transform: translateY(-50%);
    left: 12px;
    will-change: transform;
    transition: transform 0.1s ease-in-out;
  }

  #native:invalid + label,
  #native:invalid ~ label {
    background-color: none;
    --mat-label-color: darkred;
  }
`;

const floatingLabel = css`

  :host([has-value]) label,
  #native:focus ~ label,
  #native:placeholder-shown ~ label {
    transform: translateY(calc(var(--half-height) / -1)) translateX(-10px) scale(0.8);
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
    transform: translateY(calc(var(--half-height) / -1)) translateX(-10px) scale(0.8);
    background: var(--mat-label-background, transparent);
  }
`;

const fixedLabel = css`
  label, #native:focus ~ label,
  :host([has-value]) label,
  #native:placeholder-shown ~ label {
    top: 12px !important;
    transform: translateY(-50%) scale(0.8);
  }

`;

const errorMessage = css`
  span.error-message {
    position: absolute;
    bottom: 0;
    left: 16px;
    font-size: 80%;
    white-space: nowrap;
    opacity: 0;
    line-height: 0.8;
  }

  #native:invalid ~ span.error-message {
    opacity: 1;
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
        inputField,
        errorMessage,
        css`

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

      this.toggleAttribute('has-value', !!this.value);
    }
  }
};

const NnInputText = (base) => {
  return class Base extends AddHasValueAttributeMixin(base) {
    // render () {
    //   if (this.themeRender) return this.themeRender()
    //   const class = {
    //     'has-value': !!this.value,
    //     'has-leading': !!this.leading,
    //     'has-trailing': !!this.trailing
    //   };
    //   return html`
    //     ${this.ifLabelBefore}
    //     ${this.ifValidationMessageBefore}
    //     <input class=${classMap(class)} type="text" id="native" real-time-event="input">
    //     ${this.ifValidationMessageAfter}
    //     ${this.ifLabelAfter}
    //     <slot id="datalist-slot" name="datalist"></slot>
    //   `
    // }
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
        inputField,
        inputLabel,
        floatingLabel,
        errorMessage,
        css`
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

          :host([has-leading]:not([has-value])) label{
            margin-left: 36px
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
        css`
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
};

const NnForm = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        css`
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
            z-index: 0;
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
            padding: var(----nn-checkbox-label-padding);
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
            z-index: 1;
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
        inputField,
        inputLabel,
        floatingLabel,
        css`
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
        super.styles,
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
        super.styles,
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
        super.styles,
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
        super.styles,
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
        super.styles,
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
        super.styles,
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

    firstUpdated() {
      if (super.firstUpdated) super.firstUpdated();
      this.shadowRoot.querySelector('label').addEventListener('click', (e) => {e.preventDefault();});
    }

    static get styles () {
      return [
        super.styles,
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
};

const NnInputRange = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
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
        super.styles,
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
        super.styles,
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
        super.styles,
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
        super.styles,
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
        super.styles,
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
        super.styles,
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
        super.styles,
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
        super.styles,
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
        super.styles,
        inputField,
        inputLabel,
        floatingLabel,
        css`
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
        inputField,
        inputLabel,
        floatingLabel,
        errorMessage,
        css`
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
        super.styles,
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
