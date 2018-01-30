# Actions

## Routes

Routes are basically a common prefix for all action URLs. There are two basic types of routes, collection route, for actions that do not have a specific resource as a target, such as listing all users. And the member route, which acts on a specific resource, such as updating a user. Routes are defined in a Model’s `static routes()` method. Expected keys are **collection**, and **member**.

Before a request is sent, Model prefix route into `url`, and then interpolate, `url` and `baseURL`, with curly-brace parameters, where the parameters are the model's active attributes plus option `urlParams` value.

?> You can also use the virtual parameter **$id**, it represents the value of the identifier.

```javascript
class Task extends Modele.Model {
  static routes () {
    return {
      collection: '/tasks',
      member: '/tasks/{$id}'
    }
  }
}

Task.init()
```

By default, when a request is sent from the class, the url is prefixed with the **collection** route. On the other hand, when a request is sent from an **instance**, the url is prefixed with the member path.

```javascript
let task = new Task({ id: 1 })

Task.request({ url: '/search' })
// => Promise <GET /tasks/search>

task.request({ method: 'put', url: '/like' })
// => Promise <PUT /tasks/1/like>
```

You can change this behavior by passing the `on` option to the `request` method:

```
task.request({}, { on: 'collection' })
// => Promise <GET /tasks>
```

## Default actions

Calling the `request` method outside the Model is not indicated, instead create methods that use the `request` for a single purpose. By default, Models already comes with the CRUD methods, they are:


| On         | Name    | Options | Method | Description
| ---------- | ------- | ------- | ------ | ---
| Model      | fetch   | `query` | GET    | Fetch resources
| *Model*    | create  | `data`  | POST   | Create a resource
| instance   | fetch   | *-*     | GET    | Fetch a resource
| *instance* | create  | *-*     | POST   | Create a resource with instance data
| *instance* | update  | `data`  | PUT    | Update a resource with `data` or instance data
| *instance* | destroy | `data`  | DELETE | Delete a resource, send body `data` if it is supplied.

### Model.fetch

```javascript
let tasks = []

Task.fetch({ done: false })
  .then(res => {
    tasks = res.data
  })
  .catch(error => {
    // Handle the error
  })

// => Promise <GET /tasks?done=false>
```

### Model.create

```javascript
let task = { name: 'Fix some bugs' }   // Works with Task instances too

Task.create(task)
  .then(res => {
    // Do something
  })
  .catch(error => {
    // Handle the error
  })

// => Promise <POST /tasks>
```

### instance.fetch

```javascript
Task.stub(1)   // Create a empty task with identifier = 1
  .fetch()
  .then(res => {
    // Do something
  })
  .catch(error => {
    // Handle the error
  })

// => Promise <GET /tasks/1>
```

### instance.create

```javascript
let task = new Task({ name: 'Fix some bugs' })

task.create()
  .then(res => {
    // Do something
  })
  .catch(error => {
    // Handle the error
  })

// => Promise <POST /tasks>
```

### instance.update

```javascript
Task.stub(1)   // Create a empty task with identifier = 1
  .update({ name: 'Fix some bugs' })
  .then(res => {
    // Do something
  })
  .catch(error => {
    // Handle the error
  })

// => Promise <PUT /tasks/1>
```

### instance.destroy

```javascript
Task.stub(1)   // Create a empty task with identifier = 1
  .destroy()
  .then(res => {
    // Do something
  })
  .catch(error => {
    // Handle the error
  })

// => Promise <DELETE /tasks/1>
```

## Custom actions

Sometimes a Resource has some action going beyond CRUD, in this case, feel free to use `request` to create your custom actions:

```javascript
class Task extends Modele.Model {
  // ...

  like () {
    const config = {
      method: 'put',
      url: '/like'
    }

    // Do something before request...

    return this.request(config)
      .then(res => {
        // Handle response

        return res    // Don't forget return response
      })
      .catch(err => {
        // Handle error

        throw error   // Don't forget throw the error
      })
  }
}

Task.init()
```

Then just call it:

```javascript
task.like()
  .then(res => {
    // Do something
  })
  .catch(error => {
    // Handle the error
  })

// => Promise <PUT /task/1/like>
```

## Default request config

You may want some default settings for the axios in each request of a Model. A fairly common need is the baseURL. In this case, use the `static axios()` method to set the default configuration of the requests.

```javascript
class Task extends Modele.Model {
  static axios () {
    return {
      baseURL: 'http://myserver.com'
    }
  }

  statis routes () {
    return {
      collection: '/tasks',
      member: '/tasks/{$id}'
    }
  }
}

Task.init()
```

Considering the example above:

```javascript
task = Task.stub(1)

task.fetch()
// => Promise <GET http://myserver.com/tasks/1>
```