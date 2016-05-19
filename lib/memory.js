/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/*jslint devel: true, node: true, nomen: true, stupid: true */
'use strict';



/**
 * MemoryStorage
 *
 * @class
 */
class Storage {
    /**
     * Constructor
     *
     * @constructs KarmiaContext
     */
    constructor(options) {
        const self = this;
        self.infinite = options.infinite || false;
        self.size = options.size || 10000;
        self.index = 0;
        self.buffer = [];
        self.map = {};
    }

    /**
     * Store new data
     *
     * @param   {string} key
     * @param   {*} value
     * @returns {Promise}
     */
    store(key, value) {
        const self = this;
        if (!self.infinite) {
            self.index = (self.index < self.size) ? self.index : 0;

            // Delete existing data
            const current = self.buffer[self.index];
            if (current) {
                delete self.buffer[current.key];
            }
        }

        // Store data
        self.map[key] = self.index;
        self.buffer[self.index] = {
            key: key,
            value: value
        };

        // Increment counter
        self.index = self.index + 1;

        return Promise.resolve();
    }

    /**
     * Get buffer length
     *
     * @returns {Promise}
     */
    count() {
        const self = this;

        return Promise.resolve(self.buffer.length);
    }

    /**
     * Check is key exists
     *
     * @param   {string} key
     * @returns {Promise}
     */
    has(key) {
        const self = this;

        return Promise.resolve(key in self.map);
    }

    /**
     * Update existing data
     *
     * @param   {string} key
     * @param   {*} value
     * @returns {Promise}
     */
    set(key, value) {
        const self = this;

        return self.has(key).then(function (result) {
            if (result) {
                self.buffer[self.map[key]].value = value;

                return Promise.resolve();
            }

            const error = new Error('storage.key.not_found');
            error.code = 404;

            return Promise.reject(error);
        });
    }

    /**
     * Get data
     *
     * @param   {string} key
     * @param   {*} default_value
     * @returns {Promise}
     */
    get(key, default_value = undefined) {
        const self = this;

        return self.has(key).then(function (result) {
            if (result) {
                return Promise.resolve(self.buffer[self.map[key]].value);
            }

            return Promise.resolve(default_value);
        });
    }
}


// Export module
module.exports = function (options) {
    return new Storage(options);
};



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
