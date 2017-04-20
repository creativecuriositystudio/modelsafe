/** Contains the model classes and decorators. */
import * as _ from 'lodash';

import { AssociationType, AssociationTarget } from './association';
import { defineModelOptions, defineAssociation, guessModelName,
         getProperties, getAssociations } from './metadata';
import { Property } from './property';

/**
 * The abstract model class.
 * This should be extended by all database models.
 * Models are designed to be database generic,
 * which means you could have multiple database connections
 * and the model could be defined and queried on them separately.
 */
export abstract class Model {
  /**
   * Construct a model instance, with optional initial data.
   *
   * @param data Any initial data for the instance.
   *             This isn't typed because we don't
   *             have knowledge of the child class here.
   */
  constructor(data?: {}) {
    _.extend(this, data);
  }

  /**
   * Associate a model with a target model under a specific property on the
   * source model. This is ideally used to solve circular dependencies
   * and situations where you need to associate to a model that is not yet
   * defined.
   *
   * Ideally the association should still be defined using the `@assoc` decorator,
   * but the target constructor shouldn't be provided and this function called
   * later instead. However, that is not necessarily required as you
   * can use this function to associate a model that to another without
   * first decorating the model property that the association lives under.
   *
   * @param ctor The source model constructor.
   * @param map A function that takes the source model's property and returns
   *            the model property the association is under and the target
   *            model for the association.
   * @param type An optional association type if you would like to manually
   *             define the type. Defining the type is recommended
   *             through `@assoc` instead of using this.
   */
  static associate<T extends Model, U extends Model>(
    ctor: ModelConstructor<T>,
    map: (props: ModelProperties<T>) => [Property<any>, AssociationTarget<U>],
    type?: AssociationType
  ) {
    let [prop, target] = map(getProperties<T>(ctor));
    let assocs = getAssociations(ctor);
    let key = prop.toString();
    let options = assocs[key];

    if (!type) {
      type = options.type;
    }

    defineAssociation(ctor.prototype, key, { ... options, target, type });
  }
}

/** A value that is both a model class value and something that can construct a model. */
export type ModelConstructor<T extends Model> = typeof Model & { new(): T };

/**
 * A mapped type that maps all of a model's
 * properties to the property class, which
 * can either be an association or attribute.
 */
export type ModelProperties<T extends Model> = {
  [P in keyof T]: Property<T[P]>;
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
export function model(options?: ModelOptions) {
  // tslint:disable-next-line:ban-types
  return (ctor: Function): void => {
    defineModelOptions(ctor, { name: guessModelName(ctor), ... options });
  };
}
