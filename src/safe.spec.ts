import * as chai from 'chai';

import { attr, STRING } from './attribute';
import { model, Model } from './model';
import { Safe } from './safe';

@model()
class Entity extends Model {
  @attr(STRING)
  name: string;
}

describe('Safe', () => {
  describe('#isDefined', () => {
    it('should return false if the model is not defined', () => {
      let safe = new Safe();

      chai.should().equal(safe.isDefined(Entity), false);
    });

    it('should return true if the model is defined', () => {
      let safe = new Safe();

      safe.define(Entity);
      chai.should().equal(safe.isDefined(Entity), true);
    });
  });
});
