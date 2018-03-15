// tslint:disable:completed-docs
// tslint:disable:no-unused-expression
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as jsc from 'jsverify';

import { STRING, REAL, INTEGER, CHAR, TEXT, BOOLEAN, TIME, DATE, DATETIME } from './attribute';
import { model, attr, required, optional, defaultValue,
         email, url, uuid, json, hex, alpha, alphanumeric,
         base64, uppercase, lowercase, ip, matches, gt, gte,
         lt, lte, length, minLength, maxLength } from './metadata';
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

@model()
class Validated9Model extends Model {
  @attr(DATETIME)
  datetime: Date;
}

@model()
class ValidatedOtherModel extends Model {
  @attr(STRING)
  @optional
  @email
  email: string;

  @attr(STRING)
  @optional
  @url
  url: string;

  @attr(STRING)
  @optional
  @uuid
  uuid: string;

  @attr(TEXT)
  @optional
  @json
  json: string;

  @attr(STRING)
  @optional
  @hex
  hex: string;

  @attr(STRING)
  @optional
  @alpha
  alpha: string;

  @attr(STRING)
  @optional
  @alphanumeric
  alphanumeric: string;

  @attr(STRING)
  @optional
  @base64
  base64: string;

  @attr(STRING)
  @optional
  @uppercase
  uppercase: string;

  @attr(STRING)
  @optional
  @lowercase
  lowercase: string;

  @attr(STRING)
  @optional
  @ip
  ip: string;

  @attr(STRING)
  @optional
  @matches(/hello/)
  matches: string;

  @attr(INTEGER)
  @optional
  @gt(0)
  gt: number;

  @attr(INTEGER)
  @optional
  @gte(0)
  gte: number;

  @attr(INTEGER)
  @optional
  @lt(0)
  lt: number;

  @attr(INTEGER)
  @optional
  @lte(0)
  lte: number;

  @attr(STRING)
  @optional
  @length(20)
  length: string;

  @attr(STRING)
  @optional
  @minLength(10)
  minLength: string;

  @attr(STRING)
  @optional
  @maxLength(30)
  maxLength: string;
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

    it('should accept decorated @email validations with valid emails', async () => {
      return chai.expect(new ValidatedOtherModel({ email: 'valid@email.com' }).validate()).to.be.fulfilled;
    });

    it('should reject decorated @email validations with invalid emails', async () => {
      return chai.expect(new ValidatedOtherModel({ email: 'invalid email' }).validate())
        .to.be.rejected
        .then((err: ValidationError<ValidatedOtherModel>) => {
          err.errors.email.should.exist;
          err.errors.email[0].type.should.equal('attribute.email');
        });
    });

    it('should accept decorated @url validations with valid URLs', async () => {
      return chai.expect(new ValidatedOtherModel({ url: 'http://google.com' }).validate()).to.be.fulfilled;
    });

    it('should reject decorated @url validations with invalid URLs', async () => {
      return chai.expect(new ValidatedOtherModel({ url: 'hdowqeqw asdd adasd.123' }).validate())
        .to.be.rejected
        .then((err: ValidationError<ValidatedOtherModel>) => {
          err.errors.url.should.exist;
          err.errors.url[0].type.should.equal('attribute.url');
        });
    });

    it('should accept decorated @uuid validations with valid URLs', async () => {
      return chai.expect(new ValidatedOtherModel({ uuid: '326c5282-2cd7-4139-85a7-eb78e3b97e40' }).validate()).to.be.fulfilled;
    });

    it('should reject decorated @uuid validations with invalid URLs', async () => {
      return chai.expect(new ValidatedOtherModel({ uuid: 'not a good --uuid-1234' }).validate())
        .to.be.rejected
        .then((err: ValidationError<ValidatedOtherModel>) => {
          err.errors.uuid.should.exist;
          err.errors.uuid[0].type.should.equal('attribute.uuid');
        });
    });

    it('should accept decorated @json validations with valid JSON strings', async () => {
      await chai.expect(new ValidatedOtherModel({ json: JSON.stringify({ a: 1, b: [] }) }).validate()).to.be.fulfilled;
      await chai.expect(new ValidatedOtherModel({ json: JSON.stringify([1, 2, { a: 1 }]) }).validate()).to.be.fulfilled;
    });

    it('should reject decorated @json validations with invalid JSON strings', async () => {
      return chai.expect(new ValidatedOtherModel({ json: '{ bad json }' }).validate())
        .to.be.rejected
        .then((err: ValidationError<ValidatedOtherModel>) => {
          err.errors.json.should.exist;
          err.errors.json[0].type.should.equal('attribute.json');
        });
    });

