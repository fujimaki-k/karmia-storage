/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* eslint-env es6, mocha, node */
/* eslint-extends: eslint:recommended */
"use strict";



/**
 * KarmiaStorage
 *
 * @class
 */
class KarmiaStorage {
    /**
     * Constructor
     *
     * @param {Object} adapter
     * @constructs KarmiaStorage
     */
    constructor(adapter) {
        const self = this;

        self.adapter = adapter;
    }

    /**
     * Get connection
     *
     * @returns {Object}
     */
    getConnection() {
        const self = this;

        return self.adapter.getConnection();
    }

    /**
     * Connect to database
     *
     * @param   {Function} callback
     */
    connect(callback) {
        const self = this;

        return self.adapter.connect(callback);
    }

    /**
     * Disconnect from database
     *
     * @param {Function} callback
     */
    disconnect(callback) {
        const self = this;

        return self.adapter.disconnect(callback);
    }

    /**
     * Get storage
     *
     * @param name
     * @param options
     * @returns {*}
     */
    storage(name, options) {
        const self = this;

        return self.adapter.storage(name, options);
    }
}


// Export module
module.exports = function (adapter) {
    return new KarmiaStorage(adapter);
};



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
