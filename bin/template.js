import Modele, { validates } from 'modele'

class User extends Modele {
  // config

  api () {
    return {
      baseURL: 'http://www.mydomain.com/api/:api_id/users'
    }
  }

  actions () {
    return {
      uploadAvatar: {
        config: { method: 'put', url: 'avatar' }
      }
    }
  }

  defaults () {
    return {
      createdAt: new Date()
    }
  }

  validations () {
    return {
      defaults: {
        email: validates.format(/\S+@\S+\.\S+/),
        password: validates.length({ min: 8 })
      },

      create: {
        email: validates.confirmation('emailConfirmation'),
        password: validates.presence()
      }
    }
  }

  // custom

  get fullName(record) {
    if (this.name && this.surname) {
      return `#{this.name} #{this.surname}`
    }

    return '...'
  }

  hallo (another) {
    console.log(`Hi ${another.name}! My name is ${this.name}.`)
  }
}

export default User