    it('should accept decorated @hex validations with valid hex strings', async () => {
      return chai.expect(new ValidatedOtherModel({ hex: 'ff23aa' }).validate()).to.be.fulfilled;
    });

    it('should reject decorated @hex validations with invalid hex strings', async () => {
      return chai.expect(new ValidatedOtherModel({ hex: 'n0t3v3ncl0se' }).validate())
        .to.be.rejected
        .then((err: ValidationError<ValidatedOtherModel>) => {
          err.errors.hex.should.exist;
          err.errors.hex[0].type.should.equal('attribute.hex');
        });
    });

    it('should accept decorated @alpha validations with valid alphabetic strings', async () => {
      return chai.expect(new ValidatedOtherModel({ alpha: 'abcdefghijklmnopqrstuvwxyz' }).validate()).to.be.fulfilled;
    });

    it('should reject decorated @alpha validations with invalid alphabetic strings', async () => {
      return chai.expect(new ValidatedOtherModel({ alpha: 'no numbers or spaces p1z' }).validate())
        .to.be.rejected
        .then((err: ValidationError<ValidatedOtherModel>) => {
          err.errors.alpha.should.exist;
          err.errors.alpha[0].type.should.equal('attribute.alpha');
        });
    });

    it('should accept decorated @alphanumeric validations with valid alphanumeric strings', async () => {
      return chai.expect(new ValidatedOtherModel({ alphanumeric: '123123sdaasbqwedsf23sad6767' }).validate()).to.be.fulfilled;
    });

    it('should reject decorated @alphanumeric validations with invalid alphanumeric strings', async () => {
      return chai.expect(new ValidatedOtherModel({ alphanumeric: 'alphanumericmachine[B]roke' }).validate())
        .to.be.rejected
        .then((err: ValidationError<ValidatedOtherModel>) => {
          err.errors.alphanumeric.should.exist;
          err.errors.alphanumeric[0].type.should.equal('attribute.alphanumeric');
        });
    });

    it('should accept decorated @base64 validations with valid base64 strings', async () => {
      return chai.expect(new ValidatedOtherModel({
        base64: 'eW91IHJlYWxseSBtYW51YWxseSBkZWNvZGVkIHRoaXMsIHlvdSBmcmVhaz8='
      }).validate()).to.be.fulfilled;
    });

    it('should reject decorated @base64 validations with invalid base64 strings', async () => {
      return chai.expect(new ValidatedOtherModel({ base64: 'thisaintbase64==anymorekidd0' }).validate())
        .to.be.rejected
        .then((err: ValidationError<ValidatedOtherModel>) => {
          err.errors.base64.should.exist;
          err.errors.base64[0].type.should.equal('attribute.base64');
        });
    });

    it('should accept decorated @uppercase validations with valid uppercase strings', async () => {
      return chai.expect(new ValidatedOtherModel({ uppercase: 'HECK YEA BROTHER' }).validate()).to.be.fulfilled;
    });

    it('should reject decorated @uppercase validations with lowercase strings', async () => {
      return chai.expect(new ValidatedOtherModel({ uppercase: 'whyNOTfull UPPERcase?' }).validate())
        .to.be.rejected
        .then((err: ValidationError<ValidatedOtherModel>) => {
          err.errors.uppercase.should.exist;
          err.errors.uppercase[0].type.should.equal('attribute.uppercase');
        });
    });

    it('should accept decorated @lowercase validations with valid lowercase strings', async () => {
      return chai.expect(new ValidatedOtherModel({ lowercase: 'no yelling in the library, please' }).validate()).to.be.fulfilled;
    });

    it('should reject decorated @lowercase validations with lowercase strings', async () => {
      return chai.expect(new ValidatedOtherModel({ lowercase: 'I LOVE YELLING IN the LIBRARIES of modern SoCiEty' }).validate())
        .to.be.rejected
        .then((err: ValidationError<ValidatedOtherModel>) => {
          err.errors.lowercase.should.exist;
          err.errors.lowercase[0].type.should.equal('attribute.lowercase');
        });
    });

    it('should accept decorated @ip validations with valid IP addresses', async () => {
      return chai.expect(new ValidatedOtherModel({ ip: '124.23.23.245' }).validate()).to.be.fulfilled;
    });

    it('should reject decorated @ip validations with invalid IP addresses', async () => {
      return chai.expect(new ValidatedOtherModel({ ip: '123.213.542' }).validate())
        .to.be.rejected
        .then((err: ValidationError<ValidatedOtherModel>) => {
          err.errors.ip.should.exist;
          err.errors.ip[0].type.should.equal('attribute.ip');
        });
    });

