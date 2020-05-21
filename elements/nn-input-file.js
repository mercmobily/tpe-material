export const NnInputFile = (base) => {
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
      this.shadowRoot.querySelector('#native').click()
    }
  }
}
