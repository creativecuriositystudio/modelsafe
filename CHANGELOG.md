# 1.0.0-alpha.1

* [CHANGE] Requires ES6 TypeScript
* [CHANGE] Removed `Model.associate` in favour of lazy-loaded association decoration
* [FEATURE] A `defaultValue` option for attributes that will be automatically set on new
  model instances unless you provide the `defaults` option in constructing the model as `false`
* [FEATURE] `ValidationError`s now have a `commonErrors` property, which is a list of
  errors that are either for a subset of the model's properties or the whole model
* [FEATURE] Added multiple decorators for more declarative definitions of models
  * `@defaultValue` for decorating the default value of an attribute
  * `@required` for decorating an association or attribute as required
  * `@optional` for decorating an association or attribute as optional
  * `@readOnly` for decorating an attribute as read-only
  * `@primary` for decorating an attribute as a primary key
  * `@unique` for decorating an attribute as unique

# 0.7.1

* Catch errors during `hasModelOptions` in-case a non-object is given to `reflect-metadata`

# 0.7.0

* Fix `isLazyLoad` to just check if the target has been decorated and assume lazy load otherwises
* Add `hasModelOptions` to check whether a class has been decorated as a model
* Have `Model.associate` take an `AssociationTarget`

# 0.6.0

* Add `readOnly` metadata for attributes and assocations

# 0.5.2

* Fix `ValidationError` being able to use instanceof calls (gets around TypeScript 2.1+ issue)

# 0.5.1

* Add `isLazyLoad` function for checking if association targets are lazily loaded

# 0.5.0

* Add option of instantiating model instance with initial data

# 0.4.0

* Add lazy-load support to association targets in the `@assoc` decorator

# 0.3.0

* Add primary attribute option
* Add unqiue attribute option
* Add validation error and mapped model errors type

# 0.2.0

* Change metadata keys to prevent nameclash
* Move to es5 target

# 0.1.1

* Fix missing .npmignore

# 0.1.0

* Initial release
