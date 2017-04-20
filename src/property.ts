/** Contains the property type. */

/** A property of a model. This can be either an association or attribute. */
export abstract class Property<T> {
  /** The value of the property. This is currently unused. */
  value?: T;

  /**
   * Turns the property into its relevant property name.
   *
   * @returns The property name.
   */
  abstract toString(): string;
}
