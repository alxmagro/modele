/**
 * Class representing a validation error.
 */
export default class ValidationError extends Error {
  constructor (model) {
    super('The model contains validation errors.')
    this.name = 'ValidationError'
    this.model = model
  }
}
