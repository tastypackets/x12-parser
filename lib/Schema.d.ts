export = Schema;
declare class Schema {
  /**
   * Takes a schema object and verifies it is valid
   * @param {Schema} schema The schema to be verified
   * @throws {Error} Throws an error if this is an invalid schema
   */
  static verifySchema<T>(schema: T): T;
  /**
   * Creates a new segment object
   * @param {string} version What transaction version this applies to
   * @param {object} groups JSON schema of groupings
   * @param {boolean} defaultSchema Indicates if this will be used if no schemas match transaction version
   */
  constructor(version: string, groups: object, defaultSchema?: boolean);
  _version: string;
  _default: boolean;
  _schema: Schema;
  /** @type {string} */
  get version(): string;
  /** @type {object} */
  get schema(): object;
  /** @type {boolean} */
  get default(): boolean;
}
