/* tslint:disable:completed-docs */
import * as chai from 'chai';

import { STRING, INTEGER } from './attribute';
import { BELONGS_TO, HAS_MANY, HAS_ONE } from './association';
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
  @attr(STRING)
  blah: string;

  @assoc(BELONGS_TO, () => SerialModel)
  test1: object;

  @assoc(HAS_MANY)
  test2: object;
}

@model()
class SerialModel extends Model {
  @attr(STRING)
  name: string;

  @attr(INTEGER)
  count: number;

  @assoc(HAS_MANY, () => AutomaticModel)
  tests: AutomaticModel[];

  @assoc(BELONGS_TO, () => Serial2Model)
  child: Serial2Model;
}

@model()
class Serial2Model extends Model {
  @attr(STRING)
  hello: string;

  @assoc(HAS_ONE, () => SerialModel)
  parent: SerialModel;
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

  describe('#serialize', () => {
    it('should serialize plain models to JSON correctly', async () => {
      let instance = new SerialModel({
        name: 'Jim Bob',
        count: 2345
      });

      chai.assert.deepEqual(await SerialModel.serialize(instance), {
        name: 'Jim Bob',
        count: 2345
      });
    });

    it('should serialize models with single valued associations to JSON correctly', async () => {
      let instance = new SerialModel({
        name: 'Jim Bob',
        count: 2345,
        child: new Serial2Model({ hello: 'world' })
      });

      chai.assert.deepEqual(await SerialModel.serialize(instance), {
        name: 'Jim Bob',
        count: 2345,
        child: { hello: 'world' }
      });
    });

    it('should serialize models with array valued associations to JSON correctly', async () => {
      let instance = new SerialModel({
        name: 'Jim Bob',
        count: 2345,
        tests: [
          new AutomaticModel({ blah: 'dah' })
        ]
      });

      chai.assert.deepEqual(await SerialModel.serialize(instance), {
        name: 'Jim Bob',
        count: 2345,
        tests: [{ blah: 'dah' }]
      });
    });
  });

  describe('#deserialize', () => {
    it('should deserialize plain models to JSON correctly', async () => {
      let data = {
        name: 'Jim Bob',
        count: 2345
      };

      chai.assert.deepEqual(await SerialModel.deserialize(data), new SerialModel({
        name: 'Jim Bob',
        count: 2345
      }));
    });

    it('should deserialize models with single valued associations to JSON correctly', async () => {
      let data = {
        name: 'Jim Bob',
        count: 2345,
        child: { hello: 'world' }
      };

      chai.assert.deepEqual(await SerialModel.deserialize(data), new SerialModel({
        name: 'Jim Bob',
        count: 2345,
        child: new Serial2Model({ hello: 'world' })
      }));
    });

    it('should deserialize models with array valued associations to JSON correctly', async () => {
      let data = {
        name: 'Jim Bob',
        count: 2345,
        tests: [
          { blah: 'dah' }
        ]
      };

      chai.assert.deepEqual(await SerialModel.deserialize(data), new SerialModel({
        name: 'Jim Bob',
        count: 2345,
        tests: [new AutomaticModel({ blah: 'dah' })]
      }));
    });
  });
});
