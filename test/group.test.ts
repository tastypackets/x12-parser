import { describe, expect, it } from 'vitest';

import { Group } from '@/Group.js';
import type { FormattedSegment, GroupData, GroupShape } from '@/types.js';
import {
  groupedByISAschema,
  finished,
  groupedByISA,
} from './test-files/835/profee-done.js';

describe('Group', () => {
  const clp: FormattedSegment = {
    '1': 'PATIENT ACCOUNT NUMBER',
    '2': '1',
    '3': '34.25',
    '4': '34.25',
    '5': '',
    '6': 'MC',
    '7': '1000210000000030',
    '8': '11',
    name: 'CLP',
  };
  const svcArray: FormattedSegment[] = [
    {
      '1': 'HC',
      '2': '6',
      '3': '6',
      '4': '',
      '5': '1',
      name: 'SVC',
      '1-1': 'V2020',
      '1-2': 'RB',
    },
    { '1': '472', '2': '20100101', name: 'DTM' },
    { '1': 'B6', '2': '6', name: 'AMT' },
    {
      '1': 'HC',
      '2': '2.75',
      '3': '2.75',
      '4': '',
      '5': '1',
      name: 'SVC',
      '1-1': 'V2700',
      '1-2': 'RB',
    },
    { '1': '472', '2': '20100101', name: 'DTM' },
    { '1': 'B6', '2': '2.75', name: 'AMT' },
  ];
  const grouped: GroupData = {
    name: '2100',
    isGroup: true,
    data: [
      {
        '1': 'PATIENT ACCOUNT NUMBER',
        '2': '1',
        '3': '34.25',
        '4': '34.25',
        '5': '',
        '6': 'MC',
        '7': '1000210000000030',
        '8': '11',
        name: 'CLP',
      },
      {
        name: '2110',
        isGroup: true,
        data: [
          {
            '1': 'HC',
            '2': '6',
            '3': '6',
            '4': '',
            '5': '1',
            name: 'SVC',
            '1-1': 'V2020',
            '1-2': 'RB',
          },
          { '1': '472', '2': '20100101', name: 'DTM' },
          { '1': 'B6', '2': '6', name: 'AMT' },
        ],
      },
      {
        name: '2110',
        isGroup: true,
        data: [
          {
            '1': 'HC',
            '2': '2.75',
            '3': '2.75',
            '4': '',
            '5': '1',
            name: 'SVC',
            '1-1': 'V2700',
            '1-2': 'RB',
          },
          { '1': '472', '2': '20100101', name: 'DTM' },
          { '1': 'B6', '2': '2.75', name: 'AMT' },
        ],
      },
    ],
  };

  const schema: GroupShape = {
    start: 'ST',
    name: 'Transaction',
    end: 'SE',
    groups: [
      {
        start: 'N1',
        name: '1000',
        terminators: ['N1', 'LX'],
        groups: [
          {
            start: 'N1',
            name: '1000B',
          },
        ],
      },
      {
        start: 'CLP',
        name: '2100',
        terminators: ['CLP'],
        groups: [
          {
            start: 'SVC',
            name: '2110',
          },
        ],
      },
    ],
  };

  describe('#terminate()', () => {
    it('Should execute cb with grouped data', () => {
      const callDone = (group: Group) => {
        expect(group.data).toStrictEqual({
          name: '2100',
          data: [{ ...clp }],
          isGroup: true,
        });
      };
      const myGroup = new Group(schema.groups![1], clp, callDone);
      myGroup.terminate();
    });
  });

  describe('#add()', () => {
    it('Should group nested data', () => {
      const callDone = (group: Group) => {
        expect(group.data).toStrictEqual(grouped);
      };
      const myGroup = new Group(schema.groups![1], clp, callDone);
      svcArray.forEach((svc) => {
        expect(myGroup.add(svc)).toBe(true);
      });
      myGroup.terminate();
    });

    it('Should be able to group multiple nested groups', () => {
      const callDone = (group: Group) => {
        expect(group.data).toStrictEqual(groupedByISA);
      };
      const myGroup = new Group(groupedByISAschema, finished[0], callDone);
      finished.forEach((item, index) => {
        //Skip first index / ISA
        if (index === 0) return;

        myGroup.add(item);
      });
      myGroup.terminate();
    });

    it('Should throw an error if invalid segment data is passed', () => {
      const myGroup = new Group(groupedByISAschema, finished[0], () => {});
      // @ts-expect-error -- Testing invalid data input handling
      expect(() => myGroup.add('invalid data')).toThrow();
      // @ts-expect-error -- Testing invalid data input handling
      expect(() => myGroup.add({ name: undefined })).toThrow();
    });
  });

  describe('constructor', () => {
    it('Uses defualt name if none is passed', () => {
      const myGroup = new Group({ start: '', name: '' }, finished[0], () => {});
      expect(myGroup.data).toMatchObject({ name: 'No Name' });
    });
  });
});
