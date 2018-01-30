# Options

## Definition

You should define a model’s default options using the `static options()` method. Note that the options are assigned in the Class, and it is also able to access them using `getOption(name)` and change them using `setOption(name, value)`.

!> Static options are not assigned to each instance, instead, they act as fallback for them.

```javascript
class Task extends Modele.Model {
  static options () {
    return {
      points: 0
    }
  }
}

Task.init()

let task1 = new Task({}, { points: 1 })
let task2 = new Task()

task1.getOption('points')   // 1
task2.getOption('points')   // 0

Task.setOption('points', 10)

task1.getOption('points')   // 1
task2.getOption('points')   // 10
```

## Available options

| Option                    | Type    | Default         | Description
| ------------------------- | ------- | --------------- | -----------
| identifier                | String  | `id`            | The attribute that should be used to uniquely identify this model, usually a primary key like "id".
| mutateBeforeSave          | Boolean | `true`          | Whether this model should mutate all attributes before they are saved (`create` or `update` actions).
| mutateBeforeSync          | Boolean | `true`          | Whether this model should mutate all attributes before they are synced.
| mutateOnChange            | Boolean | `false`         | Whether this model should mutate a property as it is changed before it is set. This is a rare requirement because you usually don’t want to mutate something that you are busy editing.
| rulesetAddition           | Object  | `null`          | Add custom rules to Validator
| urlParamPattern           | Regex   | `/{([\S]+?)}/g` | Route parameter matching pattern.
| urlParams                 | Object  | `{}`            | Additional parameters to URLs.

## Identifier option

Models usually have an identifier attribute to uniquely identify them, like a primary key in the database.
The default identifier attribute is `"id"`, but you can override this with the `identifier` option.

```javascript
class Task extends Modele.Model {
  static options () {
    return {
      identifier: 'uid'
    }
  }
}

Task.init()
```