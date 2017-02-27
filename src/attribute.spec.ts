import 'should';

import { InternalAttributeType, STRING, CHAR, TEXT,
         INTEGER, BIGINT, FLOAT, REAL,
         DOUBLE, DECIMAL, BOOLEAN, TIME,
         DATE, JSON, JSONB, BLOB,
         ENUM, ARRAY } from './attribute';

describe('AttributeType', () => {
  const genericTests = {
    STRING: [InternalAttributeType.STRING, STRING],
    CHAR: [InternalAttributeType.CHAR, CHAR],
    TEXT: [InternalAttributeType.TEXT, TEXT],
    INTEGER: [InternalAttributeType.INTEGER, INTEGER],
    BIGINT: [InternalAttributeType.BIGINT, BIGINT],
    FLOAT: [InternalAttributeType.FLOAT, FLOAT],
    REAL: [InternalAttributeType.REAL, REAL],
    DOUBLE: [InternalAttributeType.DOUBLE, DOUBLE],
    DECIMAL: [InternalAttributeType.DECIMAL, DECIMAL],
    BOOLEAN: [InternalAttributeType.BOOLEAN, BOOLEAN],
    TIME: [InternalAttributeType.TIME, TIME],
    DATE: [InternalAttributeType.DATE, DATE],
    JSON: [InternalAttributeType.JSON, JSON],
    JSONB: [InternalAttributeType.JSONB, JSONB],
    BLOB: [InternalAttributeType.BLOB, BLOB]
  };

  for (let key of Object.keys(genericTests)) {
    let [internalType, externalType] = genericTests[key];

    describe(`#${key}`, () => {
      it('should instantiate correctly', () => {
        externalType.should.deepEqual({
          type: internalType
        });
      });
    });
  }

  describe('#ENUM', () => {
    it('should instantiate correctly', () => {
      ENUM(['a', 'b', 'c']).should.deepEqual({
        type: InternalAttributeType.ENUM,
        options: { values: ['a', 'b', 'c'] }
      });
    });
  });

  describe('#ARRAY', () => {
    it('should instantiate correctly', () => {
      ARRAY(STRING).should.deepEqual({
        type: InternalAttributeType.ARRAY,
        options: { contained: STRING }
      });
    });

    it('should instantiate recursive correctly', () => {
      ARRAY(ARRAY(STRING)).should.deepEqual({
        type: InternalAttributeType.ARRAY,
        options: {
          contained: {
            type: InternalAttributeType.ARRAY,
            options: { contained: STRING }
          }
        }
      });
    });
  });
});
