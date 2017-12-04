/** Contains the association types. */
import { hasModelOptions } from './metadata';
import { Model, ModelConstructor } from './model';

/** A type of association between models. */
export enum AssociationType {
  HAS_ONE,
  HAS_MANY,
  BELONGS_TO,
  BELONGS_TO_MANY
}

// Promote association types to top level so they are usable as squell.HAS_ONE, like normal attr types.
export const HAS_ONE = AssociationType.HAS_ONE;
export const HAS_MANY = AssociationType.HAS_MANY;
export const BELONGS_TO = AssociationType.BELONGS_TO;
export const BELONGS_TO_MANY = AssociationType.BELONGS_TO_MANY;

/** The options that can be defined for an association. */
export interface AssociationOptions {
  /** The key of the association. */
  key?: string | symbol;

  /** The type of association. */
  type?: AssociationType;

  /** Whether the association is read-only. */
  readOnly?: boolean;

  /** The target model of the association. */
  target?: AssociationTarget<any>;

  /** The assoc on the target model that references this association. */
  targetAssoc?(model: ModelAssociations): AssociationOptions;
}

/** The assoations defined on a model. */
export interface ModelAssociations {
  [key: string]: AssociationOptions;
}

/**
 * A target for an association. This can either
 * be a specific model or a function that lazily
 * loads the target model.
 *
 * The lazy load method can be used when there is circular dependency
 * issues.
 */
export type AssociationTarget<T extends Model> = ModelConstructor<T> | (() => ModelConstructor<T>);

/**
 * Checks if the association target is a function that lazy loads
 * a model constructor. If it's just a regular model constructor,
 * it returns false.
 *
 * @param target The association target.
 * @returns True if the target is a lazy load lambda, false otherwise.
 */
export function isLazyLoad<T extends Model>(target: AssociationTarget<T>): boolean {
  // This might seem a bit strange but basically we fall to this as there doesn't
  // appear to be a nice way to check if something is a class vs. a function.
  // So we return true if there's model options, (i.e. it's a decorated model)
  // otherwise we just assume it's lazy loaded. We can do this because
  // even if it's some arbitrary value and not a lazy loader, the safe
  // will catch that because it requires a model decorator to be associated.
  return typeof (target) === 'function' && !hasModelOptions(target);
}
