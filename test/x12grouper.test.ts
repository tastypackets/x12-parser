import { describe, it, expect, vi } from 'vitest';
import { EventEmitter } from 'node:events';

import { X12grouper, Schema } from '@/index';
import { finished } from './test-files/835/profee-done';
import { Group } from '@/Group';
import { it_cb } from './callback-test';

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

const testSchema = new Schema('005010X221A1', schema, true);
const testSchema2 = new Schema('005010X221', schema, false);

//TODO: Still need to add unit tests for some specific methods
describe('X12grouper', () => {
  describe('#constructor()', () => {
    it('Should accept a single schema object', () => {
      const tmpGrouper = new X12grouper(testSchema);
      expect(tmpGrouper.schemas).toStrictEqual([testSchema]);
    });

    it('Should accept an array of schemas', () => {
      const tmpGrouper = new X12grouper([testSchema, testSchema2]);
      expect(tmpGrouper.schemas).toStrictEqual([testSchema, testSchema2]);
    });

    it('Should throw an error if schema is not a Schema object', () => {
      expect(
        () =>
          new X12grouper({
            // @ts-expect-error -- Testing invalid data input
            test: 'not an instance of schema object',
          })
      ).toThrow();
    });
  });

  describe('Stream API', () => {
    it('Should return an event emitter', () => {
      const myGrouper = new X12grouper(testSchema);
      expect(myGrouper).toBeInstanceOf(EventEmitter);
    });

    it('Should end any pending groups during flush (stream end)', () => {
      const myGrouper = new X12grouper(testSchema);
      myGrouper.write({ name: 'CLP', CLP1: 'some test data' });

      const groupDoneSpy = vi.spyOn(myGrouper, 'groupDone');

      expect(myGrouper.activeGroup).toBeInstanceOf(Group);
      myGrouper._flush(() => {});
      expect(myGrouper.activeGroup).not.toBeInstanceOf(Group);
      expect(groupDoneSpy).toBeCalled();
    });
  });

  describe('#processSegment()', () => {
    it('ISA should go into an intial hold', () => {
      const tmpGrouper = new X12grouper(testSchema);
      tmpGrouper.write(finished[0]); // ISA
      expect(tmpGrouper.initialHold[0]).toBe(finished[0]);
    });

    it_cb(
      'Items in initial hold should come down pipe before new segment',
      (done) => {
        // ISA -> Hold
        // GS -> Process Hold (ISA) -> Process GS
        const tmpGrouper = new X12grouper(testSchema);
        let counter = 0;
        tmpGrouper.on('data', (data: (typeof finished)[number]) => {
          expect(finished[counter]).toStrictEqual(data);
          counter++;

          if (counter === 2) {
            done();
          }
        });
        tmpGrouper.write(finished[0]); // ISA
        tmpGrouper.write(finished[1]); // GS
      }
    );
  });

  describe('Schema detection', () => {
    it('Should set the version to GS08', () => {
      const tmpGrouper = new X12grouper([testSchema, testSchema2]);
      tmpGrouper.write(finished[1]);
      expect(tmpGrouper.activeVersion).toBe('005010X221A1');
      tmpGrouper.write({ ...finished[1], 8: '005010X221' });
      expect(tmpGrouper.activeVersion).toBe('005010X221');
    });

    it('The first schema marked as default will be the default schema', () => {
      const tmpGrouper = new X12grouper([testSchema2, testSchema]);
      expect(tmpGrouper.defaultSchema).toStrictEqual(testSchema);
    });

    it('If no schemas are marked as the default the first schema will be used as default', () => {
      const tmpGrouper = new X12grouper([
        testSchema2,
        new Schema('005010X221A1', schema),
      ]);
      expect(tmpGrouper.defaultSchema).toStrictEqual(testSchema2);
    });

    it('If there is a schema version that matches GS08 it will be used', () => {
      const tmpSchema = new Schema('005010X221A1', { ...schema, name: 'test' });
      const tmpGrouper = new X12grouper([testSchema2, tmpSchema]);
      tmpGrouper.write(finished[1]); // GS
      tmpGrouper.write(finished[14]); // CLP
      expect(tmpGrouper.activeGroup!.schema.name).toBe('test');
    });

    it('If there is no schema version that matches GS08 the default will be used', () => {
      const tmpSchema = new Schema('random', { ...schema, name: 'test' });
      const tmpGrouper = new X12grouper([testSchema2, tmpSchema]);
      tmpGrouper.write(finished[1]); // GS
      tmpGrouper.write(finished[14]); // CLP
      expect(tmpGrouper.activeGroup!.schema.name).toBe('2100');
    });

    it('If segment is GS it will update the version and use new schema', () => {
      const tmpSchema = new Schema('005010X221A1', { ...schema, name: 'test' });
      const tmpGrouper = new X12grouper([testSchema2, tmpSchema]);
      tmpGrouper.write(finished[1]); // GS - 005010X221A1
      tmpGrouper.write(finished[14]); // CLP
      expect(tmpGrouper.activeVersion).toBe('005010X221A1');
      expect(tmpGrouper.activeGroup!.schema.name).toBe('test');
      tmpGrouper.write({ ...finished[1], 8: '005010X221' }); // GS
      tmpGrouper.write(finished[14]); // CLP
      expect(tmpGrouper.activeVersion).toBe('005010X221');
      expect(tmpGrouper.activeGroup!.schema.name).toBe('2100');
    });
  });
});
