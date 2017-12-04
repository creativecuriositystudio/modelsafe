/* tslint:disable:ban-types */
/** Contains getters/setters for the model metadata. */
import 'reflect-metadata';
import * as _ from 'lodash';

import { AssociationType, AssociationTarget, AssociationOptions, ModelAssociations } from './association';
import { AttributeType, AttributeOptions, ModelAttributes } from './attribute';
import { Model, ModelOptions } from './model';
import { Validation, ValidationFunction,
         IS_EMAIL, IS_URL, IS_UUID, IS_JSON, IS_HEX,
         IS_ALPHA, IS_ALPHANUMERIC, IS_BASE64, IS_UPPERCASE,
         IS_LOWERCASE, IS_IP, MATCHES, GT, LT, GTE, LTE,
         LENGTH, MIN_LENGTH, MAX_LENGTH } from './validation';

/** The meta key for a model's options on a model class. */
export const MODEL_OPTIONS_META_KEY = 'modelsafe:options';

/** The meta key for a model attribute key list on a model class. */
export const MODEL_ATTRS_META_KEY = 'modelsafe:attrs';

/** The meta key for a model association key list on a model class. */
export const MODEL_ASSOCS_META_KEY = 'modelsafe:assocs';

/** The meta key for an attribute's validations, on a specific property. */
export const ATTR_VALIDATIONS_META_KEY = 'modelsafe:attrs:validations';

/**
 * Guess the name of a model. The name will be generated
 * from the constructor/class name and will be in camelCase.
 *
 * @param ctor The model constructor.
 * @returns A possible name for the model.
 */
export function guessModelName(ctor: Function): string {
  // We cast to any as we're compiling in es5 mode,
  // but we want to use the es6 Function.name feature if it's
  // there.
  let name = (ctor as any).name;

  if (!name) {
    // Polyfill this by stringifyng the function.
    // Ugly but it works
    let str = ctor.toString();

    str = str.substr('function '.length);
    str = str.substr(0, str.indexOf('('));

    name = str;
  }

  return _.camelCase(name);
}

/**
 * Checks whether a model constructor has been decorated with the @model
 * decorator. This can be used to check whether an object looks like a model,
 * although there is no guarantee it's a valid model yet (since technically
 * a model isn't valid unless it has a name defined).
 *
 * @param ctor The model constructor.
 * @returns Whether the model constructor is decorated.
 */
export function hasModelOptions(ctor: Function): boolean {
  try {
    return Reflect.hasMetadata(MODEL_OPTIONS_META_KEY, ctor.prototype);
  } catch (err) {
    return false;
  }
}

/**
 * Define options on a model constructor.
 *
 * @param ctor The model constructor.
 * @param options The model options.
 */
export function defineModelOptions(ctor: Function, options: ModelOptions) {
  // We extend the existing options so that other options defined on the prototype get inherited.
  options = {
    ... Reflect.getMetadata(MODEL_OPTIONS_META_KEY, ctor.prototype),
    ... options
  };

  Reflect.defineMetadata(MODEL_OPTIONS_META_KEY, options, ctor.prototype);
}

/**
 * Define an association on the model constructor.
 *
 * @param ctor The model constructor.
 * @param key The association's property key.
 * @param options The association options.
 */
export function defineAssociation(ctor: Object, key: string | symbol, options: AssociationOptions) {
  let assocs = _.merge({
    ... Reflect.getMetadata(MODEL_ASSOCS_META_KEY, ctor)
  }, { [key]: options });

  Reflect.defineMetadata(MODEL_ASSOCS_META_KEY, assocs, ctor);
}

/**
 * Define an attribute on the model constructor.
 *
 * @param ctor The model constructor.
 * @param key The attribute's property key.
 * @param options The attribute options.
 */
export function defineAttribute(ctor: Object, key: string | symbol, options: AttributeOptions) {
  let attrs = _.merge({
    ... Reflect.getMetadata(MODEL_ATTRS_META_KEY, ctor)
  }, { [key]: options });

  Reflect.defineMetadata(MODEL_ATTRS_META_KEY, attrs, ctor);
}

/**
 * Define a validation rule on an attribute of a model constructor.
 *
 * @param ctor The model constructor.
 * @param key The property key of the attribute this rule should apply to.
 * @param validation The validation to define.
 */
export function defineAttributeValidation(ctor: Object, key: string | symbol, validation: Validation) {
  let validations = (Reflect.getMetadata(ATTR_VALIDATIONS_META_KEY, ctor, key) || []).concat(validation);

  Reflect.defineMetadata(ATTR_VALIDATIONS_META_KEY, validations, ctor, key);
}

/**
 * Get the model options for a model constructor.
 *
 * @returns The model options.
 */
export function getModelOptions(ctor: Function): ModelOptions {
  return { ... Reflect.getMetadata(MODEL_OPTIONS_META_KEY, ctor.prototype) };
}

/**
 * Get the associations for a model constructor.
 *
 * @returns The model associations.
 */
export function getAssociations(ctor: Function): ModelAssociations {
  return { ... Reflect.getMetadata(MODEL_ASSOCS_META_KEY, ctor.prototype) };
}

/**
 * Get the attributes for a model constructor.
 *
 * @param ctor The model constructor.
 * @returns The model attributes.
 */
export function getAttributes(ctor: Function): ModelAttributes {
  return { ... Reflect.getMetadata(MODEL_ATTRS_META_KEY, ctor.prototype) };
}

/**
 * Get the validations for the attribute of a model.
 *
 * @param ctor The model constructor.
 * @param key The property key of the attribute this rule should apply to.
 * @returns The validations for the attribute.
 */
