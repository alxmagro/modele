# Modele

[![Build Status](https://travis-ci.org/alexandremagro/modele.svg?branch=master)](https://travis-ci.org/alexandremagro/modele)
[![codecov](https://codecov.io/gh/alexandremagro/modele/branch/master/graph/badge.svg)](https://codecov.io/gh/alexandremagro/modele)
[![npm](https://img.shields.io/npm/dt/modele.svg)](https://www.npmjs.com/package/modele)
[![npm](https://img.shields.io/npm/v/modele.svg)](https://www.npmjs.com/package/modele)
[![GitHub license](https://img.shields.io/github/license/alexandremagro/modele.svg)](https://github.com/alexandremagro/modele/blob/master/LICENSE)

## Introduction

Modele helps you to build requests for REST API. Organize the requests into classes that represents your Back-end models.

This library takes care of this things, helping the developer to keep the communication-to-server logic, sorted by models, providing:

- Built-in **Rest API** methods like **get**, **create**, **update** and **delete**
- **Mutation** of the data, before it is sent to the server.
- **Validation** of data on the client side, including some built-in rules

## Documentation

- Guide: https://github.com/alexandremagro/modele/wiki.
- Changelog: https://github.com/alexandremagro/modele/releases.

## Installation

Using NPM:

```shell
npm i --save modele
```

Using yarn:

```shell
yarn add modele
```

## Basic Usage

Full example with configured **Rest API**, **validation** and **mutations**:

```js
import axios from 'axios'
import { Modele } from 'modele'
import { presence } from 'modele/validations'

class User extends Modele {
  // 1. Setup resource baseURL
  static setup () {
    return {
      baseURL: 'https://my-api.com/:api/users[/:id]'
    }
  }

  // 2. Setup request engine
  static request (config) {
    return axios(config)
  }

  // 3. Setup mutator functions per property
  static mutations () {
    return {
      name: (value) => value && value.trim()
    }
  }

  // 4. Setup validation rules per property
  static validation () {
    return {
      name: [presence()],
      surname: [presence()]
    }
  }
}

const user = new User({ name: '   Luke   ', surname: 'Skywalker' })
// => User { name: '   Luke   ', surname: 'Skywalker' }

user.$validate()
// => true

User.post(user, { api: 1 })
// => POST https://my-api.com/1/users { name: 'Luke', surname: 'Skywalker' }
```

Read the [Wiki](https://github.com/alexandremagro/modele/wiki) to learn more.

## Bug Reports & Feature Requests

Please use the [issue tracker](https://github.com/alexandremagro/modele/issues) to report any bugs or file feature requests.

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2017, Alexandre Magro
