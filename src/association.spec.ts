/* tslint:disable:completed-docs */
import * as chai from 'chai';

import { assoc, HAS_ONE } from './association';
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

    chai.assert.deepEqual(assocs['other'], { type: HAS_ONE, target: OtherEntity });
  });
});
