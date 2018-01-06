import axios from 'axios'
import Base from '../http/adapter'

export default class AxiosAdapter extends Base {
  default () {
    return axios
  }

  send (config) {
    return this.engine(config)
  }
}
