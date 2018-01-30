# Data access

When you instantiate a Model, a reference of the attributes is created, in this way the Model is able to evaluate if there were changes in the attributes, besides being able to discard all these changes.

## Active atributes

You can access the active state directly on the instance, or with the `get(attribute, fallback)` method. It’s safe to set the value of an existing attribute direcly, or you can use `set(attribute, value)`.

!> **Important:** You must use `set` if you’re setting an attribute that doesn’t exist on the model yet.

```javascript
let todo = new Todo({ name: 'Watch the Tatooine sunset' })
```

### Read

```javascript
task.name                       // 'Watch the Tatooine sunset'
task.get('name')                // 'Watch the Tatooine sunset'

task.get('author', 'Unknown')   // 'Unknown'
```

### Write

```javascript
task.name = 'Seek Yoda on Dagobah'

// Set an attribute that doesn't exist on the model.
task.set('author', 'Luke')
```


## Reference

You can access the saved state with the `saved(attribute, default)` method or directly on the instance using the `$` accessor. This is useful when you want to display a saved value while editing its active equivalent, for example when you want to show a task’s saved name in the list while editing the name (which is bound to the active state). If you don’t bind using `$` when rendering the list, the task’s name will change on-the-fly as you type.

!> Important: You should never write to the saved state directly.

```javascript
let task = new Task({ name: 'Become a Jedi Master' })

// Update the active state.
task.name = 'Travel to Cloud City'

task.$.name                       // 'Become a Jedi Master'
task.saved('name')                // 'Become a Jedi Master'

task.saved('author', 'Unknown')   // 'Unknown'
```

## Changed attributes

If you’d like to know which fields have changed since the last time the model was synced, use `changes` accessor. You can also use the `changed()` method, which also checks all attributes if no parameters are given.

```javascript
let task = new Task({ name: 'Become a Jedi Master', done: false })

task.name = 'Travel to Cloud City'

task.changes               // { name: true, done: false }
task.changed('name')       // true
task.changed('done')       // false
task.changed()             // true

```