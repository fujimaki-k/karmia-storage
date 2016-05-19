/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/*jslint node: true, nomen: true */
/*global beforeEach, describe, it */
'use strict';



// Variables
const co = require('co'),
    expect = require('expect.js'),
    storage = require('../');


describe('karmia-storage', function () {
    describe('memory', function () {
        describe('store', function () {
            it('Should store value', function (done) {
                co(function* () {
                    const key = 'KEY',
                        value = 'VALUE',
                        memory_storage = storage.memory({size: 5});

                    expect(memory_storage.buffer.length).to.be(0);
                    yield memory_storage.store(key, value);
                    expect(memory_storage.buffer.length).to.be(1);
                    expect(memory_storage.buffer[0]).to.eql({
                        key: key,
                        value: value
                    });

                    done();
                });
            });

            it('Should overwrite old value', function (done) {
                co(function* () {
                    const key = 'KEY',
                        value = 'VALUE',
                        size = 5,
                        memory_storage = storage.memory({size: size});

                    expect(memory_storage.buffer.length).to.be(0);
                    for (let i = 0; i < size; ++i) {
                        yield memory_storage.store(i, i);
                    }
                    expect(memory_storage.buffer.length).to.be(size);

                    yield memory_storage.store(key, value);
                    expect(memory_storage.buffer.length).to.be(size);
                    expect(memory_storage.buffer[0]).to.eql({
                        key: key,
                        value: value
                    });

                    done();
                });
            });

            it('Should set storage size to unlimited', function (done) {
                co(function* () {
                    const size = 5,
                        infinite = true,
                        memory_storage = storage.memory({
                            size: size,
                            infinite: infinite
                        });

                    for (let i = 0; i < size + 1; ++i) {
                        yield memory_storage.store(i, i);
                    }

                    expect(memory_storage.buffer.length).to.be(size + 1);

                    done();
                });
            });
        });

        describe('count', function () {
            it('Should count buffer', function (done) {
                co(function* () {
                    const size = 5,
                        length = 3,
                        memory_storage = storage.memory({size: size});

                    expect(yield memory_storage.count()).to.be(0);
                    for (let i = 0; i < length; ++i) {
                        yield memory_storage.store(i, i);
                    }
                    expect(yield memory_storage.count()).to.be(length);

                    done();
                });
            });
        });

        describe('has', function () {
            it('Should check is key exists', function (done) {
                co(function* () {
                    const key = 'KEY',
                        value = 'VALUE',
                        memory_storage = storage.memory({size: 5});

                    expect(yield memory_storage.has(key)).to.be(false);
                    yield memory_storage.store(key, value);
                    expect(yield memory_storage.has(key)).to.be(true);

                    done();
                });
            });
        });

        describe('set', function () {
            it('Should update value', function (done) {
                co(function* () {
                    const key = 'KEY',
                        value = 'VALUE',
                        update = 'VALUE_UPDATED',
                        memory_storage = storage.memory({size: 5});

                    yield memory_storage.store(key, value);
                    expect(memory_storage.buffer[0]).to.eql({
                        key: key,
                        value: value
                    });

                    yield memory_storage.set(key, update);
                    expect(memory_storage.buffer[0]).to.eql({
                        key: key,
                        value: update
                    });

                    done();
                });
            });

            describe('Should be error', function () {
                it('Not stored', function (done) {
                    co(function* () {
                        const memory_storage = storage.memory({size: 1});
                        yield memory_storage.set('KEY_NOT_FOUND', 'VALUE');
                    }).catch(function (error) {
                        expect(error.code).to.be(404);
                        expect(error.message).to.be('storage.key.not_found');

                        done();
                    });
                });

                it('Not exists', function (done) {
                    co(function* () {
                        const memory_storage = storage.memory({size: 1});
                        yield memory_storage.store('KEY', 'VALUE');
                        yield memory_storage.set('KEY_NOT_FOUND', 'VALUE');
                    }).catch(function (error) {
                        expect(error.code).to.be(404);
                        expect(error.message).to.be('storage.key.not_found');

                        done();
                    });
                });
            });
        });

        describe('get', function () {
            it('Should get value', function (done) {
                co(function* () {
                    const key = 'KEY',
                        value = 'VALUE',
                        memory_storage = storage.memory({size: 5});

                    yield memory_storage.store(key, value);
                    expect(yield memory_storage.get(key)).to.be(value);

                    done();
                });
            });

            it('Should get updated value', function (done) {
                co(function* () {
                    const key = 'KEY',
                        value = 'VALUE',
                        update = 'VALUE_UPDATED',
                        memory_storage = storage.memory({size: 5});

                    yield memory_storage.store(key, value);
                    expect(yield memory_storage.get(key)).to.be(value);
                    yield memory_storage.store(key, update);
                    expect(yield memory_storage.get(key)).to.be(update);

                    done();
                });
            });

            it('Should get defalut value', function (done) {
                co(function* () {
                    const memory_storage = storage.memory({size: 5});

                    expect(yield memory_storage.get('KEY_NOT_FOUND')).to.be(undefined);

                    done();
                });
            });

            it('Should get specified defalut value', function (done) {
                co(function* () {
                    const default_value = 'DEFAULT_VALUE',
                        memory_storage = storage.memory({size: 5});

                    expect(yield memory_storage.get('KEY_NOT_FOUND', default_value)).to.be(default_value);

                    done();
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