    it('should accept decorated @matches validations with a found match', async () => {
      return chai.expect(new ValidatedOtherModel({ matches: 'hello there' }).validate()).to.be.fulfilled;
    });

    it('should reject decorated @matches validations with no found match', async () => {
      return chai.expect(new ValidatedOtherModel({ matches: 'no, i will not greet you' }).validate())
        .to.be.rejected
        .then((err: ValidationError<ValidatedOtherModel>) => {
          err.errors.matches.should.exist;
          err.errors.matches[0].type.should.equal('attribute.matches');
        });
    });

    it('should accept decorated @gt validations with a greater value', async () => {
      return chai.expect(new ValidatedOtherModel({ gt: 1  }).validate()).to.be.fulfilled;
    });

    it('should reject decorated @gt validations with a lesser value', async () => {
      return chai.expect(new ValidatedOtherModel({ gt: -1 }).validate())
        .to.be.rejected
        .then((err: ValidationError<ValidatedOtherModel>) => {
          err.errors.gt.should.exist;
          err.errors.gt[0].type.should.equal('attribute.gt');
        });
    });

    it('should accept decorated @gte validations with a greater/equal value', async () => {
      return chai.expect(new ValidatedOtherModel({ gte: 0  }).validate()).to.be.fulfilled;
    });

    it('should reject decorated @gte validations with a lesser value', async () => {
      return chai.expect(new ValidatedOtherModel({ gte: -1 }).validate())
        .to.be.rejected
        .then((err: ValidationError<ValidatedOtherModel>) => {
          err.errors.gte.should.exist;
          err.errors.gte[0].type.should.equal('attribute.gte');
        });
    });

    it('should accept decorated @lt validations with a lesser value', async () => {
      return chai.expect(new ValidatedOtherModel({ lt: -1  }).validate()).to.be.fulfilled;
    });

    it('should reject decorated @lt validations with a greater value', async () => {
      return chai.expect(new ValidatedOtherModel({ lt: 0 }).validate())
        .to.be.rejected
        .then((err: ValidationError<ValidatedOtherModel>) => {
          err.errors.lt.should.exist;
          err.errors.lt[0].type.should.equal('attribute.lt');
        });
    });

    it('should accept decorated @lte validations with a lesser/equal value', async () => {
      return chai.expect(new ValidatedOtherModel({ lte: 0  }).validate()).to.be.fulfilled;
    });

    it('should reject decorated @lte validations with a greater value', async () => {
      return chai.expect(new ValidatedOtherModel({ lte: 1 }).validate())
        .to.be.rejected
        .then((err: ValidationError<ValidatedOtherModel>) => {
          err.errors.lte.should.exist;
          err.errors.lte[0].type.should.equal('attribute.lte');
        });
    });

    it('should accept decorated @length validations with a valid length', async () => {
      return chai.expect(new ValidatedOtherModel({ length: '68323288688898400214'  }).validate()).to.be.fulfilled;
    });

    it('should reject decorated @length validations with an invalid length', async () => {
      return chai.expect(new ValidatedOtherModel({ length: 'not20characters-132132131312321312312313' }).validate())
        .to.be.rejected
        .then((err: ValidationError<ValidatedOtherModel>) => {
          err.errors.length.should.exist;
          err.errors.length[0].type.should.equal('attribute.length');
        });
    });

    it('should accept decorated @minLength validations with a valid minimum length', async () => {
      return chai.expect(new ValidatedOtherModel({ minLength: 'this is definitely over 10 chars!'  }).validate()).to.be.fulfilled;
    });

    it('should reject decorated @maxLength validations with an invalid minimum length', async () => {
      return chai.expect(new ValidatedOtherModel({ minLength: 'under10' }).validate())
        .to.be.rejected
        .then((err: ValidationError<ValidatedOtherModel>) => {
          err.errors.minLength.should.exist;
          err.errors.minLength[0].type.should.equal('attribute.minLength');
        });
    });

    it('should accept decorated @maxLength validations with a valid maximum length', async () => {
      return chai.expect(new ValidatedOtherModel({ maxLength: 'this is under 30 chars!'  }).validate()).to.be.fulfilled;
    });

    it('should reject decorated @maxLength validations with an invalid maximum length', async () => {
      return chai.expect(new ValidatedOtherModel({
        maxLength: 'This is definitely over 30 characters - why would you think this would work anyway?'
      }).validate())
        .to.be.rejected
        .then((err: ValidationError<ValidatedOtherModel>) => {
          err.errors.maxLength.should.exist;
          err.errors.maxLength[0].type.should.equal('attribute.maxLength');
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

    it('should accept DATETIME attribute type validations with fuzzed datetimes', async () => {
      return forall(jsc.datetime, value => new Validated9Model({ datetime: value }));
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
