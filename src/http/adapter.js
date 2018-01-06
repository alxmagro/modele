export default class Adapter {
  constructor (engine) {
    this.engine = this.default()
  }

  use (engine) {
    this.engine = engine
  }

  /**
   * TO OVERRIDE
   *
   * @param {Object} config - params of engine
   *
   * @returns {Promise} Promise of request.
   */
  send (config) {}
}
