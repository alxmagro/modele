import _isEqual from 'lodash/isEqual'

export default class Map {
  constructor (empty) {
    this.empty = empty
    this.hash = {}
  }

  // getters

  all () {
    return this.hash
  }

  get (prop) {
    return this.hash[prop]
  }

  // setters

  record (hash = {}) {
    this.hash = hash
  }

  set (prop, value) {
    this.hash[prop] = value
  }

  // verificators

  has (prop) {
    return this.hash[prop] && !_isEqual(this.hash[prop], this.empty)
  }

  any () {
    for (const prop in this.hash) {
      if (this.has(prop)) return true
    }

    return false
  }

  // destroyers

  clear (prop) {
    if (prop) {
      return this.set(prop, this.empty)
    }

    Object.keys(this.hash).forEach(key => this.clear(key))
  }
}
