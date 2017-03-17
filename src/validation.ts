/** Contains the validation types. */
import { defineAttributeValidation } from './metadata';
import { Model, ModelConstructor } from './model';

/** A type of validation on a model. */
export enum Validation {
  IS,
  NOT,
  IS_EMAIL,
  IS_URL,
  IS_IP,
  IS_IPV4,
  IS_IPV6,
  IS_ALPHA,
  IS_ALPHANUMERIC,
  IS_NUMERIC,
  IS_INT,
  IS_FLOAT,
  IS_DECIMAL,
  IS_LOWERCASE,
  IS_UPPERCASE,
  NOT_EMPTY,
  EQUALS,
  CONTAINS,
  NOT_IN,
  IS_IN,
  NOT_CONTAINS,
  LEN,
  IS_UUID,
  IS_DATE,
  IS_AFTER,
  IS_BEFORE,
  MAX,
  MIN,
  IS_ARRAY,
  IS_CREDIT_CARD
}

// Promote the validation types.
export const IS = Validation.IS;
export const NOT = Validation.NOT;
export const IS_EMAIL = Validation.IS_EMAIL;
export const IS_URL = Validation.IS_URL;
export const IS_IP = Validation.IS_IP;
export const IS_IPV4 = Validation.IS_IPV4;
export const IS_IPV6 = Validation.IS_IPV6;
export const IS_ALPHA = Validation.IS_ALPHA;
export const IS_ALPHANUMERIC = Validation.IS_ALPHANUMERIC;
export const IS_NUMERIC = Validation.IS_NUMERIC;
export const IS_INT = Validation.IS_INT;
export const IS_FLOAT = Validation.IS_FLOAT;
export const IS_DECIMAL = Validation.IS_DECIMAL;
export const IS_LOWERCASE = Validation.IS_LOWERCASE;
export const IS_UPPERCASE = Validation.IS_UPPERCASE;
export const NOT_EMPTY = Validation.NOT_EMPTY;
export const EQUALS = Validation.EQUALS;
export const CONTAINS = Validation.CONTAINS;
export const NOT_IN = Validation.NOT_IN;
export const IS_IN = Validation.IS_IN;
export const NOT_CONTAINS = Validation.NOT_CONTAINS;
export const LEN = Validation.LEN;
export const IS_UUID = Validation.IS_UUID;
export const IS_DATE = Validation.IS_DATE;
export const IS_AFTER = Validation.IS_AFTER;
export const IS_BEFORE = Validation.IS_BEFORE;
export const MAX = Validation.MAX;
export const MIN = Validation.MIN;
export const IS_ARRAY = Validation.IS_ARRAY;
export const IS_CREDIT_CARD = Validation.IS_CREDIT_CARD;

/**
 * Errors with a model. Each model property can have
 * an array of error messages.
 */
export type ModelErrors<T extends Model> = {
  [P in keyof T]?: string[];
};

/**
 * An error with a model's validations.
 * This has a mapped errors object
 * so that you access the errors by a specific model property.
 */
export class ValidationError<T extends Model> extends Error {
  /** The model constructor. */
  ctor: ModelConstructor<T>;

  /** The model errors. */
  errors: ModelErrors<T>;

  /**
   * Construct a validation error.
   *
   * @param ctor The model constructor this error is for.
   * @param message The error message.
   * @param err The model errors with all of the validation errors on it.
   */
  constructor(ctor: ModelConstructor<T>, message: string, errors: ModelErrors<T>) {
    super(message);

    this.name = 'ValidationError';
    this.stack = new Error().stack;
    this.ctor = ctor;
    this.errors = errors;

    // Required in order for error instances to be able to use instanceof.
    // SEE: https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md
    (this as any).__proto__ = ValidationError.prototype;
  }
}

/**
 * A custom validation function that can be used to validate
 * an attribute's value.
 */
export interface ValidationFunction {
  /** Validate a value for an attribute. */
  (value: any): boolean;
}

/** The options for a validation rule. */
export interface ValidationOptions {
  /** The validation to apply. */
  validation?: Validation | ValidationFunction;
}

/**
 * A decorator used on model attributes to define validation rules.
 * A message and arguments can be provided which will be passed to the equivalent
 * Sequelize validator. For more detail on the arguments that can be provided,
 * check the Sequelize validation definition docs.
 *
 * @param validation A validation type or a custom validation function.
 * @param options Any extra validation options required.
 */
export function validate(validation: Validation | ValidationFunction, options?: any) {
  return (ctor: Object, key: string | symbol) => defineAttributeValidation(ctor, key, { ... options, validation });
}
