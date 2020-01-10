import { css } from 'lit-element'

// This is a light implementation of material guidelines.
// It does not aim to be a complete, comprehensive, Material Design components library, but to showcase the flexiblity of the TPE theming system.
// Guidelines can be found in: https://material.io/components

export const requiredLabelAsterisk = css`
  #native:required ~ label div#label-text::after {
    content: '*';
    padding-left: 2px;
    position: relative;
  }
`

// export const requiredStyle
// export const invalidStyle
export const hoverStyle = css`
  :host(:hover) {
    --mat-theme-box-shadow: var(--mat-theme-box-shadow2);
  }

  :host([disabled]:hover) {
    --mat-theme-box-shadow: none;
  }
`
export const focusStyle = css`
  :host([has-focus]), :host([has-focus][outlined]) {
    --mat-theme-border: 2px solid var(--mat-primary-color);
    /* --mat-background: var(--mat-background-light); */
    --mat-label-color: var(--mat-primary-color);
  }

  :host([has-focus]) #native {
    padding-bottom: -1px;
  }
`

export const inputField = css`
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
    padding: 8px 8px 0;
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
    border-style: none;
    border-color: transparent;
    border-bottom: var(--mat-input-border, var(--mat-theme-border));
    color: var(--mat-input-color, inherit);
    background-color: var(--mat-background, #eee);
    width: 100%;
    font-size: 14px;
    padding: 20px 16px 0;
    height: var(--mat-form-element-height);
    box-shadow: var(--mat-theme-box-shadow);
    transition: background-color 0.3s ease-in-out,
      color 0.3s ease-in-out,
      box-shadow 0.3s ease-in-out;
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

  ${hoverStyle}
  ${focusStyle}
`

export const inputLabel = css`
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
    will-change: transform, background-color;
    transition: all 0.3s ease-in-out;
  }

  #native:invalid + label,
  #native:invalid ~ label {
    background-color: none;
    --mat-label-color: darkred;
  }

  ${requiredLabelAsterisk}
`

export const floatingLabel = css`

  :host([has-value]) label,
  #native:focus ~ label,
  #native:placeholder-shown ~ label {
    transform: translateY(calc(var(--half-height) / -1)) translateX(-10px) scale(0.8);
    transition: all 0.3s ease-in-out, background 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  :host([dense][has-value]) label,
  :host([dense]) #native:focus ~ label,
  :host([dense]) #native:placeholder-shown ~ label {
    background: var(--mat-label-background, transparent)
  }

  :host([outlined]:not([dense][has-value]) label,
  :host([outlined]:not([dense]) #native:focus ~ label,
  :host([outlined]:not([dense]) #native:placeholder-shown ~ label {
    transform: translateY(calc(var(--half-height) / -1)) translateX(-10px) scale(0.8);;
    background: var(--mat-label-background, transparent);
  }
`

export const fixedLabel = css`
  label, #native:focus ~ label,
  :host([has-value]) label,
  #native:placeholder-shown ~ label {
    top: 12px !important;
    transform: translateY(-50%) scale(0.8);
    transition: all 0.3s ease-in-out;
  }

`

export const errorMessage = css`
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
`

export const hideNativeWidget = css`
  input {
    position: unset;
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
`
