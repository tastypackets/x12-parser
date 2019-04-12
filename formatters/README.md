# Pre-built formatters
These pre-built formatters are designed to offer basic verification and formatting of data. Please only add formatters that implement the Node transform API, so they can be hooked up by simplying piping the data into the formatter.

The formatters should not disregard data even if it doesn't meet the spec, it should just indicate that the value has invalid data.