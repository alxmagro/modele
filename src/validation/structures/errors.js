export default class Errors {
  constructor () {
    this.errors = {}
  }

  // verificators

  has (field) {
    return this.errors.hasOwnProperty(field)
  }

  any () {
    return Object.keys(this.errors).length > 0
  }

  // getters

  all () {
    return this.errors
  }

  get (field) {
    return this.errors[field]
  }

  // setters

  record (errors) {
    this.errors = errors || {}
  }

  set (prop, errors) {
    this.errors[prop] = errors
  }

  add (prop, error) {
    if (!this.errors[prop]) this.errors[prop] = []

    this.errors[prop].push(error)
  }

  // merge (errors) {
  //   for (const prop in errors.all()) {
  //     const list = errors.get(prop) || []

  //     list.forEach(error => this.add(prop, error))
  //   }
  // }

  // destroyers

  clear (field) {
    delete this.errors[field]
  }
}
