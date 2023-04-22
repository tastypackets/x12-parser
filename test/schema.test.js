const { Schema } = require('../lib/index.js');
const assert = require('assert');

const schema = {
  start: 'CLP', // What segment starts the group
  terminators: ['SE'], // What segment ends the group
  name: '2100', // What is the name of the group
  groups: [
    // Nested groups
    {
      start: 'SVC',
      name: '2110',
    },
  ],
};

describe('Schema', () => {
  describe('#constructor()', () => {
    const testSchema = new Schema('005010X221A1', schema, true);
    it('Should return an instance of Schema', () => {
      assert(testSchema instanceof Schema);
    });
    it('Should be able to get version', () => {
      assert.strictEqual(testSchema.version, '005010X221A1');
    });
    it('Should be able to get schema', () => {
      assert.deepStrictEqual(testSchema.schema, schema);
    });
    it('Should be able to get default', () => {
      assert.strictEqual(testSchema.default, true);
    });
  });
  describe('#verifySchema()', () => {
    it('Should return the schema if valid', () => {
      assert.deepStrictEqual(Schema.verifySchema(schema), schema);
    });
    it('Should require a start of the group', () => {
      assert.throws(() => Schema.verifySchema('garbage', Error));
    });
    it('Should verify all nested groups have a start', () => {
      const testSchema = { ...schema };
      delete testSchema.groups[0].start;
      assert.throws(() => Schema.verifySchema(testSchema, Error));
    });
  });
});
