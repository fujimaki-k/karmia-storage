/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/*jslint node: true, nomen: true */
/*global beforeEach, describe, it */
'use strict';



// Variables
const co = require('co'),
    expect = require('expect.js'),
    karmia_storage_adapter_memory = require('karmia-storage-adapter-memory'),
    karmia_storage = require('../');


describe('karmia-storage', function () {
    describe('count', function () {
        describe('Should count items', function () {
            it('Promise', function (done) {
                co(function* () {
                    const size = 5,
                        length = 3,
                        storage = karmia_storage(karmia_storage_adapter_memory({size: size}));

                    expect(yield storage.count()).to.be(0);
                    for (let i = 0; i < length; ++i) {
                        yield storage.set(i, i);
                    }
                    expect(yield storage.count()).to.be(length);

                    done();
                });
            });

            it('Callback', function (done) {
                co(function* () {
                    const size = 5,
                        length = 3,
                        storage = karmia_storage(karmia_storage_adapter_memory({size: size}));

                    expect(yield storage.count()).to.be(0);
                    for (let i = 0; i < length; ++i) {
                        yield storage.set(i, i);
                    }

                    storage.count(function (error, result) {
                        if (error) {
                            return done(error);
                        }

                        expect(result).to.be(length);

                        done();
                    });
                });
            });
        });
    });

    describe('set', function () {
        describe('Should store new value', function () {
            it('Promise', function (done) {
                co(function* () {
                    const key = 'KEY',
                        value = 'VALUE',
                        storage = karmia_storage(karmia_storage_adapter_memory({size: 5}));

                    expect(storage.adapter.buffer.length).to.be(0);
                    yield storage.set(key, value);
                    expect(storage.adapter.buffer.length).to.be(1);
                    expect(storage.adapter.buffer[0]).to.eql({
                        key: key,
                        value: value
                    });

                    done();
                });
            });

            it('Callback', function (done) {
                const key = 'KEY',
                    value = 'VALUE',
                    storage = karmia_storage(karmia_storage_adapter_memory({size: 5}));

                expect(storage.adapter.buffer.length).to.be(0);
                storage.set(key, value, function (error) {
                    if (error) {
                        return done(error);
                    }

                    expect(storage.adapter.buffer.length).to.be(1);
                    expect(storage.adapter.buffer[0]).to.eql({
                        key: key,
                        value: value
                    });

                    done();
                });
            });
        });

        describe('Should update value', function () {
            it('Promise', function (done) {
                co(function* () {
                    const key = 'KEY',
                        value = 'VALUE',
                        update = 'VALUE_UPDATED',
                        storage = karmia_storage(karmia_storage_adapter_memory({size: 5}));

                    yield storage.set(key, value);
                    expect(storage.adapter.buffer[0]).to.eql({
                        key: key,
                        value: value
                    });

                    yield storage.set(key, update);
                    expect(storage.adapter.buffer[0]).to.eql({
                        key: key,
                        value: update
                    });

                    done();
                });
            });

            it('Callback', function (done) {
                co(function* () {
                    const key = 'KEY',
                        value = 'VALUE',
                        update = 'VALUE_UPDATED',
                        storage = karmia_storage(karmia_storage_adapter_memory({size: 5}));

                    storage.set(key, value, function (error) {
                        if (error) {
                            return done(error);
                        }

                        expect(storage.adapter.buffer[0]).to.eql({
                            key: key,
                            value: value
                        });

                        storage.set(key, update, function (error) {
                            if (error) {
                                return done(error);
                            }

                            expect(storage.adapter.buffer[0]).to.eql({
                                key: key,
                                value: update
                            });

                            done();
                        });
                    });
                });
            });
        });
    });

    describe('get', function () {
        describe('Should get value', function () {
            it('Promise', function (done) {
                co(function* () {
                    const key = 'KEY',
                        value = 'VALUE',
                        storage = karmia_storage(karmia_storage_adapter_memory({size: 5}));

                    yield storage.set(key, value);
                    expect(yield storage.get(key)).to.be(value);

                    done();
                });
            });

            it('Callback', function (done) {
                const key = 'KEY',
                    value = 'VALUE',
                    storage = karmia_storage(karmia_storage_adapter_memory({size: 5}));

                storage.set(key, value, function (error) {
                    if (error) {
                        return done(error);
                    }

                    storage.get(key, function (error, result) {
                        if (error) {
                            return done(error);
                        }

                        expect(result).to.be(value);

                        done();
                    });
                });
            });
        });

        describe('Should get updated value', function () {
            it('Promise', function (done) {
                co(function* () {
                    const key = 'KEY',
                        value = 'VALUE',
                        update = 'VALUE_UPDATED',
                        storage = karmia_storage(karmia_storage_adapter_memory({size: 5}));

                    yield storage.set(key, value);
                    expect(yield storage.get(key)).to.be(value);
                    yield storage.set(key, update);
                    expect(yield storage.get(key)).to.be(update);

                    done();
                });
            });

            it('Callback', function (done) {
                const key = 'KEY',
                    value = 'VALUE',
                    update = 'VALUE_UPDATED',
                    storage = karmia_storage(karmia_storage_adapter_memory({size: 5}));

                storage.set(key, value, function (error, result) {
                    if (error) {
                        return done(error);
                    }

                    storage.get(key, function (error, result) {
                        if (error) {
                            return done(error);
                        }

                        expect(result).to.be(value);
                        storage.set(key, update, function (error) {
                            if (error) {
                                return done(error);
                            }

                            storage.get(key, function (error, result) {
                                if (error) {
                                    return done(error);
                                }

                                expect(result).to.be(update);

                                done();
                            });
                        });
                    });
                });
            });
        });
    });

    describe('remove', function () {
        describe('Should remove value', function () {
            it('Promise', function (done) {
                co(function* () {
                    const size = 5,
                        storage = karmia_storage(karmia_storage_adapter_memory({size: size}));

                    for (let i = 0; i < size; ++i) {
                        yield storage.set(i, i);
                    }

                    expect(storage.adapter.buffer.length).to.be(size);
                    yield storage.remove(2);
                    expect(storage.adapter.buffer.length).to.be(size - 1);
                    expect(storage.adapter.map[2]).to.be(undefined);

                    done();
                });
            });

            it('Callback', function (done) {
                co(function* () {
                    const size = 5,
                        storage = karmia_storage(karmia_storage_adapter_memory({size: size}));

                    for (let i = 0; i < size; ++i) {
                        yield storage.set(i, i);
                    }

                    expect(storage.adapter.buffer.length).to.be(size);
                    storage.remove(2, function (error, result) {
                        expect(storage.adapter.buffer.length).to.be(size - 1);
                        expect(storage.adapter.map[2]).to.be(undefined);

                        done();
                    });
                });
            });
        });
    });
});



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */

