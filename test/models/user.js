import Modele from '../../src/modele'

export default class User extends Modele {
  api () {
    return {
      baseURL: 'http://localhost:3000/users'
    }
  }

  actions () {
    return {
      upvote: {
        config: { method: 'put', url: 'upvote' }
      }
    }
  }

  defaults () {
    return {
      ligthsaberColor: 'Blue'
    }
  }

  validation () {
    return {
      defaults: {
        name: { presence: true },
        surname: { presence: true },
        password: { presence: true }
      }
    }
  }

  // custom

  get fullName () {
    return this.name + ' ' + this.surname
  }

  salute (name) {
    return 'Hello'
  }
}
