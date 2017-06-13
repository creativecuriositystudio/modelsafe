/** Contains the attribute types. */
import * as _ from 'lodash';

import { Property } from './property';
import { ValidationFunction, ValidationOptions } from './validation';

/**
 * The internal type of an attribute.
 * These are mostly based off the Sequelize types,
 * as the main reason for designing the ModelSafe
 * library was for eventual integration with Sequelize.
 */
export enum InternalAttributeType {
  STRING,
  CHAR,
  TEXT,
  INTEGER,
  BIGINT,
  FLOAT,
  REAL,
  DOUBLE,
  DECIMAL,
  BOOLEAN,
  TIME,
  DATE,
  JSON,
  JSONB,
  BLOB,
  ENUM,
  ARRAY
}

/** The type of an attribute, with any options required. */
export interface AttributeType {
  /** The internal attribute type. */
  type: InternalAttributeType;

  /** Any validation function to perform checks on a instance's attribute value/type. */
  validate?: ValidationFunction;

  /** Any options for the attribute type. */
  options?: AttributeTypeOptions;
}

/** Options for the ENUM attribute type. */
export interface EnumAttributeTypeOptions {
  /** The values the enum attribute can have. */
  values: string[];
}

/** Options for the ARRAY attribute type. */
export interface ArrayAttributeTypeOptions {
  /* The attribute type this array will contain. */
  contained: AttributeType;
}

/**
 * The options for an attribute type.
 * This only required for a few of the trickier types, like enums and arrays.
 */
export type AttributeTypeOptions = EnumAttributeTypeOptions | ArrayAttributeTypeOptions;

/**
 * Build an attribute from an internal attribute type and options.
 *
 * @param type The internal attribute type.
 * @param validate An attribute type/value validation function if required.
 * @param options Any attribute type options if required.
 */
function buildAttributeType(type: InternalAttributeType,
                            validate?: ValidationFunction,
                            options?: AttributeTypeOptions): AttributeType {
  let attrType: AttributeType =  { type };

  if (validate) {
    attrType.validate = validate;
  }

  if (options) {
    attrType.options = options;
  }

  return attrType;
}

/** A string attribute type. */
export const STRING = buildAttributeType(InternalAttributeType.STRING);

/** A character attribute type. */
export const CHAR = buildAttributeType(InternalAttributeType.CHAR);

/**
 * A text attribute type. In most ModelSafe integrations,
 * this will translate to larger storage than a string.
 */
export const TEXT = buildAttributeType(InternalAttributeType.TEXT);

/** An integer attribute type. */
export const INTEGER = buildAttributeType(InternalAttributeType.INTEGER);

/**
 * A BigInt attribute type. In some integrations,
 * this is represented as a string property to prevent precision loss.
 */
export const BIGINT = buildAttributeType(InternalAttributeType.BIGINT);

/** A float attribute type. */
export const FLOAT = buildAttributeType(InternalAttributeType.FLOAT);

/** A real number attribute type. */
export const REAL = buildAttributeType(InternalAttributeType.REAL);

/** A double attribute type. */
export const DOUBLE = buildAttributeType(InternalAttributeType.DOUBLE);

/**
 * A decimal attribute type, with a specific precision and scale.
 */
export const DECIMAL = buildAttributeType(InternalAttributeType.DECIMAL);

/** A boolean attribute type. */
export const BOOLEAN = buildAttributeType(InternalAttributeType.BOOLEAN);

/** A timestamp attribute type. */
export const TIME = buildAttributeType(InternalAttributeType.TIME);

/** A date attribute type. */
export const DATE = buildAttributeType(InternalAttributeType.DATE);

/**
 * A JSON attribute type.
 * Please note that ModelSafe doesn't actually handle JSON attributes differently,
 * it's up to the relevant integrations to provide JSON functionaltiy as expected.
 */
export const JSON = buildAttributeType(InternalAttributeType.JSON);

/**
 * A JSONB attribute type. This is the same as JSON, but may contain
 * binary information.
 */
export const JSONB = buildAttributeType(InternalAttributeType.JSONB);

/**
 * A blob (binary) attribute type.
 */
export const BLOB = buildAttributeType(InternalAttributeType.BLOB);

/**
 * An enum attribute type, which is an attribute that can be one of
 * a number of possible string values.
 *
 * @param values The values to be available in the enum.
 * @returns The ENUM attribute type.
 */
export function ENUM(values: string[]): AttributeType {
  return buildAttributeType(InternalAttributeType.ENUM, async (value: any) => {
    if (value && values.indexOf(value) === -1) {
      throw new Error('Not a known enumeration value');
    }
  }, { values });
}

/**
 * An array attribute type, which is represented as an attribute
 * that can contain a number of other attributes.
 *
 * @param contained The attribute type the array will contain.
 * @returns The ARRAY attribute type.
 */
export function ARRAY(contained: AttributeType): AttributeType {
  return buildAttributeType(InternalAttributeType.ARRAY, async (value: any) => {
    if (!_.isArray(value)) {
      throw new Error('Not an array');
    }
  }, { contained });
}

/**
 * An attribute of a model.
 * This simply boils down to a name of the attribute with
 * no other data.
 *
 * @param T The contained model attribute type.
 */
export class Attribute<T> extends Property<T> {
  /** The attribute type. */
  private type: AttributeType;

  /** The attribute name. */
  private name: string;

  /**
   * Construct an attribute.
   *
   * @param type The attribute type.
   * @param name The attribute name.
   */
  constructor(type: AttributeType, name: string) {
    super();

    this.type = type;
    this.name = name;
  }

  /**
   * Turns the attribute into its relevant property name.
   *
   * @returns The property name.
   */
  public toString(): string {
    return this.name;
  }
}

/** The options that can be defined for an attribute. */
export interface AttributeOptions {
  /** The type of the attribute. */
  type?: AttributeType;

  /**
   * Whether the attribute should be optional.
   * Attributes are required by default.
   */
  optional?: boolean;

  /** Whether the attribute is a primary key. */
  primary?: boolean;

  /** Whether the attribute is unique. */
  unique?: boolean;

  /** Whether the attribute is read-only. */
  readOnly?: boolean;

  /**
   * The default value for the attribute.
   * This will be automatically set on a model
   * when it is constructed for the first time.
   */
  defaultValue?: any;

  /**
   * The error message template for when a value is marked as required but does not exist.
   * This is the same format as the `ValidationOptions` message.
   *
   * @see ValidationOptions
   */
  requiredMessage?: string;

  /**
   * The error message template for an attribute type's validation. This can be
   * used to change the message for the type validation.
   *
   * @see ValidationOptions
   */
  validationOptions?: ValidationOptions;
}

/** The attributes defined on a model. */
export interface ModelAttributes {
  [key: string]: AttributeOptions;
}
