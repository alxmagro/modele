import Modele from '../../src'

class Valuable extends Modele.Rule {
  definitions () {
    return {
      name: 'valuable',
      test: (value) => value
    }
  }
}

export default Valuable
