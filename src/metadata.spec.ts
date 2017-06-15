/* tslint:disable:completed-docs */
import * as chai from 'chai';

import { STRING, INTEGER } from './attribute';
import { BELONGS_TO, HAS_MANY } from './association';
import { attr, assoc, model, primary, unique,
         required, optional, defaultValue,
         guessModelName, hasModelOptions, getAttributes } from './metadata';
import { Model } from './model';

/* tslint:disable:class-name */
class ANiceModelName {}
class thisISA_WEIRD_ModelName {}
class This_Is_Even_Weirder123 {}
/* tslint:enable:class-name */

@model()
class Comment extends Model {
  @attr(INTEGER)
  @primary
  id: number;

  @attr(INTEGER)
  @required
  likes: number;

  @attr(STRING)
  @unique
  subject: string;

  @attr(STRING)
  @optional
  @defaultValue('None')
  replyTo?: string;

  @attr(STRING)
  message: string;

  @assoc(BELONGS_TO)
  @required
  user: User;
}

@model()
class User extends Model {
  @attr(STRING)
  name: string;

  @assoc(HAS_MANY, Comment)
  comments: Comment[];
}

class NotDecorated {}

describe('@primary', () => {
  it('should define attributes as primary', () => {
    getAttributes(Comment).id.primary.should.equal(true);
  });
});

describe('@unique', () => {
  it('should define attributes as unique', () => {
    getAttributes(Comment).subject.unique.should.equal(true);
  });
});

describe('@required', () => {
  it('should define attributes as required', () => {
    getAttributes(Comment).likes.optional.should.equal(false);
  });
});

describe('@optional', () => {
  it('should define attributes as optional', () => {
    getAttributes(Comment).replyTo.optional.should.equal(true);
  });
});

describe('@defaultValue', () => {
  it('should define attributes with a relevant default value', () => {
    getAttributes(Comment).replyTo.defaultValue.should.equal('None');
  });
});

describe('guessModelName', () => {
  it('should guess names correctly', () => {
    chai.should().equal(guessModelName(ANiceModelName), 'aNiceModelName');
    chai.should().equal(guessModelName(thisISA_WEIRD_ModelName), 'thisIsaWeirdModelName');
    chai.should().equal(guessModelName(This_Is_Even_Weirder123), 'thisIsEvenWeirder123');
  });
});

describe('hasModelOptions', () => {
  it('should return true if a class has been decorated', () => {
    chai.should().equal(hasModelOptions(User), true);
  });

  it('should return false if a class has been decorated', () => {
    chai.should().equal(hasModelOptions(NotDecorated), false);
  });
});
