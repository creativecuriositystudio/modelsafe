/** Contains getters/setters for the model metadata. */
import 'reflect-metadata';
import * as _ from 'lodash';

import { Association, AssociationOptions, ModelAssociations } from './association';
import { Attribute, AttributeOptions, ModelAttributes } from './attribute';
import { Model, ModelOptions, ModelProperties } from './model';
import { Validation, ValidationFunction, ValidationOptions } from './validation';

/** The meta key for a model's options on a model class. */
export const MODEL_OPTIONS_META_KEY = 'modelOptions';

/** The meta key for a model attribute key list on a model class. */
export const MODEL_ATTRS_META_KEY = 'modelAttrs';

/** The meta key for a model association key list on a model class. */
export const MODEL_ASSOCS_META_KEY = 'modelAssocs';

/** The meta key for an attribute's validations, on a specific property. */
export const ATTR_VALIDATIONS_META_KEY = 'attrValidations';

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
  // there. If it's not there.
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
 * Define options on a model constructor.
 *
 * @param ctor The model constructor.
 * @param options The model options.
 */
export function defineModelOptions(ctor: Function, options: ModelOptions) {
  // We extend the existing options so that other options defined on the prototype get inherited.
  options = {
    ... Reflect.getMetadata(MODEL_OPTIONS_META_KEY, ctor),

    ... options
  };

  Reflect.defineMetadata(MODEL_OPTIONS_META_KEY, options, ctor);
}

/**
 * Define an association on the model constructor.
 *
 * @param ctor The model constructor.
 * @param key The association's property key.
 * @param options The association options.
 */
export function defineAssociation(ctor: Object, key: string | symbol, options: AssociationOptions) {
  let assocs = { ... Reflect.getMetadata(MODEL_ASSOCS_META_KEY, ctor) };

  assocs[key] = options;

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
  let attrs = { ... Reflect.getMetadata(MODEL_ATTRS_META_KEY, ctor) };

  attrs[key] = options;

  Reflect.defineMetadata(MODEL_ATTRS_META_KEY, attrs, ctor);
}

/**
 * Define a validation rule on an attribute of a model constructor.
 *
 * @param ctor The model constructor.
 * @param key The property key of the attribute this rule should apply to.
 * @param options The validation options.
 */
export function defineAttributeValidation(ctor: Object, key: string | symbol, options: ValidationOptions) {
  let validations = _.concat(Reflect.getMetadata(ATTR_VALIDATIONS_META_KEY, ctor, key), [options]);

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

export function getProperties<T extends Model>(ctor: Function): ModelProperties<T> {
  let props = {};
  let attrs = getAttributes(ctor);
  let assocs = getAssociations(ctor);

  for (let key of Object.keys(attrs)) {
    let options = attrs[key];

    props[key] = new Attribute(options.type, key);
  }

  for (let key of Object.keys(assocs)) {
    let options = assocs[key];

    props[key] = new Association(options.type, key);
  }

  return props as ModelProperties<T>;
}
