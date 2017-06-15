/* tslint:disable:completed-docs */
import * as chai from 'chai';

import { STRING } from './attribute';
import { BELONGS_TO, HAS_MANY } from './association';
import { model, attr, defaultValue, assoc, getModelOptions } from './metadata';
import { Model } from './model';

@model({ name: 'manualModelName' })
class ManualModel extends Model {
  @attr(STRING)
  @defaultValue('This is a name')
  name: string;
}

@model()
class AutomaticModel extends Model {
  @assoc(BELONGS_TO)
  test1: object;

  @assoc(HAS_MANY)
  test2: object;
}

@model()
class SerialModel extends Model {
  @attr(DATE)
  someDate: Date;
}

describe('@model', () => {
  it('should guess names', () => {
    let options = getModelOptions(AutomaticModel);

    chai.should().equal(options.name, 'automaticModel');
  });

  it('should allow manually defining a model name', () => {
    let options = getModelOptions(ManualModel);

    chai.should().equal(options.name, 'manualModelName');
  });
});

describe('Model', () => {
  describe('#constructor', () => {
    it('should construct with default values set', () => {
      new ManualModel().name.should.equal('This is a name');
    });

    it('should construct with user-provided values set', () => {
      new ManualModel({ name: 'A different name' }).name.should.equal('A different name');
    });
  });
});