export function getAttributeValidations(ctor: Function, key: string | symbol): Validation[] {
  return Reflect.getMetadata(ATTR_VALIDATIONS_META_KEY, ctor.prototype, key) || [];
}

/**
 * A decorater for model classes.
 * This must be used on every model class in order for it to be interacted with.
 * By default the model name is generated from the class name, but this
 * can be overidden with the extra model options.
 *
 * @param option Any extra model options required.
 */
export function model(options?: ModelOptions) {
  // tslint:disable-next-line:ban-types
  return (ctor: Function): void => {
    defineModelOptions(ctor, { name: guessModelName(ctor), ... options });
  };
}

/**
 * A decorator for model attributes for specifying an attribute and its type.
 * This must be used on a model's property in order for the property to be recognised as an attribute.
 *
 * @param type    The type of the attribute.
 * @param options Any extra attribute options required.
 */
export function attr(type: AttributeType, options?: AttributeOptions) {
  return (target: object, key: string | symbol) => defineAttribute(target, key, {
    ... options,

    type
  });
}

/**
 * A decorator for a model association.
 * The association has a type and the model to associate to.
 * All association properties must be defined using this decorator in order
 * to be recognised by ModelSafe.
 *
 * Here the target is optional incase it is yet to be defined.
 * Once it has been defined, it can be correctly reassociated with
 * a target model using `Model.assocate`.
 *
 * @see `Model.associate`
 * @param type    The type of association.
 * @param target  The target model to associate to.
 * @param options Any extra Sequelize attribute options required.
 */
export function assoc<T extends Model>(type: AssociationType, target?: AssociationTarget<T>,
                                       options?: AssociationOptions) {
  return (ctor: object, key: string | symbol) => defineAssociation(ctor, key, {
    ... options,

    key,
    type,
    target
  });
}

/**
 * A decorator used on model attributes to define validation rules.
 * Any options provided will be passed to the validation function during validation.
 *
 * @param validation A validation function to run for an attribute.
 * @param options    Any extra validation options required.
 */
export function validate(validation: ValidationFunction, options?: any) {
  return (ctor: object, key: string | symbol) => defineAttributeValidation(ctor, key, {
    cb: validation,
    options
  });
}

/**
 * A decorator for model attributes that have a default value.
 *
 * @param value The default value for the property.
 */
export function defaultValue(value: any) {
  return (target: object, key: string | symbol) => defineAttribute(target, key, {
    defaultValue: value
  });
}

/**
 * A decorator for model attributes or associations that should be immutable/read-only.
 */
export function readOnly(target: object, key: string | symbol) {
  defineAttribute(target, key, {
    readOnly: true
  });
}

/**
 * A decorator for model attributes that are required/must be set.
 */
export function required(target: object, key: string | symbol) {
  defineAttribute(target, key, {
    optional: false
  });
}

/**
 * A decorator for model attributes that are optional/don't have to be set.
 */
export function optional(target: object, key: string | symbol) {
  defineAttribute(target, key, {
    optional: true
  });
}

/**
 * A decorator for model attributes that are a primary key.
 */
export function primary(target: object, key: string | symbol) {
  defineAttribute(target, key, {
    primary: true
  });
}

/**
 * A decorator for model attributes that are unique.
 */
export function unique(target: object, key: string | symbol) {
  defineAttribute(target, key, {
    unique: true
  });
}

/** A decorator for validating attributes are email addresses. */
export const email = validate(IS_EMAIL);

/** A decorator for validating attributes are URLs. */
export const url = validate(IS_URL);

/** A decorator for validating attributes are v3, v4 or v5 UUIDs. */
export const uuid = validate(IS_UUID);

/**
 * A decorator for validating attributes are sane JSON strings.
 * This does not validate JSON-like objects, only strings.
 */
export const json = validate(IS_JSON);

/** A decorator for validating attributes are hex strings. */
export const hex = validate(IS_HEX);

/** A decorator for validating attributes are alphabetic. */
export const alpha = validate(IS_ALPHA);

/** A decorator for validating attributes are alphanumeric. */
export const alphanumeric = validate(IS_ALPHANUMERIC);

/** A decorator for validating attributes are sane base64 strings. */
export const base64 = validate(IS_BASE64);

/** A decorator for validating attributes are uppercase strings. */
export const uppercase = validate(IS_UPPERCASE);

/** A decorator for validating attributes are lowercase strings. */
export const lowercase = validate(IS_LOWERCASE);

/** A decorator for validating attributes are sane IP addresses. */
export const ip = validate(IS_IP);

/** A decorator for validating attributes match a regex. */
export function matches(regex: RegExp) {
  return validate(MATCHES(regex));
}

/** A decorator for validating attributes are greater than a number. */
export function gt(other: number) {
  return validate(GT(other));
}

/** A decorator for validating attributes are less than a number. */
export function lt(other: number) {
  return validate(LT(other));
}

/** A decorator for validating attributes are greater than or equal to a number. */
export function gte(other: number) {
  return validate(GTE(other));
}

/** A decorator for validating attributes are less than or equal to a number. */
export function lte(other: number) {
  return validate(LTE(other));
}

/** A decorator for validating attributes are of a specific array or string length. */
export function length(len: number) {
  return validate(LENGTH(len));
}

/** A decorator for validating attributes are of a minimum array or string length. */
export function minLength(len: number) {
  return validate(MIN_LENGTH(len));
}

/** A decorator for validating attributes are of a maximum array or string length. */
export function maxLength(len: number) {
  return validate(MAX_LENGTH(len));
}
