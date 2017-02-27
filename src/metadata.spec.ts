import 'should';

import { attr, STRING } from './attribute';
import { assoc, BELONGS_TO, HAS_MANY } from './association';
import { guessModelName, getProperties } from './metadata';
import { model, Model, ModelProperties } from './model';

/* tslint:disable */
class ANiceModelName {}
class thisISA_WEIRD_ModelName {}
class This_Is_Even_Weirder123 {}
/* tslint:enable */

@model()
class Comment extends Model {
  @attr(STRING)
  message: string;

  // FIXME: Doesn't work yet due to `User` not being defined.
  /*
  @assoc(BELONGS_TO)
  user: User;
   */
}

@model()
class User extends Model {
  @attr(STRING)
  name: string;

  @assoc(HAS_MANY, Comment)
  comments: Comment[];
}

// FIXME: See above.
// Model.associate(Comment, m => [m.user, User]);

describe('guessModelName', () => {
  it('should guess names correctly', () => {
    guessModelName(ANiceModelName).should.equal('aNiceModelName');
    guessModelName(thisISA_WEIRD_ModelName).should.equal('thisIsaWeirdModelName');
    guessModelName(This_Is_Even_Weirder123).should.equal('thisIsEvenWeirder123');
  });
});

describe('getProperties', () => {
  it('should map properties correctly', () => {
    let props: ModelProperties<User> = getProperties(User);

    props.name.compile().should.equal('name');
    props.comments.compile().should.equal('comments');
  });
});
