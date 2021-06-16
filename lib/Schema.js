class Schema {
  /**
   * Creates a new segment object
   * @param {string} version What transaction version this applies to
   * @param {object} groups JSON schema of groupings
   * @param {boolean} defaultSchema Indicates if this will be used if no schemas match transaction version
   */
  constructor(version, groups, defaultSchema) {
    if (typeof version !== 'string')
      throw new TypeError('File version must be a string');

    this._version = version;
    this._default = !!defaultSchema; // Forces to bool
    this._schema = Schema.verifySchema(groups); //TODO: Recrusive objs ?
  }

  /** @type {string} */
  get version() {
    return this._version;
  }

  /** @type {object} */
  get schema() {
    return this._schema;
  }

  /** @type {boolean} */
  get default() {
    return this._default;
  }

  /**
   * Takes a schema object and verifies it is valid
   * @param {Schema} schema The schema to be verified
   * @throws {Error} Throws an error if this is an invalid schema
   */
  static verifySchema(schema) {
    if (!schema.start) throw new Error('Schema must have a start point');

    if (schema.groups)
      schema.groups.forEach((group) => Schema.verifySchema(group));

    return schema;
  }
}

module.exports = Schema;
