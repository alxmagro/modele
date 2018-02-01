# Mutators

You can define functions for each attribute to pass through before they are set on the model, which makes things like type coercion or rounding very easy.

Mutators are defined by a model’s `mutations()` method, which should return an object mapping attribute names to their mutator functions. You can use an array to create a pipeline, where each function will receive the result of the previous. Mutator functions should accept `value` and return the mutated value.

?> **Note:** Attributes without values ignore mutations.

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

Task.init()
```

In section [Available options](options?id=available-options), you will find where these mutations are called.
