# Validation

## Definition

A common need in the processing of data on the client side is validation. Provide a special model for your models: the built-in validation way.

Validations are defined by `validation()` method, which should return an object mapping attribute names to rule names and their configuration. See example bellow:

```javascript
class User extends Modele.Model {
  validation () {
    return {
      name: { presence: true },
      surname: { presence: true }
    }
  }
}

User.init()
```

As illustrated in the above example: the rule option can be a boolean if it has no options. If `false`, the rule is simply ignored.

Once set, validate the instance using the `validate()` method. It's accept and an Object parameter, that can contain **attribute** and **on** keys.

```javascript
user.validate()
// => false
```

To validate a single attribute, use:

```javascript
user.validate({ attribute: 'name' })
// => false
```

After validation, errors are written to the `errors` property. You can also use the `valid()` method, which verifies the validity of an attribute, or of the entire instance.

```javascript
user = new User({ name: 'Luke' })

user.validate()         // false
user.errors             // { surname: { ... } }

user.valid('name')      // true
user.valid('surname')   // false
user.valid()            // false
```

## Default rules


| Name         | Options                           | Error name         | Test
| ------------ | --------------------------------- | ------------------ | ---
| absence      |                                   | `"absence"`        | Attribute value does not [exists][is_existy] or is [empty][is_empty].
| acceptance   |                                   | `"acceptance"`     | Attribute value is [truthy][is_truthy].
| confirmation | `{ with: String }`                | `"confirmation"`   | Attribute value is equal to `with`.
| date         | `{ after: Date*, before: Date* }` | `"date_between"`   | Attribute value is a Date and is between `after` and `before`.
| *date*       | `{ after: Date* }`                | `"date_after"`     | Attribute value is greater than `after`.
| *date*       | `{ before: Date* }`               | `"date_before"`    | Attribute value is lower than `before`.
| exclusion    | `{ in: Array* }`                  | `"exclusion"`      | Attribute value is not included in `in`.
| format       | `{ with: Regex }`                 | `"format"`         | Attribute value is tested with Regex `with`.
| future       |                                   | `"future"`         | Attribute is [future][is_future].
| inclusion    | `{ in: Array* }`                  | `"inclusion"`      | Attribute value is included in `in`.
| length       | `{ is: Number }`                  | `"length"`         | Attribute length is equal to `is`.
| *length*     | `{ min: Number, max: Number }`    | `"length_between"` | Attribute length is between `min` and `max`.
| *length*     | `{ min: Number }`                 | `"length_min"`     | Attribute length is greater or equal to `min`.
| *length*     | `{ max: Number }`                 | `"length_max"`     | Attribute length is lower or equal to `max`.
| past         |                                   | `"past"`           | Attribute value is [past][is_past].
| presence     |                                   | `"presence"`       | Attribute value [exists][is_existy] and not [empty][is_empty].

?> **NOTE:** Types marked with asterisks accept functions that return this same type.

[is_existy]: http://is.js.org/#existy
[is_empty]: http://is.js.org/#empty
[is_future]: http://is.js.org/#future
[is_past]: http://is.js.org/#past
[is_truthy]: http://is.js.org/#truthy

## Validation scopes

You can define validations that will be validated only at a given time. For example, you have a User class, and in the registration form, the password attribute is required. However, once registered, the data update form does not require the password.

To do this, add the `on` option in the rule:

```javascript
class User extends Modele.Model {
  validation () {
    return {
      name: { presence: true },
      surname: { presence: true },
      password: { presence { on: 'create' } }
    }
  }
}

User.init()
```

To run the validations for a given scope, use the `on` option in the validate method:

```javascript
let user = new User({ name: 'Luke', surname: 'Skywalker' })

user.validate()                   // true
user.validate({ on: 'create' })   // false
```

## Error messages

Returned errors are a plain objects that contain error infos, istead pure String messages. This approach was taken not to bring to the Modele the responsibility of other JavaScript frameworks. In this case, you will need to create a function that receives these error objects and returns the appropriate message.

```javascript
let locales = {
  en: {
    presence: 'cant be blank'
    // ...
  }
}

let user = new Task()

user.validate()   // false
user.errors       // { name: [{ ... }] }

myOwnI18nInterpreter(locales, 'en', task.errors)   // { name: ['cant be blank'] }
```

The structure of error object is:

```javascript
{
  name: 'presence',      // Rule name
  validator: 'modele',   // Attribute that indicates origin of validation
  context: {
    ...options           // Options that were passed in the rule definition
    record: [Object]     // Object that has attributes of instance validated
    prop: 'name'         // Attribute that has been validated
    value: [undefined]   // Value of the attribute that was validated
  }
}
```

> *"The need for this functionality is still being studied, feel free to give your opinion."*.

## Custom rules

You can add new rules beyond the defaults, and that's pretty easy. Just create a new class that extends `Modele.Rule` and override the method `definitions()`. This method must return an object with the error name and a test function.

```javascript
class Numerically extends Modele.Rule {
  definitions (options) {
    // greater than definition
    if (options.gt) {
      return {
        name: 'numerically_gt',
        test: (value, record, property) => value > options.gt
      }
    }

    // lower than definition
    if (options.lt) {
      return {
        name: 'numerically_lt',
        test: (value, record, property) => value < options.lt
      }
    }

    throw new TypeError('Enter "gt" or "lt" option')
  }
}
```

After that, just add it to the `rulesetAddition` option in any model and use.

```javascript
class User extends Modele.Model {
  static options () {
    return {
      rulesetAddition: { numerically: Numerically }
    }
  }

  // ...

  validation () {
    return {
      age: {
        numerically: { gt: 18 }
      }
    }
  }
}

User.init()
```

!> By convention, return the rule name in the definition. In case of multiple definitions as in the example above, you can add a `_*` suffix to indicate the condition.