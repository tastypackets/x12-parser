import type { FormattedSegment, GroupOrSegment, GroupShape } from 'types';

export const finished: FormattedSegment[] = [
  {
    1: '00',
    2: '',
    3: '00',
    4: '',
    5: 'ZZ',
    6: 'EMEDNYBAT',
    7: 'ZZ',
    8: 'ETIN',
    9: '100101',
    10: '1000',
    11: '^',
    12: '00501',
    13: '006000600',
    14: '0',
    15: 'T',
    16: ':',
    name: 'ISA',
  },
  {
    1: 'HP',
    2: 'EMEDNYBAT',
    3: 'ETIN',
    4: '20100101',
    5: '1050',
    6: '6000600',
    7: 'X',
    8: '005010X221A1',
    name: 'GS',
  },
  {
    1: '835',
    2: '1740',
    name: 'ST',
  },
  {
    1: 'I',
    2: '45.75',
    3: 'C',
    4: 'ACH',
    5: 'CCP',
    6: '01',
    7: '111',
    8: 'DA',
    9: '33',
    10: '1234567890',
    11: '',
    12: '01',
    13: '111',
    14: 'DA',
    15: '22',
    16: '20100101',
    name: 'BPR',
  },
  {
    1: '1',
    2: '10100000000',
    3: '1000000000',
    name: 'TRN',
  },
  {
    1: 'EV',
    2: 'ETIN',
    name: 'REF',
  },
  {
    1: '405',
    2: '20100101',
    name: 'DTM',
  },
  {
    1: 'PR',
    2: 'NYSDOH',
    name: 'N1',
  },
  {
    1: 'OFFICE OF HEALTH INSURANCE PROGRAMS',
    2: 'CORNING TOWER, EMPIRE STATE PLAZA',
    name: 'N3',
  },
  {
    1: 'ALBANY',
    2: 'NY',
    3: '122370080',
    name: 'N4',
  },
  {
    1: 'BL',
    2: 'PROVIDER SERVICES',
    3: 'TE',
    4: '8003439000',
    5: 'UR',
    6: 'www.emedny.org',
    name: 'PER',
  },
  {
    1: 'PE',
    2: 'MAJOR MEDICAL PROVIDER',
    3: 'XX',
    4: '9999999995',
    name: 'N1',
  },
  {
    1: 'TJ',
    2: '000000000',
    name: 'REF',
  },
  {
    1: '1',
    name: 'LX',
  },
  {
    1: 'PATIENT ACCOUNT NUMBER',
    2: '1',
    3: '34.25',
    4: '34.25',
    5: '',
    6: 'MC',
    7: '1000210000000030',
    8: '11',
    name: 'CLP',
  },
  {
    1: 'QC',
    2: '1',
    3: 'SUBMITTED LAST',
    4: 'SUBMITTED FIRST',
    5: '',
    6: '',
    7: '',
    8: 'MI',
    9: 'LL99999L',
    name: 'NM1',
  },
  {
    1: '74',
    2: '1',
    3: 'CORRECTED LAST',
    4: 'CORRECTED FIRST',
    name: 'NM1',
  },
  {
    1: 'EA',
    2: 'PATIENT ACCOUNT NUMBER',
    name: 'REF',
  },
  {
    1: '232',
    2: '20100101',
    name: 'DTM',
  },
  {
    1: '233',
    2: '20100101',
    name: 'DTM',
  },
  {
    1: 'AU',
    2: '34.25',
    name: 'AMT',
  },
  {
    1: 'HC',
    2: '6',
    3: '6',
    4: '',
    5: '1',
    name: 'SVC',
    '1-1': 'V2020',
    '1-2': 'RB',
  },
  {
    1: '472',
    2: '20100101',
    name: 'DTM',
  },
  {
    1: 'B6',
    2: '6',
    name: 'AMT',
  },
  {
    1: 'HC',
    2: '2.75',
    3: '2.75',
    4: '',
    5: '1',
    name: 'SVC',
    '1-1': 'V2700',
    '1-2': 'RB',
  },
  {
    1: '472',
    2: '20100101',
    name: 'DTM',
  },
  {
    1: 'B6',
    2: '2.75',
    name: 'AMT',
  },
  {
    1: 'HC',
    2: '5.5',
    3: '5.5',
    4: '',
    5: '1',
    name: 'SVC',
    '1-1': 'V2103',
    '1-2': 'RB',
  },
  {
    1: '472',
    2: '20100101',
    name: 'DTM',
  },
  {
    1: 'B6',
    2: '5.5',
    name: 'AMT',
  },
  {
    1: 'HC',
    2: '20',
    3: '20',
    4: '',
    5: '2',
    name: 'SVC',
    '1-1': 'S0580',
  },
  { 1: '472', 2: '20100101', name: 'DTM' },
  {
    1: 'B6',
    2: '20',
    name: 'AMT',
  },
  {
    1: 'PATIENT ACCOUNT NUMBER',
    2: '2',
    3: '34',
    4: '0',
    5: '',
    6: 'MC',
    7: '1000220000000020',
    8: '11',
    name: 'CLP',
  },
  {
    1: 'QC',
    2: '1',
    3: 'SUBMITTED LAST',
    4: 'SUBMITTED FIRST',
    5: '',
    6: '',
    7: '',
    8: 'MI',
    9: 'LL88888L',
    name: 'NM1',
  },
  {
    1: '74',
    2: '1',
    3: 'CORRECTED LAST',
    4: 'CORRECTED FIRST',
    name: 'NM1',
  },
  {
    1: 'EA',
    2: 'PATIENT ACCOUNT NUMBER',
    name: 'REF',
  },
  {
    1: '232',
    2: '20100101',
    name: 'DTM',
  },
  {
    1: '233',
    2: '20100101',
    name: 'DTM',
  },
  {
    1: 'HC',
    2: '12',
    3: '0',
    4: '',
    5: '0',
    name: 'SVC',
    '1-1': 'V2020',
  },
  {
    1: '472',
    2: '20100101',
    name: 'DTM',
  },
  {
    1: 'CO',
    2: '29',
    3: '12',
    name: 'CAS',
  },
  {
    1: 'HC',
    2: '22',
    3: '0',
    4: '',
    5: '0',
    name: 'SVC',
    '1-1': 'V2103',
  },
  {
    1: '472',
    2: '20100101',
    name: 'DTM',
  },
  {
    1: 'CO',
    2: '29',
    3: '22',
    name: 'CAS',
  },
  {
    1: 'PATIENT ACCOUNT NUMBER',
    2: '2',
    3: '34.25',
    4: '11.5',
    5: '',
    6: 'MC',
    7: '1000230000000020',
    8: '11',
    name: 'CLP',
  },
  {
    1: 'QC',
    2: '1',
    3: 'SUBMITTED LAST',
    4: 'SUBMITTED FIRST',
    5: '',
    6: '',
    7: '',
    8: 'MI',
    9: 'LL77777L',
    name: 'NM1',
  },
  {
    1: '74',
    2: '1',
    3: 'CORRECTED LAST',
    4: 'CORRECTED FIRST',
    name: 'NM1',
  },
  {
    1: 'EA',
    2: 'PATIENT ACCOUNT NUMBER',
    name: 'REF',
  },
  {
    1: '232',
    2: '20100101',
    name: 'DTM',
  },
  {
    1: '233',
    2: '20100101',
    name: 'DTM',
  },
  {
    1: 'AU',
    2: '11.5',
    name: 'AMT',
  },
  {
    1: 'HC',
    2: '6',
    3: '6',
    4: '',
    5: '1',
    name: 'SVC',
    '1-1': 'V2020',
    '1-2': 'RB',
  },
  {
    1: '472',
    2: '20100101',
    name: 'DTM',
  },
  {
    1: 'B6',
    2: '6',
    name: 'AMT',
  },
  {
    1: 'HC',
    2: '5.5',
    3: '5.5',
    4: '',
    5: '1',
    name: 'SVC',
    '1-1': 'V2103',
    '1-2': 'RB',
  },
  {
    1: '472',
    2: '20130917',
    name: 'DTM',
  },
  {
    1: 'B6',
    2: '5.5',
    name: 'AMT',
  },
  {
    1: 'HC',
    2: '2.75',
    3: '0',
    4: '',
    5: '0',
    name: 'SVC',
    '1-1': 'V2700',
    '1-2': 'RB',
  },
  {
    1: '472',
    2: '20100101',
    name: 'DTM',
  },
  {
    1: 'CO',
    2: '251',
    3: '2.75',
    name: 'CAS',
  },
  {
    1: 'HE',
    2: 'N206',
    name: 'LQ',
  },
  {
    1: 'HC',
    2: '20',
    3: '0',
    4: '',
    5: '0',
    name: 'SVC',
    '1-1': 'S0580',
  },
  {
    1: '472',
    2: '20100101',
    name: 'DTM',
  },
  {
    1: 'CO',
    2: '251',
    3: '20',
    name: 'CAS',
  },
  {
    1: 'HE',
    2: 'N206',
    name: 'LQ',
  },
  {
    1: '65',
    2: '1740',
    name: 'SE',
  },
  {
    1: '1',
    2: '6000600',
    name: 'GE',
  },
  {
    1: '1',
    2: '006000600',
    name: 'IEA',
  },
];

