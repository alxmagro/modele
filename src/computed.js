/*
  Object wrapper that represent a computed prop, extract setter and getter from arg
*/
export default class Computed {
  constructor (arg) {
    switch (typeof arg) {
      case 'object': {
        this.get = arg.get
        this.set = arg.set
        break
      }

      case 'function': {
        this.get = arg
        break
      }

      default: {
        throw new TypeError('Object|function was expected')
      }
    }
  }
}
