## Overview

*Project in alpha, it isn't stable in any version before 1.0.0*

Modele is a client-side representation of a Model and Resource.
Use it as Models with API RESTful, client-side validators, default and computed properties, and methods.

## Features

- RESTful API
- Validations
- Default and Computed properties, and methods to Model and their instances.

## Examples

### API

```js
import Modele from 'modele'

const UserModel = new Modele({
  name: 'User',
  api: {
    baseURL: 'https\\://jsonplaceholder.typicode.com/users'
  }
})

```

Modele will create CRUD actions for the Model and their instances:

```js
//...
UserModel.all()
UserModel.create({ name: 'Luke Skywalker' })
UserModel.read(1)
UserModel.update(1, { name: 'Anakin Skywalker' })
UserModel.delete(1)
```

### Validations:

```js
const UserModel = new Modele({
  name: 'User',
  validates: {
    defaults: {
      name: {
        presence: true
      },
      username: {
        presence: true,
        length: { min: 3, max: 25 }
      }
    }
  }
})
```

Validations are not called automatically by API, instead you should use:

```js
UserModel.validate({ name: 'Yoda' })
// => Errors { ... }

var user = UserModel.new({ name: 'Yoda' })

user.valid()
// => false

user.errors
// => Errors { ... }
```

Validators will return an Errors Object, not a simple english message. You should use it to create your own errors messages, this will make easier to customize and build Internationalizations Views. You will find message examples in [i18n-examples.js](https://github.com/alexandremagro/modele/blob/master/bin/i18n-example.js).

## And more...

Visit the [Wiki](https://github.com/alexandremagro/modele/wiki) to learn more.

## Contribution

### Bug Reports & Feature Requests

Please use the [issue tracker](https://github.com/alexandremagro/modele/issues) to report any bugs or file feature requests.

### Developing

If you are a Javascript ninja and you liked the project, your contributions will be welcome.
Use Mocha as the test engine and lint with VueJS code style.

### People

Thank you contributors who participated or helped in this project:

- [William Okano](https://github.com/williamokano)

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2017, Alexandre Magro