import { describe, it, expect } from 'vitest';

import { GroupShape, Schema } from '@/index.js';

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
    it('Should be able to get version', () => {
      expect(testSchema.version).toBe('005010X221A1');
    });

    it('Should be able to get schema', () => {
      expect(testSchema.schema).toStrictEqual(schema);
    });

    it('Should be able to get default', () => {
      expect(testSchema.default).toBe(true);
    });
  });
  describe('#verifySchema()', () => {
    it('Should return the schema if valid', () => {
      expect(Schema.verifySchema(schema)).toStrictEqual(schema);
    });

    it('Should require a start of the group', () => {
      expect(() =>
        Schema.verifySchema('garbage' as unknown as GroupShape)
      ).toThrow();
    });

    it('Should verify all nested groups have a start', () => {
      const testSchema = { ...schema };
      // @ts-expect-error
      delete testSchema.groups[0].start;
      expect(() => Schema.verifySchema(testSchema)).toThrow();
    });
  });
});
