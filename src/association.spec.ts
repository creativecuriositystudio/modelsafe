/* tslint:disable:completed-docs */
import * as chai from 'chai';

import { assoc, HAS_ONE, isLazyLoad } from './association';
import { getAssociations } from './metadata';
import { model, Model } from './model';

@model()
export class OtherEntity extends Model {}

@model()
export class Entity extends Model {
  @assoc(HAS_ONE, OtherEntity)
  other: OtherEntity;
}

describe('@assoc', () => {
  it('should define correctly', () => {
    let assocs = getAssociations(Entity);

    chai.assert.deepEqual(assocs['other'], { type: HAS_ONE, target: OtherEntity, readOnly: false });
  });
});

describe('isLazyLoad', () => {
  it('should return true for lambdas or functions returning a model', () => {
    chai.should().equal(isLazyLoad(() => Entity), true);

    // tslint:disable-next-line:only-arrow-functions
    chai.should().equal(isLazyLoad(function() { return Entity; }), true);
  });

  it('should return false for a regular model', () => {
    chai.should().equal(isLazyLoad(Entity), false);
  });
});
