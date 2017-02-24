/** Contains the model classes and decorators. */
import { Attribute } from './attribute';
import { defineModelOptions, guessModelName } from './metadata';
import { Property } from './property';

/**
 * The abstract model class.
 * This should be extended by all database models.
 * Models are designed to be database generic,
 * which means you could have multiple database connections
 * and the model could be defined and queried on them separately.
 */
export abstract class Model {}

/** A value that is both a model class value and something that can construct a model. */
export type ModelConstructor<T extends Model> = typeof Model & { new(): T };

/**
 * A mapped type that maps all of a model's
 * properties to the property class, which
 * can either be an association or attribute.
 */
export type ModelProperties<T extends Model> = {
  [P in keyof T]?: Property<T[P]>;
};

/** The options that can be defined for a model. */
export interface ModelOptions {
  /** The name of the model. */
  name?: string;
}

/**
 * A decorater for model classes.
 * This must be used on every model class in order for it to be interacted with.
 * By default the model name is generated from the class name, but this
 * can be overidden with the extra model options.
 *
 * @param option Any extra model options required.
 */
export function model(options?: any) {
  return (ctor: Function) => defineModelOptions(ctor, { name: guessModelName(ctor), ... options });
}
