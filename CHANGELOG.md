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
