// tslint:disable:completed-docs
// tslint:disable:no-unused-expression
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as jsc from 'jsverify';

import { STRING, REAL, INTEGER, CHAR, TEXT, BOOLEAN, TIME, DATE } from './attribute';
import { model, attr, required, optional, defaultValue } from './metadata';
import { Model } from './model';
import { ValidationError } from './validation';

chai.use(chaiAsPromised);

@model()
class Validated1Model extends Model {
  @attr(STRING)
  @required
  @defaultValue(49.23)
  name: string;

  @attr(STRING)
  @optional
  secondName?: string;
}

@model()
class Validated2Model extends Model {
  @attr(REAL)
  amount: number;
}

@model()
class Validated3Model extends Model {
  @attr(INTEGER)
  amount: number;
}

@model()
class Validated4Model extends Model {
  @attr(CHAR)
  someChar: string;
}

@model()
class Validated5Model extends Model {
  @attr(TEXT)
  text: string;
}

@model()
class Validated6Model extends Model {
  @attr(BOOLEAN)
  bool: boolean;
}

@model()
class Validated7Model extends Model {
  @attr(TIME)
  time: Date;
}

@model()
class Validated8Model extends Model {
  @attr(DATE)
  date: Date;
}

/* Runs a property check on a model validation 100 times */
async function forall<T extends Model>(arb: jsc.Arbitrary<any>,
                                       ctor: (value: any) => T,
                                       reverse: boolean = false): Promise<any> {
  return jsc.assertForall(arb, async (value: any) => {
    return ctor(value).validate()
      .then(_ => !reverse)
      .catch(_ => reverse);
  });
}

describe('Model', () => {
  describe('#validate', () => {
    it('should reject attribute type validations with invalid default values', async () => {
      return chai.expect(new Validated1Model().validate())
        .to.be.rejected
        .then((err: ValidationError<Validated1Model>) => {
          err.errors.name.should.exist;
          err.errors.name[0].type.should.equal('attribute.string');
        });
    });

    it('should accept STRING attribute type validations with fuzzed strings', async () => {
      return forall(jsc.string, value => new Validated1Model({ name: value }));
    });

    it('should accept REAL attribute type validations with fuzzed real numbers', async () => {
      return forall(jsc.number, value => new Validated2Model({ amount: value }));
    });

    it('should accept INTEGER attribute type validations with fuzzed integer numbers', async () => {
      return forall(jsc.integer, value => new Validated3Model({ amount: value }));
    });

    it('should accept CHAR attribute type validations with fuzzed chars', async () => {
      return forall(jsc.char, value => new Validated4Model({ someChar: value }));
    });

    it('should accept TEXT attribute type validations with fuzzed strings', async () => {
      return forall(jsc.string, value => new Validated5Model({ text: value }));
    });

    it('should accept BOOLEAN attribute type validations with fuzzed bools', async () => {
      return forall(jsc.bool, value => new Validated6Model({ bool: value }));
    });

    it('should accept TIME attribute type validations with fuzzed datetimes', async () => {
      return forall(jsc.datetime, value => new Validated7Model({ time: value }));
    });

    it('should accept DATE attribute type validations with fuzzed datetimes', async () => {
      return forall(jsc.datetime, value => new Validated8Model({ date: value }));
    });

    it('should accept optional attribute validations with nil values', async () => {
      return chai.expect(new Validated1Model({ name: 'blah' }).validate()).to.be.fulfilled;
    });

    it('should reject required attribute validations with nil values', async () => {
      return chai.expect(new Validated1Model({ name: null }).validate())
        .to.be.rejected
        .then((err: ValidationError<Validated1Model>) => {
          err.errors.name.should.exist;
          err.errors.name[0].type.should.equal('attribute.required');
        });
    });
  });
});
