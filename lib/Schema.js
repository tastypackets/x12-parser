class Schema {
    constructor(version, groups, defaultSchema) {
        if(typeof version !== 'string')
            throw new TypeError('File version must be a string');

        this._version = version;
        this._default = !!defaultSchema; // Forces to bool
        this._schema = Schema.verifySchema(groups);
    }

    get version() {
        return this._version;
    }

    get schema() {
        return this._schema;
    }

    get default() {
        return this._default;
    }

    /**
     * Takes a schema object and verifies it is valid
     * @param {object} schema 
     * @throws {Error} Throws an error if this is an invalid schema
     */
    static verifySchema(schema) {
        if(!schema.start)
            throw new Error('Schema must have a start point');

        if(schema.groups)
            schema.groups.forEach(group => Schema.verifySchema(group));

        return schema;
    }
}

module.exports = Schema;