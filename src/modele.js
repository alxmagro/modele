import axios from 'axios'
import Model from './core/model'
import Rule from './validation/rule'
import CRUDPlugin from './plugins/crud-plugin'

export default {
  Model,
  Rule,
  globals: {
    axios
  },
  plugins: {
    CRUD: CRUDPlugin
  }
}
