import Model from 'core/model'
import axios from 'axios'

export default class Post extends Model {
  static setup () {
    return {
      baseURL: '/users/:userId/posts[/:id]'
    }
  }

  static request (config) {
    return axios(config)
  }
}
