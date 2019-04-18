class Group {
    constructor(schema, segment, terminateCB) {
        this._schema = schema; //TODO: All validation checker - maybe make schema obj to handle it
        this._name = schema.name || 'No Name';
        this._end = schema.end || null;
        this._groups = schema.groups || [];
        this._terminators = Array.isArray(schema.terminators) ? [...schema.terminators] : [];
        this._groupHolds = [];
        this._segmentsHolds = [];
        this._terminatedGroups = [];
        this._terminateCB = terminateCB;

        // If unbounded add own start to terminators
        if(!this._end && !this._terminators.includes(schema.start)) {
            this._terminators.push(this._schema.start);
        } else if (this._end) {
            this._terminators.push(this._end);
        }

        this._appendData(segment);
    }

    get hasGroups() {
        return this._groupHolds.length !== 0;
    }

    get data() {
        return {
            name: this._name,
            data: this._segmentsHolds
        }
    }

    /**
     * Looks to see if a segment name is in the list of group terminators
     * @param {string} name 
     */
    _isTerminator(name) {
        return this._terminators.includes(name)
    }
    
    /**
     * Checks with all subgroups in order if this belong to them
     * @param {object} segment Segment from X12parser stream
     * @returns {boolean} Indicates if any subgroups handled this
     */
    _checkSubGroups(segment) {
        if(!this.hasGroups) {
            return false;
        }

        const grouopSize = this._groupHolds.length
        for(let i = 0; i < grouopSize; i++) {
            // If handled do not check with any more groups
            if(this._groupHolds[i].add(segment))
                return true;
        }
    }

    /**
     * Looks for a subgroup schema for this segment name
     * @param {string} name 
     */
    _subGroupSchema(name) {
        return this._groups.find(group => group.start === name);
    }

    /**
     * Adds data to the held segments group
     * @param {object} data Segment data to be help in this group
     */
    _appendData(data) {
        if(typeof data !== 'object')
            throw new TypeError('Appened data must be an object')

        if(!data.name)
            throw new Error('Appened data must have a valid segment name')

        this._segmentsHolds.push(data);
    }

    /**
     * Adds a new group to the groups array
     * @param {object} schema Schema for this group
     */
    _addGroup(schema, segment) {
        this._groupHolds.push(new Group(schema, segment, this._removeGroup.bind(this)));
    }

    /**
     * Removes one group from the list of held groups
     * @param {Group} group Group to be removed
     */
    _removeGroup(group) {
        // Add data to held segments before deleting group
        this._appendData(group.data);
        const index = this._groupHolds.indexOf(group);
        this._groupHolds.splice(index, 1);
    }

    /**
     * Tells the group and all subgroups to immediatly terminate
     */
    terminate() {
        // Terminate any nested groups
        this._groupHolds.forEach(group => {
            //console.log(group)
            group.terminate()
        });

        this._terminateCB(this);
    }

    /**
     * Takes a segment and adds it to the proper part of a group if it belongs
     * @param {object} segment Segment from X12parser stream
     * @returns {boolean} Indicates if group accepted the segment or not
     */
    add(segment) {
        // If this termantes the group exit
        if(this._isTerminator(segment.name)) {
            this.terminate()
            return false;
        }

        // If a subgroup can handle this let it collect the data
        if (this._checkSubGroups(segment)) {
            return true;
        }
        
        // If this can create a subgroup create it
        const subGroupSchema = this._subGroupSchema(segment.name);
        if(subGroupSchema) {
            this._addGroup(subGroupSchema, segment)
            return true;
        }

        // No termination or subgroup, so save it as root prop
        this._appendData(segment);
        return true;
    }
}

module.exports = Group;

// Flow:
// Termiantes this group? -> Belongs to subgroup? -> Should be new sub group? -> Save to this group