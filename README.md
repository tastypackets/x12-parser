[![Build Status](https://travis-ci.org/tastypackets/x12-parser.svg?branch=master)](https://travis-ci.org/tastypackets/x12-parser)

# Initial release to-do list
- [x] Create parser
- [x] Create parser unit tests for 835s
- [ ] Create docs
- [X] Create Schema class for grouping
- [ ] Create Schema class unit tests
- [X] Create Group class for handling grouping logic
- [ ] Consider adding multi root level groups to schema & grouoper
- [X] Create unit tests for Group class
- [X] Create Grouper stream that uses Group class
- [ ] Create Grouper unit tests
- [X] Create grouping stream
- [X] Grouping unit test
- [ ] End to end test (pipe)
- [ ] Create example end to end usage
- [ ] Publish to NPM

## Beta
This lib is currently only being used in beta testing and is not yet released on NPM.

https://tastypackets.github.io/x12-parser/

## x12
JavaScript EDI Parser that uses datastreams

## Notes
**All items below this are only for beta / development and will be replaced with proper documentation for release.**
This lib does not enforce 2 charector segment & componenet names, it simply increments the number. For example `ISA01` would be `ISA1` in the output object and `ISA10` would still be `ISA10`. Similarly components such as `SVC01-01` would be `SVC1-1`.

If this becomes an issue for processing the 2 charector enforcement can be added, however it was dropped to reduce processing of each segment name.

## Validation
The validation process is another Transform stream, with the goal of validating segments and elements. It should also contain any envelope / header related validation needed.

The validation process was built with 835 X221 and some assumption may have been made based on that. Issues / changes needed for other specs are welcomed, please open an issue to discuss any needed changes.

The validator takes in a JSON object that indicates the transaction set and version it applies to. If the file processed does not match this an error will be appended, but it will still and try to use this validator. You can also pass an array of validators, which the validation stream will then try to select based on the transaction set and version located in the X12 file to auto detect the right validator.

Schema objects should look like this:
OLD, needs to be updated now that we added schema class.
```javascript
{
    "transactionSet": "835", // The transaction set this applies to
    "version": "X221", // What version of the transaction set this applies to
    "headers": [ // Header validation (Everything after ST, but before the first loop)
        {
            "name": "TRN", // Segment name
            "description": "Reassociation Trace Number", // Segment description (optional)
            "required": true, // Indicates if this is an error if it's passed
            "repeates": 1 // Indicates how many times this segment can repeat
        }
    ],
    "loops": [ // A list of loops in the file

    ]
}
```

## Grouping
The grouping stage is another transform stream, it is designed to help grouop unbounded loops in the X12 files.

You must provide it a list of groups and what indicates the start / stop of a loop. If the loop in unbounded the stop is `null`.

Every group will be accumulated until another group starts, at which point the group will be pushed down the stream. This should be kept in mind when grouping, because making large groups could cause memory issues and reduce performance of streams.

If loop is unbounded it will be terminated by either another peer loop or it will be terminated by the closer of a bounded loops

Below is an example of grouping everything inside the ISA, however this is not a good idea for production. Since there is an unkown number of nested elements it may have memory issues. It would be better in this case to group on something like the CLP lines.
```javascript
{
    "start": "ISA", // What segment starts the group
    "end": "ISE", // What segment ends the group
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
```

## Full Example - WIP
```javascript
const { X12parser, X12grouper, Schema } = require('./index');
const { createReadStream } = require('fs');

const schema = {
    "start": "ISA", // What segment starts the group
    "end": "ISE", // What segment ends the group
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

### Overview
X12 file (ISA********~) -> Parser -> segments {name: 'ISA', 01: '12'} -> Validation -> {name: 'ISA', 01: 12, valid: true} -> Formatter -> grouped by CLP
