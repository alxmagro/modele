import Modele, { validates } from '../../src/modele'

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

  validations () {
    return {
      name:     validates.presence(),
      surname:  validates.presence(),
      password: validates.presence({ on: 'create' })
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