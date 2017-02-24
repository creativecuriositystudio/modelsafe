# ModelSafe

## Introduction

ModelSafe is a type-safe data modelling library that is used to describe model schemas
using TypeScript classes and decorators. These models are independent of any library
that actually queries them (whether from a REST API or a database), allowing
you to define the models in your application agnostically of the backend/frontend.

Attributes and associations are defined on model classes using decorators.
On top of this, ModelSafe also provides support for defining the validation rules on
model attributes using decorators and model data with these rules.

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

#### Attributes

A model attribute is a piece information on the model. This might be a person's name,
date of birth and so on. Properties on model classes that are attributes are
decorated with the `attr` decorator. Attributes can be of the following types:

*

Note that an important distinction must be made. An attribute type is separate
from how its property's type is declared in the TypeScript code. This is because
TypeScript is based off of JavaScript and is hence quite lax on what types exist
in the type system. There is no `float` or `int` in TypeScript, only `number`. The
ModelSafe attribute types are separated out to allow for closer definitions like enforcing
a number be a float or integer. The type declaration for the property
that the attribute is attached to is simply how the model will be serialized and hence
isn't constrained to be a more specific type.

In other words, if it's a float, it's declared as just any old number in the property type
and ModelSafe does the actual work off confirming its type matches that of a float internally.

The attribute types are based off of the ones available in Sequelize - and purely out of inspiration,
so there are no dependencies on Sequelize.

By default attributes defined on models are required. To make them optional, set
`optional` to `true` in the attribute options:

```typescript
@attr(modelsafe.STRING, { optional: true })
username?: string;
```

There are a number of additional options that can be provided to the `attr`
directive. Check out the API documentation for more information.

#### Associations

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
class ChatRoom extends modelsafe.Model {
  // Other properties first..

  @assoc(modelsafe.HAS_ONE, User)
  user: User;
}

class AvailabilityStatus extneds modelsafe.Model {
  // Other properties first..
  
  @assoc(modelsafe.BELONGS_TO, User)
  user: User;
}

class ChatMessage extneds modelsafe.Model {
  // Other properties first..
  
  @assoc(modelsafe.BELONGS_TO_MANY, User)
  users: User[];
}

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

There are a number of additional options that can be provided to the `assoc`
directive. Check out the API documentation for more information.

#### Validations

### Safe

Because models are agnostic of how they're actually going to be used (and could realistically
be used with as many integrations possible), declaring them
is not enough to interact with them. A model must first be defined on a `Safe`, which contains
all of the models for your application and can be used to interact with them.

```typescript
let safe = new Safe();

safe.define(User);
```

Libraries that use ModelSafe for describing models, e.g. a library that maps models to database schemas,
should extend the `Safe` class and use the models defined on the safe in whatever form is required
by the integration the library is trying to support.

### Validating

## Documentatation

The API documentation generated using [TypeDoc](https://github.com/TypeStrong/typedoc)
is [available online](http://creativecuriosity.github.io/modelsafe).

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

