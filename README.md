# Material Theme for TPE
This is a [Material Components](https://material.io/components) implementation using TPE's themeing system.
The system allows any developer to completely override the native components native stylesheet without thinking about shadow DOM.

## About this theme
TPE does not have any constraints as to how a theme is structured, except for the main theme file, which needs to set window.TP_THEME with the correct key names.
It also allows for a shared mixin set to window.TP_THEME.common. In TPE Material, the `material/global.js` file is assigned to that shared mixin. It contains all CSS custom properties defined and used across the theme.
Any of those properties can be redefined in the app scope, so the theme can be customised consistently. This is a summary of the contents:

- primary and secondary colours, both with light and dark variants
- primary and secondary text colours, plus high contrast variants
- error background and text colours
- border properties
- 6 shadow elevation settings
- standard form elements height and width

These properties are meant to allow for light customisation and branding, not to make the material theme extensible, so most of the design aspects in the theme are not accessible.

---
@TONY: I still need a few days using the theme on compas to figure out exactly how to improve the dev experience of the theme, so, I think the list of properties is still subject to changes. I think listing the properties in global and having a few cutomisation examples should be ok for the docs.
---

## style-patterns.js
This file contains some UI and style patterns that repeat throughout the elements. They are always LitElement `css` tagged template literals, which yield CSSTemplateResult objects.
These are imported in the relevant theme element mixin files and added in the `static get styles` array.
The floating label of input fields and the input style are some of those.

## Individual element files
This files, ideally, only need to use the appropriate styles-patterns templates to compose the look and feel of the element. There are, however, several exceptions which need specific CSS treatment, like chekbox, radio, textarea, select... For those, the `static get styles` are mostly unique.
