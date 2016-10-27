/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/*jslint devel: true, node: true, nomen: true, stupid: true */
'use strict';



/**
 * Test value
 *
 * @param {*} conditions
 * @param {Array} value
 * @returns {boolean}
 */
function test(conditions, value) {
    return Object.keys(conditions || {}).reduce(function (result, key) {
        if (!result) {
            return result;
        }

        if (Object.getPrototypeOf(conditions) === Object.prototype) {
            if (Array.isArray(conditions[key])) {
                return (-1 < conditions[key].indexOf(value[key]));
            }

            if (Array.isArray(conditions[key].$in)) {
                return (-1 < conditions[key].$in.indexOf(value[key]));
            }

            return (conditions[key] === value[key]);
        }

        return (conditions === value);
    }, true);
}


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
     * @param {Object} conditions
     * @returns {Promise}
     */
    count(conditions) {
        const self = this,
            is_object = (conditions instanceof Object),
            result = self.buffer.filter(function (data) {
                if (conditions) {
                    return (is_object) ? test(conditions, data.value) : (conditions === data.value);
                }

                return true;
            });

        return Promise.resolve(result.length);
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

            return self.store(key, value);
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

    /**
     * Find data
     *
     * @param   {Object} conditions
     * @returns {Promise}
     */
    find(conditions) {
        const self = this,
            is_object = (conditions instanceof Object),
            result = self.buffer.reduce(function (collection, data) {
                if ((is_object) ? test(conditions, data.value) : (conditions === data.value)) {
                    collection.push(data.value);
                }

                return collection;
            }, []);

        return Promise.resolve(result);
    }

    /**
     * Remove data
     *
     * @param {string} key
     * @returns {Promise}
     */
    remove(key) {
        const self = this;

        return self.has(key).then(function (result) {
            if (result) {
                const index = self.map[key];

                self.buffer.splice(index, 1);
                Reflect.deleteProperty(self.map, key);
            }

            return Promise.resolve();
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
