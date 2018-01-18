import _isFunction from 'lodash/isFunction'

import Validator from './structures/validator'
import Rule from './structures/rule'
import Errors from './structures/errors'

exports.Validator = Validator
exports.Rule = Rule
exports.Errors = Errors

// helpers

export function solved (value) {
  return _isFunction(value) ? value() : value
}
