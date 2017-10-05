export default class Errors {
  constructor () {
    this.errors = {}
  }

  has (field) {
    return this.errors.hasOwnProperty(field)
  }

  any () {
    return Object.keys(this.errors).length > 0
  }

  all (field) {
    return this.errors[field]
  }

  pick (field) {
    if (this.errors[field]) {
      return this.errors[field][0]
    }
  }

  record (errors) {
    this.errors = errors || {}
  }

  add (prop, error) {
    if (!this.errors[prop]) this.errors[prop] = []

    this.errors[prop].push(error)
  }

  clear (field) {
    delete this.errors[field]
  }
}
