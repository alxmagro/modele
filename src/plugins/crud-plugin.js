/**
 * Modele plugin that define fetch, create, update and delete actions
 *
 * @namespace
 */
export default {
  install (Model, options) {
    const globalCreate = function (data) {
      const config = {
        method: 'post',
        data: data
      }

      return this.request(config)
    }

    const globalFetch = function (data) {
      const config = {
        method: 'get',
        query: data
      }

      return this.request(config)
    }

    const instanceCreate = function (data) {
      if (options.mutateOnSave) {
        this.mutate()
      }

      const config = {
        method: 'post',
        data: this.toJSON()
      }

      return this.request(config, { on: 'collection' })

        .then(response => {
          if (response) {
            this.assign(response)
          }

          return response
        })
    }

    const instanceFetch = function () {
      const config = {
        method: 'get'
      }

      return this.request(config)

        .then(response => {
          if (response) {
            this.assign(response)
          }

          return response
        })
    }

    const instanceUpdate = function (data) {
      if (options.mutateOnSave) {
        this.mutate()
      }

      const config = {
        method: 'put',
        data: data || this.toJSON()
      }

      return this.request(config)

        .then(response => {
          if (response) {
            this.assign(response)
          }

          return response
        })
    }

    const instanceDelete = function () {
      const config = {
        method: 'delete'
      }

      return this.request(config)
    }

    const toConfig = function (value) {
      return {
        configurable: true,
        enumerable: false,
        writable: true,
        value
      }
    }

    // define Model actions
    Object.defineProperty(Model, 'fetch', toConfig(globalFetch))
    Object.defineProperty(Model, 'create', toConfig(globalCreate))

    // define Instance actions
    Object.defineProperty(Model.prototype, 'fetch', toConfig(instanceFetch))
    Object.defineProperty(Model.prototype, 'create', toConfig(instanceCreate))
    Object.defineProperty(Model.prototype, 'update', toConfig(instanceUpdate))
    Object.defineProperty(Model.prototype, 'delete', toConfig(instanceDelete))
  }
}
