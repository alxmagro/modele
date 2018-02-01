# API

## Global API

`Modele.globals` is object that containing global settings. Use `static getGlobal`and `getGlobal` methods to acess globals. Use wisely.

### axios

Axios object used in model requests. Can use this to define axios [Interceptors](https://github.com/axios/axios#interceptors).

#### Example

```javascript
// Add a request interceptor
Modele.globals.axios.interceptors.request.use(/* ... */)

// Add a response interceptor
Modele.globals.axios.interceptors.response.use(/* ... */)
```

## Interfaces

Interface is an internal concept for methods that are meant to be overwritten. These methods have already been presented throughout this documentation, so for more details, go to the sections indicated in **See also** keyword.

### **static** axios

  - **Returns:** an Object.
  - **See also:** Actions/[Default Request Config](actions?id=default-request-config)

Every time you make a request, this method is call to set the defaults request configuration. See axios [Request Config](https://github.com/axios/axios#request-config), to know the accepted keys.

#### Example

```javascript
class Task extends Modele.Model {
  static axios () {
    return {
      baseURL: 'http://www.myserver.com/api'
    }
  }
}
```

### **static** options

  - **Returns:** an Object.
  - **See also:**
    - [Options](options)
    - [Available options](options?id=available-options)

This method is called on `init`, to set model options. Class and their instances can access them via `getOption`.

#### Example

```javascript
class Task extends Modele.Model {
  static options () {
    return {
      identifier: 'hashid'
    }
  }
}
```

### **static** routes

  - **Default:** `{ collection: null, member: '/{$id}' }`
  - **Returns:** an Object.
  - **See also:** Actions/[Routes](actions?id=routes)

Every time you make a class request, **collection** route is prepend to url. In the same way, every instance request prepend **member** route to url.

#### Example

```javascript
class Task extends Modele.Model {
  static routes () {
    return {
      collection: '/tasks',
      member: '/tasks/{$id}'
    }
  }
}
```

### defaults

  - **Returns:** an Object.
  - **See also:** Initializing a Model/[Default attributes](initializing?id=default-attributes)

Sets default attributes to model instance.

```javascript
class Task extends Modele.Model {
  defaults () {
    return {
      id: null,
      name: '',
      done: false
    }
  }
}
```

### mutations

  - **Returns:** an Object.
  - **See also:** [Mutators](mutators)

Define functions for each attribute to pass through before they are set on the model. In section [Available options](options?id=available-options), you will find where these mutations are called.

#### Example

```javascript
class Task extends Modele.Model {
  mutations () {
    return {
      id: (id) => Number(id) || null,
      name: [_.toString, _.trim],
      done: Boolean,
    }
  }
}
```

### validation

  - **Returns:** an Object.
  - **See also:** [Validation](validation)

Define rules for each attribute. Once defined, use `validate()` to trigger validations.

```javascript
class User extends Modele.Model {
  validation () {
    return {
      name: { presence: true },
      surname: { presence: true }
    }
  }
}
```

## Getters

Special properties of the model, which define its state.

### **static** pending

State that represents whether the class is waiting for the response of a request, or is idle. Use this to, for example, reveal a spinner, or disable a button.

### $

Returns the saved state, that is, the attributes without changes. The saved state is only defined in the synchronization, which is called in the instance construction, in the `create` and `update` actions, or in `clear` method.

!> Important: You should never write to the saved state directly.

#### Example

```javascript
let task = new Task({ name: 'Become a Jedi Master' })

// Update the active state.
task.name = 'Travel to Cloud City'

task.name     // 'Travel to Cloud City'
task.$.name   // 'Become a Jedi Master'
```

**See also:** Data Access/[Saved State](data-access?id=saved-state)

### changes

Returns an object that represents key-value pairs, where key is the name of the attribute and the value is a Boolean that indicates whether the attribute has changes or not.

```javascript
let task = new Task({ name: 'Become a Jedi Master', done: false })

task.name = 'Travel to Cloud City'

task.changes   // { name: true, done: false }
```

**See also:** Data Access/[Changed attributes](data-access?id=changed-attributes)

### errors

Returns an object that represents key-value pairs, where key is the name of the attribute and the value is an array of plain objects that represent an error.

**See also:** [Validation](validation)

### pending

State that represents whether an instance is waiting for the response of a request, or is idle. Use this to, for example, reveal a spinner, or disable a button.

## Methods

### **static** create

  - Can be overridden
  - **Arguments:**
    - `{Object} data`
  - **Returns:** a Promise

Send a `POST` request to collection route URL.

### **static** fetch

  - Can be overridden
  - **Arguments:**
    - `{Object} query`
  - **Returns:** a Promise

Send a `GET` request to collection route URL.

### **static** getGlobal

  - **Arguments:**
    - `{String} path`
    - `{String} fallback (optional)`
  - **Returns:** the global value.

Get a global value defined by `Modele.globals`.

### **static** getOption

  - **Arguments:**
    - `{String} path`
    - `{String} fallback (optional)`
  - **Returns:** the option value.

Get a model option defined by `static options`.

### **static** getRoute

  - **Arguments:**
    - `{String} path`
    - `{String} fallback (optional)`
  - **Returns:** the route value.

Get a model routes defined by `static routes`.

### **static** init

  - **Returns:** the class itself.

Function that be called after Class is defined. It sets to Class, the options, routes, ruleset, and checks if the class is trying to overwrite some reserved property.

#### Example

```javascript
class Foo extends Model { ... }

Foo.init()
```

### **static** request

  - **Arguments:**
    - `{Object} config`
    - `{Object} options = { on: 'collection' } (optional)`
  - **Returns:** a Promise.

Send a request using axios, the first argument refer to axios [request config](https://github.com/axios/axios#request-config), and use `options.on` to choose the route that will prefix the `url`.

### **static** setOption

  - **Arguments:**
    - `{String} path`
    - `{String} value`
  - **Returns:** the option.

Set a model option.

### **static** stub

  - **Arguments:**
    - `{*} key`
    - `{Object} options (optional)`
  - **Returns:** an instance.

Helper constructor that create an instance with given identifier.

### **static** use

  - **Arguments:**
    - `{Object} plugin`
    - `{Object} options (optional)`
  - **Returns:** the class itself.

Call the `plugin.install` function, passing this class, and **options** argument. Use this to
programatically define methods to Model.

### assign

  - **Arguments:**
    - `{Object} attributes`

Merge **attributes** and `defaults()`, sets active attributes and `sync` with saved attributes.

### changed

  - **Arguments:**
    - `{String} attribute (optional)`
  - **Returns:** a Boolean.

Checks for changes in a given attribute, or any of them.

### clear

Set `defaults()` to active and saved attributes, and reset errors, changes and states.

### create

  - Can be overridden
  - **Returns:** a Promise.

1. Before send request, mutate the instance attributes if `mutateOnSave` option is true.
2. Send a `POST` request to member route URL with this attributes as data.
3. Then, if response data is present, `assign` them, otherwise, `sync` active and saved attributes.

### destroy

  - Can be overridden
  - **Arguments:**
    - `{Object} data`
  - **Returns:** a Promise.

Send a `DELETE` request to member route URL.

### fetch

  - Can be overridden
  - **Arguments:**
    - `{Object} query`
  - **Returns:** a Promise.

Send a `GET` request to member route URL.

### get

  - **Arguments:**
    - `{String} attribute`
    - `{*} fallback (optional)`
  - **Returns:** any.

Returns an attribute's value or a fallback value.

### getGlobal

  - **Arguments:**
    - `{String} path`
    - `{String} fallback (optional)`
  - **Returns:** the global value.

Get a global value defined by `Modele.globals`.

### getOption

  - **Arguments:**
    - `{String} path`
    - `{String} fallback (optional)`
  - **Returns:** the option value.

Get a instance option defined by constructor, if not set, then fallback to `static getOption(path, fallback)`.

### getRoute

  - **Arguments:**
    - `{String} path`
    - `{String} fallback (optional)`
  - **Returns:** the route value.

Get a model routes defined by `static routes`.

### has

  - **Arguments:**
    - `{String} attribute`
  - **Returns:** the route value.

Checks if the instance has an attribute.

### identifier

  - **Returns:** the idenfier.

Returns the model's identifier value.

### mutate

  - **Arguments:**
    - `{String} attribute (optional)`

Mutates either specific attributes or all attributes if none supplied.

### mutated

  - **Arguments:**
    - `{String} attribute`
    - `{*} value (optional)`

Return the value of mutated attribute, or all attributes if none is supplied, without changed the active attributes. If `value` is supplied, calc mutation in this value instead.

### request

  - **Arguments:**
    - `{Object} config`
    - `{Object} options = { on: 'member' } (optional)`
  - **Returns:** a Promise.

Send a request using axios, the first argument refer to axios [request config](https://github.com/axios/axios#request-config), and use `options.on` to choose the route that will prefix the `url`.

### reset

Undo changes, that is, sets the value of saved attributes in active attributes.

### saved

  - **Arguments:**
    - `{String} attribute`
    - `{*} fallback (optional)`
  - **Returns:** any.

Returns an salved attribute's value or a fallback value

### set

  - **Arguments:**
    - `{String|Object} attribute or attributes`
    - `{*} value`
  - **Returns:** any.

Sets the value of an attribute. If it is not defined, register and create setter and getter. Accept mass assign, performing it recursively.

#### Example

```javascript
model.set('name', 'Luke')
model.set({ name: 'Luke', surname: 'Sywalker' })
```

### setOption

  - **Arguments:**
    - `{String} path`
    - `{String} value`
  - **Returns:** the option.

Set an instance option.

### sync

Mutate attributes it `mutateBeforeSync` is true, then save value of attributes in reference (saved attributes).

### toJSON

  - **Returns:** the option.

Returns a native representation of this model.

### update

  - Can be overridden
  - **Returns:** a Promise.

1. Before send request, mutate the instance attributes if `mutateOnSave` option is true.
2. Send a `PUT` request to member route URL with this attributes as data.
3. Then, if response data is present, `assign` them, otherwise, `sync` active and saved attributes.

### valid

  - **Arguments:**
    - `{String} attribute`
  - **Returns:** a Boolean.

Checks whether there are no errors in a given attribute, or none of them.

### validate

  - **Arguments:**
    - `{Object} options (optional)`
    - `{String} options.on` Rule scope
    - `{String} options.attribute` Validate only given attribute.
  - **Returns:** a Boolean.

Perform validations rules, then call `valid` and return.