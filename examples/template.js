import { Resource, Member } from 'modele'

class Users extends Resource {
  api () {
    return {
      baseURL: 'http://www.mydomain.com/api/:api_id/users'
    }
  }
}

class User extends Member {
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
        email: {
          presence: true,
          format: { with: /\S+@\S+\.\S+/ }
        },
        password: {
          length: { min: 8 }
        }
      },

      create: {
        email: {
          confirmation: { with: 'email_confirmation' }
        },
        password: {
          presence: true
        }
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

export default new Users()