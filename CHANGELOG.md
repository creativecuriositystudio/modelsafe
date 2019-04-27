# 2.0.3

* [UPDATE] Upgrade dependencies version to resolve vulnerabilities and use latest Typescript

* [FEATURE] Add `foreign` and `target` keys to `AttributeOptions`

# 2.0.2

* [FIX] relax ModelProperties typing in a better way 

# 2.0.1

* [FIX] relax ModelProperties typing slightly as typescript isn't quite there yet

# 2.0.0

* [UPDATE] update to modelsafe 2

# 1.0.0-alpha.13

* [FEATURE] add `targetAssoc` to associations

# 1.0.0-alpha.12

* [FEATURE] interpret de/serialisation depth of null as infinite depth

# 1.0.0-alpha.11

* [FIX] test defaultValue for undefined, not truthiness

# 1.0.0-alpha.10

* [FIX] reject invalid dates in date validator
* [FIX] deserialize ISO strings into Date objects

# 1.0.0-alpha.9

* [FEATURE] allow `defaultValue` to be lazily loaded
* [FEATURE] use `defaultValue` in place of a nil value in `validate`

# 1.0.0-alpha.8

* Revert to `es5` TypeScript target due to transpile model issues
* Upgrade to TypeScript 2.3

# 1.0.0-alpha.7

* [FIX] `isLazyLoad()` should only match functions, not any object that's not a model constructor

# 1.0.0-alpha.6

* [FIX] `ModelErrors` should have `PropertyError[]` per property, not a single `PropertyError`

# 1.0.0-alpha.5

* [FIX] If `required` is set to `false` when validating, then attribute type validations will be properly skipped

# 1.0.0-alpha.4

* [FIX] Make `associations` serialization options optional

# 1.0.0-alpha.3

* [FIX] Serialize/deserialize now no longer infinitely recursively serialize association values by default
* [FEATURE] Serialization/deserialization of associations can now be turned off, and you can provide a depth
  for serializing associations (defaults to 1 level)

# 1.0.0-alpha.2

* [FEATURE] Added `required` option with `ValidationOptions` to support skipping required attribute
  checks during validation

# 1.0.0-alpha.1

* [CHANGE] Uses the ES6 environment with `tsconfig.json`
* [CHANGE] Removed unused attribute types `DECIMAL`, `FLOAT`/`DOUBLE`/ (in favour of `REAL`), `JSONB`
* [CHANGE] Renamed `JSON` to `OBJECT`, is now for plain object types. JSON strings should use `STRING`
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
* [FEATURE] Added `validate` to model instances for performing validations
  of model instance data. This will run a few types of validations:
  * Validates that the each property on the model data matches a type expected for the decorated attribute type
  * Validates with any extra validations decorated through the `@validate` decorator
  * Validates that attributes that have `optional` set to `false` have values provided
* Introduced a series of built-in decoratable validations, specifically:
  * `@email`
  * `@url`
  * `@uuid`
  * `@json`
  * `@hex`
  * `@alpha`
  * `@alphanumeric`
  * `@base64`
  * `@uppercase`
  * `@lowercase`
  * `@ip`
  * `@matches`
  * `@gt`
  * `@gte`
  * `@lt`
  * `@lte`
  * `@length`
  * `@minLength`
  * `@maxLength`
* [FEATURE] Add serialization and de-serialization from JSON. De-serialization performs
  validations by default but this can be disabled through an option.
  This can be used for sending or receiving the data of ModelSafe model instances.

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
