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
     * Get buffer length
     *
     * @param {Function} callback
     */
    count(callback) {
        const self = this;

        return self.adapter.count().then(function (result) {
            return (callback) ? callback(null, result) : Promise.resolve(result);
        }).catch(function (error) {
            return (callback) ? callback(error) : Promise.reject(error);
        });
    }

    /**
     * Update existing data
     *
     * @param {string} key
     * @param {*} value
     * @param {Function} callback
     */
    set(key, value, callback) {
        const self = this;

        return self.adapter.set(key, value).then(function (result) {
            return (callback) ? callback(null, result) : Promise.resolve(result);
        }).catch(function (error) {
            return (callback) ? callback(error) : Promise.reject(error);
        });
    }

    /**
     * Get data
     *
     * @param {string} key
     * @param {Function} callback
     */
    get(key, callback) {
        const self = this;

        return self.adapter.get(key).then(function (result) {
            return (callback) ? callback(null, result) : Promise.resolve(result);
        }).catch(function (error) {
            return (callback) ? callback(error) : Promise.reject(error);
        });
    }

    /**
     * Remove data
     *
     * @param {string} key
     * @param {Function} callback
     */
    remove(key, callback) {
        const self = this;

        return self.adapter.remove(key).then(function (result) {
            return (callback) ? callback(null, result) : Promise.resolve(result);
        }).catch(function (error) {
            return (callback) ? callback(error) : Promise.reject(error);
        });
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
