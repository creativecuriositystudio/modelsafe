/** Contains the safe type, which contains the model definitions. */
import { getModelOptions, getProperties, getAttributes, getAssociations } from './metadata';
import { Model, ModelConstructor, ModelProperties } from './model';

/** A map of model names to model constructors. */
export interface SafeModels {
  [key: string]: ModelConstructor<Model>;
}

/**
 * A safe contains models that can be interacted with.
 */
export class Safe {
  /** The models defined on this safe. */
  models: SafeModels;

  /** Constructs an empty safe. */
  constructor() {
    this.models = {};
  }

  /**
   * Checks if the model has already been defined on the safe.
   *
   * @param model The model constructor.
   * @returns Whether the model has been defined on the safe.
   */
  isDefined<T extends Model>(model: ModelConstructor<T>): boolean {
    let options = getModelOptions(model);

    return !!this.models[options.name];
  }

  /**
   * Define a model on the safe, allowing it to be interacted with.
   * This mutates the safe.
   *
   * @param model The model constructor.
   * @returns The safe with the model defined, allowing for chain commands.
   */
  define<T extends Model>(model: ModelConstructor<T>): Safe {
    let options = getModelOptions(model);

    if (!options.name) {
      throw new Error('Models must have a model name and be decorated with @model to be defined on a safe');
    }

    if (this.isDefined(model)) {
      return this;
    }

    this.models[options.name] = model;

    return this;
  }

  /**
   * Interacts with a model defined on the safe.
   * The provided function will be given the model properties,
   * which is a mapped type that has all of the properties of the model
   * mapped into a ModelSafe property class (which holds the name of the property and extra information,
   * like association or attribute type).
   *
   * @param model The model constructor.
   * @param map A function that maps over a model's properties to some arbitrary value.
   * @returns Returns whatever value is returned from `map`.
   */
  interact<T extends Model, U>(model: ModelConstructor<T>, map: (props: ModelProperties<T>) => U): U {
    if (!this.isDefined(model)) {
      throw new Error('Models must be defined on the safe before interacting with them');
    }

    return map(getProperties<T>(model));
  }
}
