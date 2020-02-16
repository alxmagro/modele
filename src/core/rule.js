export default class Rule {
  constructor ({ name, test, data }) {
    this.name = name
    this.test = test
    this.data = data
  }

  /**
   * Chain method that sets rule condition.
   *
   * @param {function} condition
   * @return {Object} this
   */
  if (condition) {
    this.condition = condition

    return this
  }
}
