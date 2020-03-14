export const NnInputFile = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.lit.css`

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
      super()
      this.labelPosition = 'after'
      this.validationMessagePosition = 'after'
      this.hideNative = true
      this.buttonLabel = 'Choose File'
    }

    themeRender () {
      return this.lit.html`
        <nn-button @click=${this._chooseFile}>${this.buttonLabel}</nn-button>
        <input type="file" id="native" @change="${this.fileNameChanged}" ?hidden=${this.hideNative}>
        ${this.ifValidationMessageAfter}
        <div id="filename">${this.fileName}</div>
        ${this.ifLabelAfter}
      `
    }

    _chooseFile (e) {
      this.shadowRoot.querySelector('#native').click()
    }
  }
}
