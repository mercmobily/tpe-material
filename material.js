import { Common } from './common.js'

import { EeDrawer } from './elements/ee-drawer.js'
import { EeNetwork } from './elements/ee-network.js'
import { EeSnackBar } from './elements/ee-snack-bar.js'
import { EeTabs } from './elements/ee-tabs.js'
import { EeFab } from './elements/ee-fab.js'

import { EeToolbar } from './elements/ee-toolbar.js'
import { EeHeader } from './elements/ee-header.js'

import { EnForm } from './elements/en-form.js'
import { EnInputRange } from './elements/en-input-range.js'

import { NnInputText } from './elements/nn-input-text.js'
import { NnInputButton } from './elements/nn-input-button.js'
import { NnButton } from './elements/nn-button.js'
import { NnForm } from './elements/nn-form.js'
import { NnInputCheckBox } from './elements/nn-input-checkbox.js'
import { NnInputColor } from './elements/nn-input-color.js'
import { NnInputDatalist } from './elements/nn-input-datalist.js'
import { NnInputDate } from './elements/nn-input-date.js'
import { NnInputDateTimeLocal } from './elements/nn-input-date-time-local.js'
import { NnInputEmail } from './elements/nn-input-email.js'
import { NnInputFile } from './elements/nn-input-file.js'
import { NnInputMonth } from './elements/nn-input-month.js'
import { NnInputNumber } from './elements/nn-input-number.js'
import { NnInputPassword } from './elements/nn-input-password.js'
import { NnInputRadio } from './elements/nn-input-radio.js'
import { NnInputRange } from './elements/nn-input-range.js'
import { NnInputSearch } from './elements/nn-input-search.js'
import { NnInputSubmit } from './elements/nn-input-submit.js'
import { NnInputTel } from './elements/nn-input-tel.js'
import { NnInputTime } from './elements/nn-input-time.js'
import { NnInputUrl } from './elements/nn-input-url.js'
import { NnInputWeek } from './elements/nn-input-week.js'
import { NnMeter } from './elements/nn-meter.js'
import { NnProgress } from './elements/nn-progress.js'
import { NnSelect } from './elements/nn-select.js'
import { NnTextArea } from './elements/nn-textarea.js'
import { EeAutocomplete } from './elements/ee-autocomplete.js'
import { EeAutocompleteInputSpans } from './elements/ee-autocomplete-input-spans.js'

window.TP_THEME = {
  common: Common,

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
}

export const TP_THEME = window.TP_THEME
