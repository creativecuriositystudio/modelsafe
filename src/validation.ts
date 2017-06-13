/** Contains the validation types. */
import { Model, ModelConstructor } from './model';

/**
 * Errors with the properties of a model. Each model property can have
 * an array of error messages.
 */
export type ModelErrors<T extends Model> = {
  [P in keyof T]?: string[];
};

/**
 * Errors common to a subset of a model's properties or the whole model.
 */
export interface CommonModelError {
  /** Properties for the entire model. */
  props?: string[];

  /** The common error message, either for the joint properties or for the entire model. */
  message: string;
}

/**
 * An error with a model's validations.
 * This has a mapped errors object
 * so that you access the errors by a specific model property.
 */
export class ValidationError<T extends Model> extends Error {
  /** The model constructor. */
  ctor: ModelConstructor<T>;

  /** The model errors. */
  errors?: ModelErrors<T>;

  /** The model errors that are common across the entire model or multiple properties. */
  commonErrors?: CommonModelError[];

  /**
   * Construct a validation error.
   *
   * @param ctor The model constructor this error is for.
   * @param message The error message.
   * @param errors The model errors with all of the validation errors on it.
   * @param commonErrors Any common errors for a subset of the properties or the whole model.
   */
  constructor(ctor: ModelConstructor<T>, message: string,
              errors?: ModelErrors<T>, commonErrors?: CommonModelError[]) {
    super(message);

    this.name = 'ValidationError';
    this.stack = new Error().stack;
    this.ctor = ctor;
    this.errors = errors;
    this.commonErrors = commonErrors;

    // Required in order for error instances to be able to use instanceof.
    // SEE: https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md
    (this as any).__proto__ = ValidationError.prototype;
  }
}

/** Options to be passed to a validation function. */
export interface ValidationOptions {
  /**
   * The error message template for the validation.
   *
   * This is a Lodash template string, so for formatting guides
   * the documentation for `_.template'. The following variables are available to the template:
   *
   * * `value`: The value that was validated
   * * `path`: The attribute path being validated
   * * `error`: The error that the specific validation returned
   *
   * If none of these values are relevant to the error message, then
   * a plain string can be used.
   *
   * @see https://lodash.com/docs/4.17.4#template
   */
  message?: string;
}

/**
 * A validation function that can be used to validate
 * an attribute's value, with some additional options.
 *
 * The function should reject if there was an error and resolve if successfully validated.
 */
export type ValidationFunction = (value: any, options?: ValidationOptions) => Promise<void>;

/** A validation to be run on a model attribute. */
export interface Validation {
  /** The function for validating the attribute. */
  cb: ValidationFunction;

  /** Any options to provided to the validation function. */
  options?: ValidationOptions;
}
