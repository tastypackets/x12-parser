jsdoc documentation: https://tastypackets.github.io/x12-parser/

[Work on v2 has started with 100% typed code](https://github.com/tastypackets/x12-parser/tree/v2). :tada:

## Description
An X12 parser built using the NodeJS stream API, which can handle very large files and significantly improves processing time by reducing RAM usage. This parser was built using only JS and native NodeJS APIs, the only dependencies in use are dev dependencies for documentation and testing.

## Why are streams important?
EDI files can be very large and may be transmitted with multiple transactions inside one file. With the unknown size of these files it's very easy for them to consume lots of RAM.

Below are some rough examples, later this should be updated with more precise measurements.

|   File Size on Disk    | Number of Lines | No Grouping (RAM) | Group on CLP (RAM) | Group on ISA (RAM) |
| ---------------------- | --------------- | ----------------- | ------------------ | ------------------ |
|         15.5MiB        |     565,832     |       47MiB       |        53MiB       |       294MiB       |
| Objects exiting stream |        -        |      565,832      |        20,166      |          1         |

## Example usage
`yarn add x12-parser` or `npm install x12-parser`

The X12parser is a Node Transform Stream, so you must pipe a read stream to it. The simplest and most common way to do this is using `fs.createReadStream` in NodeJS, however you should be able to use other read streams as long as they are sending the data unmodified from the source file. If you need to control the encoding you can pass `defaultEncoding` to the X12parser, for example `X12parser('utf8')`.

The X12parser will then push every segment as an object, you can either `pip()` this data to another stream for further processing or you can directly consume the `data` events from the X12parser.

Every segment will be an object with a `name` key and multiple int keys, incrementing based on their element number. For example if there was a `HAI` segment with only 1 element it would look like this: `{"name": "HAI", "1": "HI!"}`.

```javascript
// Imports
const { X12parser } = require('x12-parser');
const { createReadStream } = require('fs');

// Create a new parser
const myParser = new X12parser();
myParser.on('error', err => {
    console.error(err);
})

// Create a read stream from a file
const ediFile = createReadStream('./testFile.edi')
ediFile.on('error', err => {
    console.error(err);
})

// Handle events from the parser
ediFile.pipe(myParser).on('data', data => {
    console.log(data);
})

// Output example:
    // { --- 1st Obj emitted
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
    // }
    // { --- 2nd Obj emitted
    //     '1': 'HP',
    //     '2': 'EMEDNYBAT',
    //     '3': 'ETIN',
    //     '4': '20100101',
    //     '5': '1050',
    //     '6': '6000600',
    //     '7': 'X',
    //     '8': '005010X221A1',
    //     name: 'GS'
    // },
```

## Notes
This lib does not enforce 2-character segment & component names, it simply increments the number. For example, `ISA01` would be `ISA1` in the output object and `ISA10` would still be `ISA10`. Similarly, components such as `SVC01-01` would be `SVC1-1`.

If this becomes an issue for processing the 2-character enforcement can be added, however it was dropped to reduce processing of each segment name. Please let me know if you have any feedback on this and I may change it in v2.

### Grouping
**WARNING**: This will be fully rewritten and replaced in v2. Current version was expiermental and not intended for production use.

The grouping stage is another transform stream, it is designed to help group unbounded loops in the X12 files. You must provide it a list of groups and what indicates the start / stop of a loop. If the loop is unbounded the stop is `null`.

Every group will be accumulated until another group starts, at which point the group will be pushed down the stream. This should be kept in mind when grouping, because making large groups could cause memory issues and reduce performance of streams. If a loop is unbounded it will be terminated by either another peer loop or it will be terminated by the closer of a parent loop.

The grouper can accept an array of schemas or a single schema. The grouper will try to select the schema version that matches `GS08`. If no schemas match `GS08` it will look for a schema with the defaultSchema key set to true, if there are none it will then select the first schema in the array of schemas.

Below is an example of grouping everything inside the ISA, however **this is not a good idea** for production. There is an unknown number of nested elements and it may have memory issues. It would be better in this case to group on something like the CLP lines.

### Grouper Example
```javascript
const { X12parser, X12grouper, Schema } = require('x12-parser');
const { createReadStream } = require('fs');

const schema = {
    "start": "ISA", // What segment starts the group
    "end": "IEA", // What segment ends the group
    "name": "Envelope", // What is the name of the group
    "groups": [ // Nested groups
        {
            "start": "BPR",
            "terminators": ["N1"],
            "name": "headers"
        },
        {
            "start": "N1",
            "terminators": ["LX"],
            "name": "1000"
        },
        {
            "start": "LX",
            "name": "2000",
            "terminators": ["SE"],
            "groups": [
                {
                    "start": "CLP",
                    "name": "2100",
                    "groups": [
                        {
                            "start": "SVC",
                            "name": "2110",
                        }
                    ]
                }
            ]
        }
    ]
}

const myParser = new X12parser();
const mySchema = new Schema('005010X221A1', schema);
const myGrouper = new X12grouper(mySchema);

const testFile = createReadStream('./test/testFiles/835/profee.edi')

testFile.pipe(myParser).pipe(myGrouper).on('data', data => {
    console.log(data)
})
```

*The X12grouper is available as an export, but it's not recommended for use.*

# V2 Planned Changes
- [ ] Create specific classes for all objects
- [ ] Create a new Grouper that will evaluate loop repeat indicators
- [ ] Create a new X12schema class that will validate and make schema creation easier
- [ ] Create a validation class
- [ ] Create an automated process for setting up grouping & validation based on 1 schema
- [ ] Add new unit tests using many different types of X12 files - **Help wanted locating and describing different X12 files**

To support additional validation and grouping the new X12schema class will read the schema and determine custom holds that need to be added to the data stream. This would allow a dev to easily group ISA, GS, GE, and IEA segments together and validate the information in them, without needing to write a group stage to merge this data. This is currently highly experimental and as such is planned for a larger v2 update.
