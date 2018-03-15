/* tslint:disable:completed-docs */
import * as chai from 'chai';

import { InternalAttributeType, STRING, CHAR, TEXT,
         INTEGER, BIGINT, REAL, BOOLEAN, TIME,
         DATE, DATETIME, OBJECT, BLOB,
         ENUM, ARRAY, ArrayAttributeTypeOptions,
         EnumAttributeTypeOptions } from './attribute';

import { model, attr, getAttributes } from './metadata';
import { Model } from './model';

@model()
export class Entity extends Model {
  @attr(STRING)
  name: string;
}

describe('@attr', () => {
  it('should define correctly', () => {
    let attrs = getAttributes(Entity);

    chai.assert.deepEqual(attrs['name'], { type: STRING });
  });
});

describe('AttributeType', () => {
  const genericTests = {
    STRING: [InternalAttributeType.STRING, STRING],
    CHAR: [InternalAttributeType.CHAR, CHAR],
    TEXT: [InternalAttributeType.TEXT, TEXT],
    INTEGER: [InternalAttributeType.INTEGER, INTEGER],
    BIGINT: [InternalAttributeType.BIGINT, BIGINT],
    REAL: [InternalAttributeType.REAL, REAL],
    BOOLEAN: [InternalAttributeType.BOOLEAN, BOOLEAN],
    TIME: [InternalAttributeType.TIME, TIME],
    DATE: [InternalAttributeType.DATE, DATE],
    DATETIME: [InternalAttributeType.DATETIME, DATETIME],
    OBJECT: [InternalAttributeType.OBJECT, OBJECT],
    BLOB: [InternalAttributeType.BLOB, BLOB]
  };

  for (let key of Object.keys(genericTests)) {
    let [internalType, externalType] = genericTests[key];

    describe(`#${key}`, () => {
      it('should instantiate correctly', () => {
        chai.should().equal(externalType.type, internalType);
      });
    });
  }

  describe('#ENUM', () => {
    it('should instantiate correctly', () => {
      let type = ENUM(['a', 'b', 'c']);
      let options = type.options as EnumAttributeTypeOptions;

      type.type.should.equal(InternalAttributeType.ENUM);
      options.values.should.deep.equal(['a', 'b', 'c']);
    });
  });

  describe('#ARRAY', () => {
    it('should instantiate correctly', () => {
      let type = ARRAY(STRING);
      let options = type.options as ArrayAttributeTypeOptions;

      type.type.should.equal(InternalAttributeType.ARRAY);
      options.contained.should.equal(STRING);
    });

    it('should instantiate recursive correctly', () => {
      let type = ARRAY(ARRAY(STRING));
      let options = type.options as ArrayAttributeTypeOptions;
      let containedOptions = options.contained.options as ArrayAttributeTypeOptions;

      type.type.should.equal(InternalAttributeType.ARRAY);
      options.contained.type.should.equal(InternalAttributeType.ARRAY);
      containedOptions.contained.should.equal(STRING);
    });
  });
});
