import Modele from 'modele'

const User = new Modele({
  name: 'User',
  api: {
    // JSON stryngify body and add content-type and accept headers
    // config: {
    //   json: false
    // },
    baseURL: 'www.mydomain.com/api/:api_id/users',
    actions: {
      // CRUD actions are default included:
      // 1. all (GET /)
      // 2. create (POST /)
      // 3. read (GET /:id)
      // 4. update (PUT /:id)
      // 5. destroy (DELETE /:id)
      // defaults: {
      //   all: false,
      //   create: false,
      //   read: false,
      //   update: false,
      //   delete: false
      // }
      custom: {

        // Ex.: (PUT www.mydomain.com/api/2/users/42/avatar)
        uploadAvatar: {
          // Use scope to specify if action is on collection or on member
          // Obs: actions on member include ID beetwen baseURL and path
          method: 'PUT',
          scope: 'member',
          path: 'avatar',
          body: true
          // You can include requests headers with:
          // headers: {
          //   'Content-Type': 'multipart/form-data'
          // }
          // and disable JSON.stringify only in action
          // config: {
          //   json: false
          // }
          //
        }
      }
    }
  },

  // User `assoctiations` to convert sub-objetc in anothers Modeles.
  // It can be an array or a single plain object
  // associations: {
  //   projects: ProjectModel
  // }

  // Define client-server validations
  // Check link bellow for more informations about default validates
  // And how create your owns validations
  validates: {
    defaults: {
      email: {
        format: { with: /\S+@\S+\.\S+/ }
      },
      password: {
        length: { min: 8 }
      }
    },

    create: {
      email: {
        confirmation: true
      },
      password: {
        presence: true
      }
    }
  },

  // static: {
  //   data: function () { ... },
  //   computed: {},
  //   methods: {},
  // },

  // Define default attributes:
  data: function () {
    return {
      createdAt: new Date()
    }
  },

  // Define computed attributes
  computed: {
    fullName: function (record) {
      if (this.name && this.surname) {
        return `#{this.name} #{this.surname}`
      }

      return '...'
    }
  },

  methods: {
    hallo: function (another) {
      console.log(`Hi ${another.name}! My name is ${this.name}.`)
    }
  }
})

export default User
