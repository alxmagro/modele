# Initializing a Model

## The init

Models contain routines that need to be executed and static variables to be written. These routines are given once, **not** every time an instance is generated. For this to occur, the static method `init` must be called shortly after the Model declaration, see below:

```javascript
import Modele from 'modele'

class Task extends Modele.Model {
  defaults () {
    return {
      id: null,
      name: '',
      done: false
    }
  }
}

export default Task.init()
```

## Creating instances

Model instances can be created using the `new` keyword. The default constructor for a model accepts two optional parameters: `attributes`, and `options`.

```javascript
let model = new Model(attributes = {}, options = {})
```

You can also create an instance using the `stub` method. It creates an empty object with the assigned "primary key". You will see usefulness of this method in the next chapters.

```javascript
let model = Model.stub(identifier, options = {})
```

### Attributes parameter

Attributes will be merged with the default attributes as defined by the `defaults()` method. If no attributes are provided on construction, the model will represent an "empty" state.

?> **Important:** You should define a default value for every attribute.

```javascript
// Create a new task with initial attributes.
let task = new Task({ name: 'Become a Jedi' })

task.name   // 'Become a Jedi'
task.done   // false
```

### Options parameter

The `options` parameter allows you to set the options of a model instance. These can be any of the default options or something specific to your model. To get the value of an option, use `getOption(name)`. You can also set an option later on using `setOption(name, value)`.

The options will be presented in the next chapter.