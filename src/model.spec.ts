import * as chai from 'chai';

import { assoc, BELONGS_TO, HAS_MANY } from './association';
import { getModelOptions, getAssociations } from './metadata';
import { model, Model } from './model';

@model()
class AutomaticModel extends Model {
  @assoc(BELONGS_TO)
  test1: Object;

  @assoc(HAS_MANY)
  test2: Object;
}

@model({ name: 'manualModelName' })
class ManualModel extends Model {
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
  describe('#associate', () => {
    it('should override association types if provided', () => {
      Model.associate(AutomaticModel, m => [m.test1, ManualModel], HAS_MANY);

      let assocs = getAssociations(AutomaticModel);

      assocs['test1'].type.should.equal(HAS_MANY);
    });

    it('should keep @assoc definitions if no association type is provided', () => {
      Model.associate(AutomaticModel, m => [m.test2, ManualModel]);

      let assocs = getAssociations(AutomaticModel);

      assocs['test2'].type.should.equal(HAS_MANY);
    });
  });
});
