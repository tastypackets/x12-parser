const enums = Object.freeze({
    'Nn': 'NUMERIC',
    'R': 'DECIMAL',
    'ID': 'IDENTIFIER',
    'AN': 'STRING',
    'DT': 'DATE',
    'TM': 'TIME',
    'B': 'BINARY'
})

exports.CLP = {
    '1': {
        name: 'Claim Identifier',
        type: enums.AN,
        min: 2,
        max: 38,
        required: true
    },
    '2': {
        name: 'Claim Status Code',
        type: enums.ID,
        min: 1,
        max: 2,
        required: true
    },
    '3': {
        name: 'Submitted Charges',
        type: enums.R,
        min: 1,
        max: 18,
        required: true
    },
    '4': {
        name: 'Amount Paid',
        type: enums.R,
        min: 1,
        max: 18,
        required: true
    },
    '5': {
        name: 'Patient Responsibility',
        type: enums.R,
        min: 1,
        max: 18
    },
    '6': {
        name: 'Claim Indicator',
        type: enums.ID,
        min: 1,
        max: 2,
        required: false
    },
    '7': {
        name: 'Reference Identification',
        type: enums.AN,
        min: 1,
        max: 50,
        required: true
    },
    '8': {
        name: 'Facility Code',
        type: enums.AN,
        min: 1,
        max: 2,
        required: false
    },
    '9': {
        name: 'Claim Frequency Code',
        type: enums.ID,
        min: 1,
        max: 1,
        required: false
    },
    '10': {
        name: 'Patient Status',
        type: enums.ID,
        min: 1,
        max: 2,
        required: false
    },
    '11': {
        name: 'DRG Code',
        type: enums.ID,
        min: 1,
        max: 4,
        required: false
    },
    '12': {
        name: 'Quantity',
        type: enums.R,
        min: 1,
        max: 15,
        required: false
    },
    '13': {
        name: 'Discharge Fraction (%)',
        type: enums.R,
        min: 1,
        max: 10,
        required: false
    },
    '14': {
        name: 'Condition Code',
        min: 1,
        max: 1,
        required: false
    }
}