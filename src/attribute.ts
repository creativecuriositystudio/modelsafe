/** Contains the attribute types. */
import * as _ from 'lodash';

import { ValidationFunction, PropertyValidationError } from './validation';

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
  REAL,
  BOOLEAN,
  TIME,
  DATE,
  OBJECT,
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

/**
 * A string attribute type.
 *
 * The type only validates that the value is a string.
 * The property type should be declared as `string`.
 */
export const STRING = buildAttributeType(InternalAttributeType.STRING, async (_path: string, value: any) => {
  if (!_.isString(value)) {
    throw new PropertyValidationError('attribute.string', 'Not a string');
  }
});

/**
 * A character attribute type.
 *
 * The type validates that there is only a single character in the string.
 * The property type should be declared as `string`.
 */
export const CHAR = buildAttributeType(InternalAttributeType.CHAR, async (_path: string, value: any) => {
  if (!_.isString(value) || value.length !== 1) {
    throw new PropertyValidationError('attribute.char', 'Not a character');
  }
});

/**
 * A text attribute type. In most ModelSafe integrations,
 * this will translate to larger storage than a string.
 *
 * The type only validates that the value is a string.
 * The property type should be declared as `string`.
 */
export const TEXT = buildAttributeType(InternalAttributeType.TEXT, async (_path: string, value: any) => {
  if (!_.isString(value)) {
    throw new PropertyValidationError('attribute.text', 'Not a string');
  }
});

/**
 * An integer attribute type.
 *
 * The property type should be declared as `number`.
 */
export const INTEGER = buildAttributeType(InternalAttributeType.INTEGER, async (_path: string, value: any) => {
  if (!_.isInteger(value)) {
    throw new PropertyValidationError('attribute.integer', 'Not an integer number');
  }
});

/**
 * A BigInt attribute type. In some integrations,
 * this is represented as a string property to prevent precision loss.
 *
 * The type is not validated.
 * The property type should be declared as `string` or similar.
 */
export const BIGINT = buildAttributeType(InternalAttributeType.BIGINT);

/**
 * A float attribute type.
 *
 * The type only validates that the value is a real number.
 * The property type should be declared as `number`.
 */
export const REAL = buildAttributeType(InternalAttributeType.REAL, async (_path: string, value: any) => {
  if (!_.isNumber(value)) {
    throw new PropertyValidationError('attribute.real', 'Not a real number');
  }
});

/**
 * A boolean attribute type.
 *
 * The property type should be declared as `boolean`.
 */
export const BOOLEAN = buildAttributeType(InternalAttributeType.BOOLEAN, async (_path: string, value: any) => {
  if (!_.isBoolean(value)) {
    throw new PropertyValidationError('attribute.boolean', 'Not a boolean');
  }
});

/**
 * A timestamp (with or without a date portion) attribute type.
 *
 * The property type should be declared as `Date`.
 */
export const TIME = buildAttributeType(InternalAttributeType.TIME, async (_path: string, value: any) => {
  if (!_.isDate(value)) {
    throw new PropertyValidationError('attribute.time', 'Not a time');
  }
});

/**
 * A date attribute type.
 *
 * The property type should be declared as `Date`.
 */
export const DATE = buildAttributeType(InternalAttributeType.DATE, async (_path: string, value: any) => {
  if (!_.isDate(value)) {
    throw new PropertyValidationError('attribute.date', 'Not a date');
  }
});

/**
 * A plain JavaScript object type.
 *
 * The property type should be declared as `object`.
 */
export const OBJECT = buildAttributeType(InternalAttributeType.OBJECT, async (_path: string, value: any) => {
  if (!_.isPlainObject(value)) {
    throw new PropertyValidationError('attribute.object', 'Not an object');
  }
});

/**
 * A blob (binary) attribute type.
 *
 * This type is not validated.
 * The property type should be declared as `ArrayBuffer` or similar.
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
  return buildAttributeType(InternalAttributeType.ENUM, async (_path: string, value: any) => {
    if (values.indexOf(value) === -1) {
      throw new PropertyValidationError('attribute.enum', 'Not a known enumeration value');
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
  return buildAttributeType(InternalAttributeType.ARRAY, async (_path: string, value: any) => {
    if (!_.isArray(value)) {
      throw new PropertyValidationError('attribute.array', 'Not an array');
    }
  }, { contained });
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
}

/** The attributes defined on a model. */
export interface ModelAttributes {
  [key: string]: AttributeOptions;
}
