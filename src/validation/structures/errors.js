export default class Errors {
  constructor () {
    this.map = {}
  }

  // getters

  all () {
    return this.map
  }

  get (prop) {
    return this.map[prop]
  }

  // setters

  record (errors) {
    this.map = errors || {}
  }

  set (prop, errors) {
    this.map[prop] = errors
  }

  add (prop, error) {
    if (!this.map[prop]) this.set(prop, [])

    this.map[prop].push(error)
  }

  // verificators

  has (prop) {
    return this.get(prop) && this.get(prop).length > 0
  }

  any () {
    return Object.values(this.map).some(x => x.length > 0)
  }

  // destroyers

  clear (prop) {
    this.set(prop, [])
  }
}
