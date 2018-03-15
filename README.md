# ModelSafe

## Introduction

ModelSafe is a type-safe data modelling library for TypeScript 2.1+ that is used to describe model schemas
using classes and decorators. These models are independent of any library
that actually queries them (whether from a REST API or a database), allowing
you to define the models in your application agnostically of the backend/frontend.

Attributes and associations are defined on model classes using decorators to
describe the schema of a model. ModelSafe also provides support
for defining the validation rules on model attributes using decorators and then
validating the model data with these rules.

On its own, ModelSafe is not necessarily useful. It should be used with things
like Squell, which integrates ModelSafe data models with the Sequelize ORM.
The ModelSafe API is simple so building libraries that use its data models is easy.

## Installation

```sh
npm install --save modelsafe
```

## Usage

### Defining Models

Models are just classes with their properties decorated with the metadata
required to describe how the model should be represented.
Models have two types of properties: *attributes*, which are properties
that have a type and represent the values of a model, and *associations* which are properties
that describe an association (also known as a relationship) to another model.

#### Defining Attributes

A model attribute is a piece information on the model. This might be a person's name,
date of birth and so on. Properties on model classes that are attributes are
decorated with the `attr` decorator. Attributes can be of the following types:

* STRING, a short string
* CHAR, a single UTF8 character
* TEXT, a large string
* INTEGER, an integer-only number
* BIGINT, a string form of integer used for precision lossless numbers
* REAL, a real number (equivalent to any JavaScript number)
* BOOLEAN, a true/false (boolean) value
* TIME, a time (equivalent to the JavaScript `Date` object)
* DATE, a date only (equivalent to the JavaScript `Date` object)
* DATETIME, a date and time (equivalent to the JavaScript `Date` object)
* OBJECT, a plain JS object
* BLOB, a blob of binary data (an `ArrayBuffer`)
* ENUM, an enumerable value that can be one of many string values
* ARRAY, an array of contained types

Definition of attributes looks like the following:

```typescript
@model()
class User extends modelsafe.Model {
  @attr(modelsafe.STRING)
  email: string;

  @attr(modelsafe.TEXT)
  bio: string;

  @attr(modelsafe.INTEGER)
  numLogins: number;
}
```

An attribute type is separate from how its property's type is declared in the TypeScript code. This is because
TypeScript is based off of JavaScript and is hence quite lax on what types exist
in the type system. There is no `float` or `int` in TypeScript, only `number`. The
ModelSafe attribute types are separated out to allow for closer definitions like enforcing
a number be a real or integer. The type declaration for the property
that the attribute is attached to is simply how the model will be serialized and hence
isn't constrained to be a more specific type.

In other words, if it's a real number, it's declared as just any old number in the property type
and ModelSafe does the actual work off confirming its type matches that of a real number internally.

By default attributes defined on models are required. To make them optional,use the `@optional` decorator:

```typescript
@attr(modelsafe.STRING)
@optional
username?: string;
```

There are a number of additional options and decorators available, such as:

* `@primary` for marking a model as primary key
* `@unique` for marking an attribute as unique (not validated, for use as metadata by other libraries)
* `@defaultValue` for giving an attribute a default value

Check out the API documentation for more information.

#### Defining Associations

A model association is a field representing a relationship between a model and another model.
If a model can be associated to multiple of another model, this property will usually be declared
as an array of the other model, otherwise it will usually be declared as a single value of the other model.
ModelSafe supports the following associations (which are generally the standard):

* Belongs-to (1:1)
* Has-one (1:1)
* Has-many (1:m)
* Belongs-to-many (n:m)

Definition of the four different associations looks like the following:

```typescript
@model()
class ChatRoom extends modelsafe.Model {
  // Other properties first..

  @assoc(modelsafe.HAS_ONE, User)
  user: User;
}

@model()
class AvailabilityStatus extneds modelsafe.Model {
  // Other properties first..
  
  @assoc(modelsafe.BELONGS_TO, User)
  user: User;
}

@model()
class ChatMessage extneds modelsafe.Model {
  // Other properties first..
  
  @assoc(modelsafe.BELONGS_TO_MANY, User)
  users: User[];
}

@model()
class User extends modelsafe.Model {
  // Other properties first..

  @assoc(modelsafe.BELONGS_TO, ChatRoom)
  room: ChatRoom;

  @assoc(modelsafe.HAS_ONE, AvailabilityStatus)
  status: AvailabilityStatus;

  @assoc(modelsafe.BELONGS_TO_MANY, ChatMessage)
  messages: ChatMessage[];
}
```

There are a number of additional options that can be provided to the `@assoc`
decorator. Check out the API documentation for more information.

#### Defining Validations

ModelSafe supports decorating attributes with validations to be run. To see
how to actually run validations on model data, see the next section.

ModelSafe provides the following decorators for marking an attribute
with a validation:

* `@email`, for checking if a value is a valid email address
* `@url`, for checking if a value is a valid URL
* `@uuid`, for checking if a value is a valid v3, v4 or v5 UUID
* `@json`, for checking if a value is valid JSON
* `@hex`, for checking if a value is a hexadecimal string
* `@alpha`, for checking if a value is alphabetical only
* `@alphanumeric`, for checking if a value is alphanumeric characters only
* `@base64`, for checking if a value is valid base64
* `@uppercase`, for checking if a value is all upper-case
* `@lowercase`, for checking if a value is all lower-case
* `@ip`, for checking if a value is an IP address
* `@matches`, for checking if a value matches a regular expression
* `@gt`, for checking if a value is greater than another value
* `@gte`, for checking if a value is greater than or equal to another value
* `@lt`, for checking if a value is less than another value
* `@lte`, for checking if a value is less than or equal to another value
* `@length`, for checking if an array or string is of an exact length
* `@minLength`, for checking if an array or string is of a minimum length
* `@maxLength`, for checking if an array or string is of a max length

There is also a `@validate` decorator. This allows you to provide your own custom
validation functions (which are promise based, so they can be asynchronous).

### Validating

ModelSafe supports running an asynchronous validate of a model instance using
each model's `validate` method. This will validate a model and resolve
successfully if the model is valid, otherwise rejected with a `ValidationError`.

### Serialization

A way to serialize and deserialize models from JSON is provided. This is pretty
powerful because ModelSafe knows the exact attribute values that should appear
on the model and can clean away unused ones, and associations will have
their serialization/deserialization functions recursively called (e.g.
if a user has a belongs to project, then it will serialize that project's
value using the project's association function).

To serialize a model instance to JSON, call the `serialize` method on the instance or model class,
e.g. `User.serialize(instance)`. This will resolve with a promise that serializes
to a plain JS object if successful, otherwise rejected.

To deserialzie a model instance from JSON, call the `deserialize` method on the model class,
e.g. `User.deserialize(data)`. This will resolve with a promise that deserializes to a model instance
if successful, otherwise rejected. This will run validations by default to ensure data integrity -
to disable that behaviour, just turn the `validate` option off when calling deserialize.

## Documentatation

The API documentation generated using [TypeDoc](https://github.com/TypeStrong/typedoc)
is [available online](http://creativecuriositystudio.github.io/modelsafe).

To generate API documentation from the code into the `docs` directory, run:

```sh
npm run docs
```

## Testing

To execute the test suite run:

```sh
npm run test
```

## License

This project is licensed under the MIT license. Please see `LICENSE.md` for more details.

