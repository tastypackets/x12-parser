[![Build Status](https://travis-ci.org/tastypackets/x12-parser.svg?branch=master)](https://travis-ci.org/tastypackets/x12-parser)

# Initial release to-do list
- [x] Create parser
- [x] Create parser unit tests for 835s
- [ ] Create docs
- [X] Create Schema class for grouping
- [X] Create Schema class unit tests
- [X] Create Group class for handling grouping logic
- [ ] Create validation class
- [ ] Create validation unit tests
- [ ] Consider adding multi root level groups to schema & grouper
- [X] Create unit tests for Group class
- [X] Create Grouper stream that uses Group class
- [ ] Create Grouper stream unit tests
- [X] Create grouping stream
- [X] Grouping unit test
- [ ] End to end test (pipe)
- [ ] Create example end to end usage
- [ ] Publish to NPM

## Why are streams important?
EDI files can be very large and, in some cases, may be transmitted with multiple transactions inside one file. With the unknown size of these files it's very easy for them to consume lots of RAM.

Below are some rough examples, later this should be updated with more precise measurements.

| File Size on Disk  | Numbe of Lines | No Grouping (RAM) | Group on CLP (RAM) | Group on ISA (RAM) |
| ------------------ | -------------- | ----------------- | ------------------ | ------------------ |
|       15.5MiB      |     565,832    |       47MiB       |        53MiB       |       294MiB       |
|    Total Groups    |        -       |         0         |        20,166      |          1         |

## Beta
This lib is in development and this is a pre-release, it not recommended for use in production at this time. There will likely be frequent breaking changes while in beta.

https://tastypackets.github.io/x12-parser/

## Notes
**All items below this are only for beta / development and will be replaced with proper documentation for release.**
This lib does not enforce 2-character segment & component names, it simply increments the number. For example, `ISA01` would be `ISA1` in the output object and `ISA10` would still be `ISA10`. Similarly, components such as `SVC01-01` would be `SVC1-1`.

If this becomes an issue for processing the 2-character enforcement can be added, however it was dropped to reduce processing of each segment name.

## Validation
TODO

## Grouping
The grouping stage is another transform stream, it is designed to help group unbounded loops in the X12 files.

You must provide it a list of groups and what indicates the start / stop of a loop. If the loop in unbounded the stop is `null`.

Every group will be accumulated until another group starts, at which point the group will be pushed down the stream. This should be kept in mind when grouping, because making large groups could cause memory issues and reduce performance of streams.

If loop is unbounded it will be terminated by either another peer loop or it will be terminated by the closer of a bounded loop.

Below is an example of grouping everything inside the ISA, however **this is not a good idea** for production. There is an unknown number of nested elements and it may have memory issues. It would be better in this case to group on something like the CLP lines.

## Full Example - WIP
```javascript
const { X12parser, X12grouper, Schema } = require('./index');
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
