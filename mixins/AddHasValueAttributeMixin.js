
export const AddHasValueAttributeMixin = (base) => {
  return class Base extends base {
    _observeInput (e) {
      const target = e.currentTarget
      this.toggleAttribute('has-value', __hasValue(target.value))
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
        this.toggleAttribute('has-value', __hasValue(newValue))
      }
    }

    firstUpdated () {
      super.firstUpdated()

      this.native.addEventListener('input', this._observeInput.bind(this))
      this.native.addEventListener('focus', this._observeFocus.bind(this))
      this.native.addEventListener('blur', this._observeBlur.bind(this))

      this.toggleAttribute('has-value', __hasValue(this.value))
    }
  }
}

function __hasValue (v) {
  return v !== 'undefined' && v !== 'null' && v !== ''
}
