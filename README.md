<p align="center">
  <img src="logo.png"/>
</p>
<p align="center">
  <a href="https://travis-ci.org/alexandremagro/modele">
    <img src="https://travis-ci.org/alexandremagro/modele.svg?branch=master" alt="Build Status">
  </a>
  <a href="https://codecov.io/gh/alexandremagro/modele">
    <img src="https://codecov.io/gh/alexandremagro/modele/branch/master/graph/badge.svg" alt="codecov">
  </a>
  <a href="https://www.npmjs.com/package/modele">
    <img src="https://img.shields.io/npm/dt/modele.svg" alt="npm">
  </a>
  <a href="https://www.npmjs.com/package/modele">
    <img src="https://img.shields.io/npm/v/modele.svg" alt="npm">
  </a>
  <a href="https://bundlephobia.com/result?p=modele">
    <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/modele">
  </a>
  <a href="https://github.com/alexandremagro/modele/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/alexandremagro/modele.svg" alt="GitHub license">
  </a>
</p>

## Introduction

Modele helps you to build requests for REST API. Organize the requests into classes that represents your Back-end models.

This library takes care of this things, helping the developer to keep the communication-to-server logic, sorted by models, providing:

- Built-in **Rest API** methods like **get**, **create**, **update** and **delete**.
- **Mutation** of the data, before it is sent to the server.
- **Validation** of data on the client side, including some built-in rules.

## Examples

- [Vue, Vuex and Modele](https://codesandbox.io/s/example-api-with-vuex-and-modele-e8yl0) (Codesandbox).

## Documentation

- Guide: [Modele/wiki](https://github.com/alexandremagro/modele/wiki).
- Changelog: [Modele/releases](https://github.com/alexandremagro/modele/releases).

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

Setup **Rest API**, **validation** and **mutations**:

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
```

Usage:

```js
const user = new User({ name: 'Darth   ', surname: 'Vader' })
// => User { name: 'Darth   ', surname: 'Vader' }

user.$validate()
// => true

User.create(user, { api: 1 })
// => POST https://my-api.com/1/users { name: 'Darth', surname: 'Vader' }
```

Read the [Wiki](https://github.com/alexandremagro/modele/wiki) to learn more.

## Bug Reports & Feature Requests

Please use the [issue tracker](https://github.com/alexandremagro/modele/issues) to report any bugs or file feature requests.

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2017-present, Alexandre Magro
