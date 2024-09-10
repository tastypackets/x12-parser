import type { GroupShape } from '@/types';

export class Schema {
  #version: string;
  #default: boolean;
  #schema: GroupShape;
  /**
   * Creates a new segment object
   * @constructor
   * @param version What transaction version this applies to
   * @param groups Schema of groupings
   * @param defaultSchema Indicates if this will be used if no schemas match transaction version
   */
  constructor(version: string, groups: GroupShape, defaultSchema?: boolean) {
    this.#version = version;
    this.#default = Boolean(defaultSchema);
    this.#schema = Schema.verifySchema(groups);
  }

  get version() {
    return this.#version;
  }

  get schema() {
    return this.#schema;
  }

  get default() {
    return this.#default;
  }

  /**
   * Takes a schema object and verifies it is valid
   * @param schema The schema to be verified
   * @throws Throws an error if this is an invalid schema
   */
  static verifySchema(schema: GroupShape): GroupShape {
    if (!schema.start) {
      throw new Error('Schema must have a start point');
    }

    if (schema.groups) {
      schema.groups.forEach((group) => Schema.verifySchema(group));
    }

    return schema;
  }
}
