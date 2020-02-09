import Model from 'core/model'
import { presence, confirmation } from 'validations'
import axios from 'axios'

export default class User extends Model {
  static setup () {
    return {
      baseURL: '/users[/:id]'
    }
  }

  static request (config) {
    return axios(config)
  }

  static mutations () {
    return {
      name: (value) => value && value.trim()
    }
  }

  static validation () {
    return {
      name: [
        presence()
      ],
      password: [
        // added on demand
      ],
      passwordConfirmation: [
        { ...confirmation('password'), if: (self) => self.password }
      ]
    }
  }
}