export const groupedByISA: GroupOrSegment = {
  name: 'Envelope',
  isGroup: true,
  data: [
    {
      1: '00',
      2: '',
      3: '00',
      4: '',
      5: 'ZZ',
      6: 'EMEDNYBAT',
      7: 'ZZ',
      8: 'ETIN',
      9: '100101',
      10: '1000',
      11: '^',
      12: '00501',
      13: '006000600',
      14: '0',
      15: 'T',
      16: ':',
      name: 'ISA',
    },
    {
      1: 'HP',
      2: 'EMEDNYBAT',
      3: 'ETIN',
      4: '20100101',
      5: '1050',
      6: '6000600',
      7: 'X',
      8: '005010X221A1',
      name: 'GS',
    },
    {
      1: '835',
      2: '1740',
      name: 'ST',
    },
    {
      name: 'headers',
      isGroup: true,
      data: [
        {
          1: 'I',
          2: '45.75',
          3: 'C',
          4: 'ACH',
          5: 'CCP',
          6: '01',
          7: '111',
          8: 'DA',
          9: '33',
          10: '1234567890',
          11: '',
          12: '01',
          13: '111',
          14: 'DA',
          15: '22',
          16: '20100101',
          name: 'BPR',
        },
        {
          1: '1',
          2: '10100000000',
          3: '1000000000',
          name: 'TRN',
        },
        {
          1: 'EV',
          2: 'ETIN',
          name: 'REF',
        },
        {
          1: '405',
          2: '20100101',
          name: 'DTM',
        },
      ],
    },
    {
      name: '1000',
      isGroup: true,
      data: [
        {
          1: 'PR',
          2: 'NYSDOH',
          name: 'N1',
        },
        {
          1: 'OFFICE OF HEALTH INSURANCE PROGRAMS',
          2: 'CORNING TOWER, EMPIRE STATE PLAZA',
          name: 'N3',
        },
        {
          1: 'ALBANY',
          2: 'NY',
          3: '122370080',
          name: 'N4',
        },
        {
          1: 'BL',
          2: 'PROVIDER SERVICES',
          3: 'TE',
          4: '8003439000',
          5: 'UR',
          6: 'www.emedny.org',
          name: 'PER',
        },
      ],
    },
    {
      name: '1000',
      isGroup: true,
      data: [
        {
          1: 'PE',
          2: 'MAJOR MEDICAL PROVIDER',
          3: 'XX',
          4: '9999999995',
          name: 'N1',
        },
        {
          1: 'TJ',
          2: '000000000',
          name: 'REF',
        },
      ],
    },
    {
      name: '2000',
      isGroup: true,
      data: [
        {
          1: '1',
          name: 'LX',
        },
        {
          name: '2100',
          isGroup: true,
          data: [
            {
              1: 'PATIENT ACCOUNT NUMBER',
              2: '1',
              3: '34.25',
              4: '34.25',
              5: '',
              6: 'MC',
              7: '1000210000000030',
              8: '11',
              name: 'CLP',
            },
            {
              1: 'QC',
              2: '1',
              3: 'SUBMITTED LAST',
              4: 'SUBMITTED FIRST',
              5: '',
              6: '',
              7: '',
              8: 'MI',
              9: 'LL99999L',
              name: 'NM1',
            },
            {
              1: '74',
              2: '1',
              3: 'CORRECTED LAST',
              4: 'CORRECTED FIRST',
              name: 'NM1',
            },
            {
              1: 'EA',
              2: 'PATIENT ACCOUNT NUMBER',
              name: 'REF',
            },
            {
              1: '232',
              2: '20100101',
              name: 'DTM',
            },
            {
              1: '233',
              2: '20100101',
              name: 'DTM',
            },
            {
              1: 'AU',
              2: '34.25',
              name: 'AMT',
            },
            {
              name: '2110',
              isGroup: true,
              data: [
                {
                  1: 'HC',
                  2: '6',
                  3: '6',
                  4: '',
                  5: '1',
                  name: 'SVC',
                  '1-1': 'V2020',
                  '1-2': 'RB',
                },
                {
                  1: '472',
                  2: '20100101',
                  name: 'DTM',
                },
                {
                  1: 'B6',
                  2: '6',
                  name: 'AMT',
                },
              ],
            },
            {
              name: '2110',
              isGroup: true,
              data: [
                {
                  1: 'HC',
                  2: '2.75',
                  3: '2.75',
                  4: '',
                  5: '1',
                  name: 'SVC',
                  '1-1': 'V2700',
                  '1-2': 'RB',
                },
                {
                  1: '472',
                  2: '20100101',
                  name: 'DTM',
                },
                {
                  1: 'B6',
                  2: '2.75',
                  name: 'AMT',
                },
              ],
            },
            {
              name: '2110',
              isGroup: true,
              data: [
                {
                  1: 'HC',
                  2: '5.5',
                  3: '5.5',
                  4: '',
                  5: '1',
                  name: 'SVC',
                  '1-1': 'V2103',
                  '1-2': 'RB',
                },
                {
                  1: '472',
                  2: '20100101',
                  name: 'DTM',
                },
                {
                  1: 'B6',
                  2: '5.5',
                  name: 'AMT',
                },
              ],
            },
            {
              name: '2110',
              isGroup: true,
              data: [
                {
                  1: 'HC',
                  2: '20',
                  3: '20',
                  4: '',
                  5: '2',
                  name: 'SVC',
                  '1-1': 'S0580',
                },
                { 1: '472', 2: '20100101', name: 'DTM' },
                {
                  1: 'B6',
                  2: '20',
                  name: 'AMT',
                },
              ],
            },
          ],
        },
        {
          name: '2100',
          isGroup: true,
          data: [
            {
              1: 'PATIENT ACCOUNT NUMBER',
              2: '2',
              3: '34',
              4: '0',
              5: '',
              6: 'MC',
              7: '1000220000000020',
              8: '11',
              name: 'CLP',
            },
            {
              1: 'QC',
              2: '1',
              3: 'SUBMITTED LAST',
              4: 'SUBMITTED FIRST',
              5: '',
              6: '',
              7: '',
              8: 'MI',
              9: 'LL88888L',
              name: 'NM1',
            },
            {
              1: '74',
              2: '1',
              3: 'CORRECTED LAST',
              4: 'CORRECTED FIRST',
              name: 'NM1',
            },
            {
              1: 'EA',
              2: 'PATIENT ACCOUNT NUMBER',
              name: 'REF',
            },
            {
              1: '232',
              2: '20100101',
              name: 'DTM',
            },
            {
              1: '233',
              2: '20100101',
              name: 'DTM',
            },
            {
              name: '2110',
              isGroup: true,
              data: [
                {
                  1: 'HC',
                  2: '12',
                  3: '0',
                  4: '',
                  5: '0',
                  name: 'SVC',
                  '1-1': 'V2020',
                },
                {
                  1: '472',
                  2: '20100101',
                  name: 'DTM',
                },
                {
                  1: 'CO',
                  2: '29',
                  3: '12',
                  name: 'CAS',
                },
              ],
            },
            {
              name: '2110',
              isGroup: true,
              data: [
                {
                  1: 'HC',
                  2: '22',
                  3: '0',
                  4: '',
                  5: '0',
                  name: 'SVC',
                  '1-1': 'V2103',
                },
                {
                  1: '472',
                  2: '20100101',
                  name: 'DTM',
                },
                {
                  1: 'CO',
                  2: '29',
                  3: '22',
                  name: 'CAS',
                },
              ],
            },
          ],
        },
        {
          name: '2100',
          isGroup: true,
          data: [
            {
              1: 'PATIENT ACCOUNT NUMBER',
              2: '2',
              3: '34.25',
              4: '11.5',
              5: '',
              6: 'MC',
              7: '1000230000000020',
              8: '11',
              name: 'CLP',
            },
            {
              1: 'QC',
              2: '1',
              3: 'SUBMITTED LAST',
              4: 'SUBMITTED FIRST',
              5: '',
              6: '',
              7: '',
              8: 'MI',
              9: 'LL77777L',
              name: 'NM1',
            },
            {
              1: '74',
              2: '1',
              3: 'CORRECTED LAST',
              4: 'CORRECTED FIRST',
              name: 'NM1',
            },
            {
              1: 'EA',
              2: 'PATIENT ACCOUNT NUMBER',
              name: 'REF',
            },
            {
              1: '232',
              2: '20100101',
              name: 'DTM',
            },
            {
              1: '233',
              2: '20100101',
              name: 'DTM',
            },
            {
              1: 'AU',
              2: '11.5',
              name: 'AMT',
            },
            {
              name: '2110',
              isGroup: true,
              data: [
                {
                  1: 'HC',
                  2: '6',
                  3: '6',
                  4: '',
                  5: '1',
                  name: 'SVC',
                  '1-1': 'V2020',
                  '1-2': 'RB',
                },
                {
                  1: '472',
                  2: '20100101',
                  name: 'DTM',
                },
                {
                  1: 'B6',
                  2: '6',
                  name: 'AMT',
                },
              ],
            },
            {
              name: '2110',
              isGroup: true,
              data: [
                {
                  1: 'HC',
                  2: '5.5',
                  3: '5.5',
                  4: '',
                  5: '1',
                  name: 'SVC',
                  '1-1': 'V2103',
                  '1-2': 'RB',
                },
                {
                  1: '472',
                  2: '20130917',
                  name: 'DTM',
                },
                {
                  1: 'B6',
                  2: '5.5',
                  name: 'AMT',
                },
              ],
            },
            {
              name: '2110',
              isGroup: true,
              data: [
                {
                  1: 'HC',
                  2: '2.75',
                  3: '0',
                  4: '',
                  5: '0',
                  name: 'SVC',
                  '1-1': 'V2700',
                  '1-2': 'RB',
                },
                {
                  1: '472',
                  2: '20100101',
                  name: 'DTM',
                },
                {
                  1: 'CO',
                  2: '251',
                  3: '2.75',
                  name: 'CAS',
                },
                {
                  1: 'HE',
                  2: 'N206',
                  name: 'LQ',
                },
              ],
            },
            {
              name: '2110',
              isGroup: true,
              data: [
                {
                  1: 'HC',
                  2: '20',
                  3: '0',
                  4: '',
                  5: '0',
                  name: 'SVC',
                  '1-1': 'S0580',
                },
                {
                  1: '472',
                  2: '20100101',
                  name: 'DTM',
                },
                {
                  1: 'CO',
                  2: '251',
                  3: '20',
                  name: 'CAS',
                },
                {
                  1: 'HE',
                  2: 'N206',
                  name: 'LQ',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      1: '65',
      2: '1740',
      name: 'SE',
    },
    {
      1: '1',
      2: '6000600',
      name: 'GE',
    },
    {
      1: '1',
      2: '006000600',
      name: 'IEA',
    },
  ],
};

export const groupedByISAschema: GroupShape = {
  start: 'ISA', // What segment starts the group
  end: 'IEA', // What segment ends the group
  name: 'Envelope', // What is the name of the group
  groups: [
    // Nested groups
    {
      start: 'BPR',
      terminators: ['N1'],
      name: 'headers',
    },
    {
      start: 'N1',
      terminators: ['LX'],
      name: '1000',
    },
    {
      start: 'LX',
      name: '2000',
      terminators: ['SE'],
      groups: [
        {
          start: 'CLP',
          name: '2100',
          groups: [
            {
              start: 'SVC',
              name: '2110',
            },
          ],
        },
      ],
    },
  ],
};