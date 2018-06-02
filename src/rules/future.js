import Rule from '../core/rule'

export default class Future extends Rule {
  definitions () {
    return {
      name: 'future',
      test: (value) => value > new Date()
    }
  }
}
