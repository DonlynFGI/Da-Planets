import { ProxyState } from '../AppState.js'
import { valuesService } from '../Services/ValuesService.js'
import { logger } from '../Utils/Logger.js'

// Private
function _draw() {
  const values = ProxyState.values
  logger.log(values)
}

// Public
export class ValuesController {
  constructor() {
    ProxyState.on('values', _draw)
  }

  egg() {
  window.confirm('This is an easter-egg, good find! Heres the link: shorturl.at/jxF16')
  }

  addValue() {
    valuesService.addValue()
  }
}
