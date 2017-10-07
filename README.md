# Introduction

*Project in alpha, it isn't stable in any version before 1.0.0*

Modele is a client-side representation of a Model and Resource.
Use it as Models with API Restfull, client-side validators, default and computed properties, and methods. Example:

```js
import Modele from 'modele'

const UserModel = new Modele({
  name: 'User'
})

var user = UserModel.new({ name: 'Luke' })
```

This is a basic config to Model. You can add CRUD API simple adding:

```js
import Modele from 'modele'

const UserModel = new Modele({
  // ...
  api: {
    baseURL: 'https\\://jsonplaceholder.typicode.com/users'
  }
})

var user = UserModel.new({ name: 'Luke' })
```
*\* Note the escape (`\\`) before protocol colon. This is required, because colons are also considered variables in the baseURL.*

Now, Modele will create actions CRUD for the Model and its instances, use:

```js
//...
UserModel.all()
UserModel.create({ name: 'Luke Skywalker' })
UserModel.read(1)
UserModel.update(1, { name: 'Anakin Skywalker' })
UserModel.delete(1)
```

You can add validations in the following way:

```js
const UserModel = new Modele({
  // ...
  validates: {
    // onCreate: {}
    // onUpdate: {}
    onSave: {
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

*Every Model has two Validators, onCreate and OnUpdate, onSave will perform in both of them*

Validations are not called automatically by API, instead you should use:

```js
UserModel.creatable({ name: 'Yoda' })
UserModele.updatable({ name: 'Yoda' })

// You can use sugar method `valid`, If an instance has an ID, it will call `updatable`, otherwise, `creatable`, returning boolean and storing errors in `errors`

var user = UserModel({ name: 'Yoda' })

user.valid()
// => false

user.errors
// => { ... }
```

Validators will return an object with a code, and variables, and not a simple english message. You should use it to create your own errors messages, this will make easier build Internationalizations Views. You will find message examples in [/bin/i18n-examples.js](/alexandremagro/modele/blob/master/bin/i18n-example.js).

## And more...

This Readme and Documentarion is under construction :(

## Contribution

### Bug Reports & Feature Requests

Please use the [issue tracker](/alexandremagro/modele/issues) to report any bugs or file feature requests.

### Developing

If you are a Javascript ninja and you liked the project, your contributions will be welcome.
Use Mocha as the test engine and lint with VueJS code style.

### People

Thank you contributors who participated or helped in this project:

- [William Okano](https://github.com/williamokano)

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2017, Alexandre Magro