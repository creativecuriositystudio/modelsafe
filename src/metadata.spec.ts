/* tslint:disable:completed-docs */
import * as chai from 'chai';

import { attr, STRING } from './attribute';
import { assoc, BELONGS_TO, HAS_MANY } from './association';
import { guessModelName, getProperties } from './metadata';
import { model, Model, ModelProperties } from './model';

/* tslint:disable:class-name */
class ANiceModelName {}
class thisISA_WEIRD_ModelName {}
class This_Is_Even_Weirder123 {}
/* tslint:enable:class-name */

@model()
class Comment extends Model {
  @attr(STRING)
  message: string;

  @assoc(BELONGS_TO)
  user: User;
}

@model()
class User extends Model {
  @attr(STRING)
  name: string;

  @assoc(HAS_MANY, Comment)
  comments: Comment[];
}

// Add the associaiton target we avoided adding for dependency reasons
Model.associate(Comment, m => [m.user, User]);

describe('guessModelName', () => {
  it('should guess names correctly', () => {
    chai.should().equal(guessModelName(ANiceModelName), 'aNiceModelName');
    chai.should().equal(guessModelName(thisISA_WEIRD_ModelName), 'thisIsaWeirdModelName');
    chai.should().equal(guessModelName(This_Is_Even_Weirder123), 'thisIsEvenWeirder123');
  });
});

describe('getProperties', () => {
  it('should map properties correctly', () => {
    let props: ModelProperties<User> = getProperties<User>(User);

    chai.should().equal(props.name.toString(), 'name');
    chai.should().equal(props.comments.toString(), 'comments');
  });
});
