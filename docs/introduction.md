# Introduction

Modele is a client-side representation of Resources and Models.
Use it to create a business layer in client-side, with an RESTful API, validations, and default properties of your server-side Models.

## Features

- RESTful and customizable API
- Mutations
- Validations
- Default attributes

## Motivational

I use this library in a project with Vuejs, to isolate the logic and HTTP requests in Models, instead of spreading `GET` and `POST` requests by components and stores.

Although using it in a Vue project, it does not depend on this. Feel free to try it on React.

## Installation

Using NPM:

```shell
npm i --save modele
```

## Basic Usage

Extend the base classes and customize your own. See the example bellow:

### Defining a Resource:

```javascript
import Modele from 'modele'

class User extends Modele.Model {
  // default config that axios will use in each request
  static axios () {
    return {
      baseURL: 'http://myserver.com'
    }
  }

  // set routes that will prefixed in each request URL
  static routes () {
    return {
      collection: '/users',
      member: '/users/{$id}'
    }
  }

  // Default attributes
  defaults () {
    return {
      id: null,
      password: '',
      name: '',
      surname: ''
    }
  }

  // Attribute mutations
  mutations () {
    return {
      id: (x) => Number(x) || null,
      password: String,
      name: String,
      surname: String
    }
  }

  // Attribute validation
  validation () {
    return {
      name: { presence: true },
      surname: { presence: true },
      password: { length: { min: 5 }, presence { on: 'create' } }
    }
  }
}

// Initializes the class, setting some important stuffs (*required)
User.init()
```

### Let's play

```javascript
let user = new User({ name: 'Luke', surname: 'Skywalker' })

user.create()
  .then(response => {
    console.log('User created successfully!')
  })
  .catch(error => {
    // handle error...
  })
```

## Ready for more?

We've briefly introduced the features, keep reading and find out.