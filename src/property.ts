/** Contains the property type. */

/** A property of a model. This can be either an association or attribute. */
export abstract class Property<T> {
  /*
   * Turns the property into its relevant property name.
   *
   * @returns The property name.
   */
  abstract compile(): string;
}
