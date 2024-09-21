jsdoc documentation: https://tastypackets.github.io/x12-parser/

[Work on v2 has started with 100% typed code](https://github.com/tastypackets/x12-parser/tree/v2). 🎉

## Description

An X12 parser built using the NodeJS stream API, which can handle very large files and significantly improves processing time by reducing RAM usage. This parser was built using only JS and native NodeJS APIs, the only dependencies in use are dev dependencies.

- 🎉 Fully typed
- 🚫 Zero production dependencies
- 🧪 100% code coverage
- 📁 Supports large multi-gigabyte files
- 🏞️ Native NodeJS streams, easily stream into DB, cloud storage, or anything that accepts a pipe.
- 🙌 Exports CJS & ESM to ease upgrades to ESM

## Why are streams important?

EDI files can be very large and may be transmitted with multiple transactions inside one file. With the unknown size of these files it's very easy for them to consume lots of RAM, these numbers may look small to start but make it nearly impossible or costly to process EDI files that are hundreds of megabytes or more.

The below example used a 15.5MiB file with 565,832 lines.

| Stream Type             | RAM Usage  | Objects Exiting Stream |
| ----------------------- | ---------- | ---------------------- |
| Group only segments     | 47MiB      | 565,832                |
| Group on CLP (835)      | 53MiB      | 20,166                 |
| Group on ISA (envelope) | **294MiB** | 1                      |

## Example usage

`npm i x12-parser`

The X12parser is a Node Transform Stream, so you must pipe a read stream to it. The simplest and most common way to do this is using `fs.createReadStream` in NodeJS, however you should be able to use other read streams as long as they are sending the data unmodified from the source file. If you need to control the encoding you can pass `defaultEncoding` to the X12parser, for example `X12parser('utf8')`.

The X12parser will then push every segment as an object, you can either `pip()` this data to another stream or you can directly consume the `data` events from the X12parser.

Every segment will be an object with a `name` key and multiple string counter keys, incrementing based on their element number. For example if there was a `HAI` segment with only 1 element it would look like this: `{"name": "HAI", "1": "HI!"}`.

```ts
import { X12parser } from 'x12-parser';
import { createReadStream } from 'node:fs';

const myParser = new X12parser();
myParser.on('error', (err) => {
  console.error(err);
});

// Create a read stream from a file
const ediFile = createReadStream('./test-file.edi');
ediFile.on('error', (err) => {
  console.error(err);
});

// Handle events from the parser
ediFile.pipe(myParser).on('data', (data) => {
  console.log(data);
});
```

## Notes

This lib does not enforce 2-character segment & component names, it simply increments the number. For example, `ISA01` would be `ISA1` in the output object and `ISA10` would still be `ISA10`. Similarly, components such as `SVC01-01` would be `SVC1-1`.

### Grouping

The grouping stage is a transform stream, it is designed to help group unbounded loops in the X12 files. You must provide it a list of groups and what indicates the start / stop of a loop. If the loop is unbounded the stop is `null`.

Every group will be accumulated until another group starts, at which point the group will be pushed down the stream. This should be kept in mind when grouping, because making large groups could cause memory issues and reduce performance of streams. If a loop is unbounded it will be terminated by either another peer loop or it will be terminated by the closer of a parent loop.

The grouper can accept an array of schemas or a single schema. The grouper will try to select the schema version that matches `GS08`. If no schemas match `GS08` it will look for a schema with the defaultSchema key set to true, if there are none it will then select the first schema in the array of schemas.

Below is an example of grouping everything inside the ISA, however **this is not a good idea** for production. There is an unknown number of nested elements and it may have memory issues. It would be better in this case to group on something else, for example grouping the CLP segments work well in 835s.

### Grouper Example

```ts
import { X12parser, X12grouper, Schema } from 'x12-parser';
import { createReadStream } from 'node:fs';

// Every schema can be associated with a version, which will attempt to be matched to
// the GS08, if none match the default schema or first schema in array will be used.
// This can be helpful when the files being passed may span a few versions and different
// grouping is needed for each version, so long as the version is properly set in the GS08.
const mySchema = new Schema('005010X221A1', {
  start: 'ISA', // What segment starts the group
  end: 'IEA', // What segment ends the group
  name: 'Envelope', // What is the name of the group
  groups: [
    // Nested groups, each group turns into an object and each nested group an array of objects
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
});

const myParser = new X12parser();
// Optionally pass an array of schemas if input file version is unknown and schema versions need to be supported
const myGrouper = new X12grouper(mySchema);

const testFile = createReadStream('./test-825.edi');

testFile
  .pipe(myParser)
  .pipe(myGrouper)
  .on('data', (data) => {
    console.log(data);
  });

// Example output
// {
//   name: 'Envelope',
//   data: [
//   {
//     '1': '00',
//     '2': '',
//     '3': '00',
//     '4': '',
//     '5': 'ZZ',
//     '6': 'EMEDNYBAT',
//     '7': 'ZZ',
//     '8': 'ETIN',
//     '9': '100101',
//     '10': '1000',
//     '11': '^',
//     '12': '00501',
//     '13': '006000600',
//     '14': '0',
//     '15': 'T',
//     '16': ':',
//     name: 'ISA'
//   },
//   {
//     '1': 'HP',
//     '2': 'EMEDNYBAT',
//     '3': 'ETIN',
//     '4': '20100101',
//     '5': '1050',
//     '6': '6000600',
//     '7': 'X',
//     '8': '005010X221A1',
//     name: 'GS'
//   },
//   { '1': '835', '2': '1740', name: 'ST' },
//   {
//     name: 'headers',
//     data: [ [Object], [Object], [Object], [Object] ],
//     isGroup: true
//   },
//   {
//     name: '1000',
//     data: [ [Object], [Object], [Object], [Object] ],
//     isGroup: true
//   },
//   { name: '1000', data: [ [Object], [Object] ], isGroup: true },
//   {
//     name: '2000',
//     data: [ [Object], [Object], [Object], [Object] ],
//     isGroup: true
//   },
//   { '1': '65', '2': '1740', name: 'SE' },
//   { '1': '1', '2': '6000600', name: 'GE' },
//   { '1': '1', '2': '006000600', name: 'IEA' }
// ]
//   isGroup: true
// }
```

**Help wanted locating and describing different X12 file for units tests and examples**

To support additional validation and grouping the new X12schema class will read the schema and determine custom holds that need to be added to the data stream. This would allow a dev to easily group ISA, GS, GE, and IEA segments together and validate the information in them, without needing to write a group stage to merge this data. This is currently highly experimental and as such is planned for a larger v2 update.
