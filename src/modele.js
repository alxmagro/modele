import axios from 'axios'
import Model from './core/model'
import Rule from './validation/rule'

export default {
  Model,
  Rule,
  globals: {
    axios
  }
}
