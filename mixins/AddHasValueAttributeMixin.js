
export const AddHasValueAttributeMixin = (base) => {
  return class Base extends base {
    _observeInput (e) {
      const target = e.currentTarget
      this.toggleAttribute('has-value', typeof target !== 'undefined')
    }

    _observeFocus (e) {
      this.toggleAttribute('has-focus', true)
    }

    _observeBlur (e) {
      this.toggleAttribute('has-focus', false)
    }

    afterSettingProperty (prop, newValue) {
      super.afterSettingProperty()

      if (prop === 'value') {
        this.toggleAttribute('has-value', typeof newValue !== 'undefined')
      }
    }

    firstUpdated () {
      super.firstUpdated()

      this.native.addEventListener('input', this._observeInput)
      this.native.addEventListener('focus', this._observeFocus)
      this.native.addEventListener('blur', this._observeBlur)

      this.toggleAttribute('has-value', typeof this.value !== 'undefined')
    }
  }
}
