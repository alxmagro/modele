import Modele from '../../src/modele'

class Users extends Modele.Resource {
  api () {
    return {
      baseURL: 'http://localhost:3000/users'
    }
  }

  member () {
    return User
  }
}

class User extends Modele.Member {
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

export default new Users()
