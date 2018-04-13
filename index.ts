/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* eslint-env es6, mocha, node */
/* eslint-extends: eslint:recommended */
"use strict";



// Declarations
declare interface KarmiaStorageStorage {
    store: (key: any, value: any, callback?: (error?: Error, result?: any) => void) => Promise<any>;
    count: (callback?: (error?: Error, result?: any) => void) => Promise<any>;
    has: (key: any, callback?: (error?: Error, result?: any) => void) => Promise<any>;
    get: (key: any, callback?: (error?: Error, result?: any) => void) => Promise<any>;
    set: (key: any, value: any, callback?: (error?: Error, result?: any) => void) => Promise<any>;
    remove: (key: any, callback?: (error?: Error, result?: any) => void) => Promise<any>;
}

declare interface KarmiaStorageAdapter {
    getConnection: () => any;
    connect: (callback?: (error?: Error, result?: any) => void) => Promise<any>;
    disconnect: (callback?: (error?: Error, result?: any) => void) => Promise<any>;
    storage: (name: string, options?: {[index: string]: any}) => KarmiaStorageStorage;
}


/**
 * KarmiaStorage
 *
 * @class
 */
class KarmiaStorage {
    /**
     * Properties
     */
    public adapter: KarmiaStorageAdapter;


    /**
     * Constructor
     *
     * @param {Object} adapter
     * @constructs KarmiaStorage
     */
    constructor(adapter: KarmiaStorageAdapter) {
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
     * @param   {Function} [callback]
     */
    connect(callback?: (error?: Error, result?: any) => void): Promise<any> {
        const self = this;

        if (!callback) {
            return self.adapter.connect();
        }
        self.adapter.connect(callback);
    }

    /**
     * Disconnect from database
     *
     * @param {Function} [callback]
     */
    disconnect(callback?: (error?: Error, result?: any) => void): Promise<any> {
        const self = this;

        return self.adapter.disconnect(callback);
    }

    /**
     * Get storage
     *
     * @param name
     * @param [options]
     * @returns {*}
     */
    storage(name: string, options?: {[index: string]: any}): KarmiaStorageStorage {
        const self = this;

        return self.adapter.storage(name, options);
    }
}


// Export module
export = KarmiaStorage;


/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
