import Rule from '../core/rule'

export default class Past extends Rule {
  definitions () {
    return {
      name: 'past',
      test: (value) => value < new Date()
    }
  }
}
