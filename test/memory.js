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
            describe('Should store value', function () {
                it('Promise', function (done) {
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

                it('Callback', function (done) {
                    const key = 'KEY',
                        value = 'VALUE',
                        memory_storage = storage.memory({size: 5});

                    expect(memory_storage.buffer.length).to.be(0);
                    memory_storage.store(key, value, function (error) {
                        if (error) {
                            return done(error);
                        }

                        expect(memory_storage.buffer.length).to.be(1);
                        expect(memory_storage.buffer[0]).to.eql({
                            key: key,
                            value: value
                        });

                        done();
                    });
                });
            });

            describe('Should overwrite old value', function () {
                it('Promise', function (done) {
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

                it('Callback', function (done) {
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

                        memory_storage.store(key, value, function (error) {
                            if (error) {
                                return done(error);
                            }

                            expect(memory_storage.buffer.length).to.be(size);
                            expect(memory_storage.buffer[0]).to.eql({
                                key: key,
                                value: value
                            });

                            done();
                        });
                    });
                });
            });

            describe('Should set storage size to unlimited', function () {
                it('Promise', function (done) {
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

                it('Callback', function (done) {
                    co(function* () {
                        const size = 5,
                            infinite = true,
                            memory_storage = storage.memory({
                                size: size,
                                infinite: infinite
                            });

                        for (let i = 0; i < size; ++i) {
                            yield memory_storage.store(i, i);
                        }

                        memory_storage.store('key', 'value', function (error) {
                            if (error) {
                                return done(error);
                            }

                            expect(memory_storage.buffer.length).to.be(size + 1);

                            done();
                        });
                    });
                });
            });
        });

        describe('count', function () {
            describe('Should count items', function () {
                it('Promise', function (done) {
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

                it('Callback', function (done) {
                    co(function* () {
                        const size = 5,
                            length = 3,
                            memory_storage = storage.memory({size: size});

                        expect(yield memory_storage.count()).to.be(0);
                        for (let i = 0; i < length; ++i) {
                            yield memory_storage.store(i, i);
                        }

                        memory_storage.count(function (error, result) {
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

        describe('has', function () {
            describe('Should check is key exists', function () {
                it('Promise', function (done) {
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

                it('Callback', function (done) {
                    const key = 'KEY',
                        value = 'VALUE',
                        memory_storage = storage.memory({size: 5});

                    memory_storage.has(key, function (error, result) {
                        if (error) {
                            return done(error);
                        }

                        expect(result).to.be(false);
                        memory_storage.store(key, value, function (error) {
                            if (error) {
                                return done(error);
                            }

                            memory_storage.has(key, function (error, result) {
                                if (error) {
                                    return done(error);
                                }

                                expect(result).to.be(true);

                                done();
                            });
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
                            memory_storage = storage.memory({size: 5});

                        expect(memory_storage.buffer.length).to.be(0);
                        yield memory_storage.set(key, value);
                        expect(memory_storage.buffer.length).to.be(1);
                        expect(memory_storage.buffer[0]).to.eql({
                            key: key,
                            value: value
                        });

                        done();
                    });
                });

                it('Callback', function (done) {
                    const key = 'KEY',
                        value = 'VALUE',
                        memory_storage = storage.memory({size: 5});

                    expect(memory_storage.buffer.length).to.be(0);
                    memory_storage.set(key, value, function (error) {
                        if (error) {
                            return done(error);
                        }

                        expect(memory_storage.buffer.length).to.be(1);
                        expect(memory_storage.buffer[0]).to.eql({
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

                it('Callback', function (done) {
                    co(function* () {
                        const key = 'KEY',
                            value = 'VALUE',
                            update = 'VALUE_UPDATED',
                            memory_storage = storage.memory({size: 5});

                        memory_storage.store(key, value, function (error) {
                            if (error) {
                                return done(error);
                            }

                            expect(memory_storage.buffer[0]).to.eql({
                                key: key,
                                value: value
                            });

                            memory_storage.set(key, update, function (error) {
                                if (error) {
                                    return done(error);
                                }

                                expect(memory_storage.buffer[0]).to.eql({
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
                            memory_storage = storage.memory({size: 5});

                        yield memory_storage.store(key, value);
                        expect(yield memory_storage.get(key)).to.be(value);

                        done();
                    });
                });

                it('Callback', function (done) {
                    const key = 'KEY',
                        value = 'VALUE',
                        memory_storage = storage.memory({size: 5});

                    memory_storage.store(key, value, function (error) {
                        if (error) {
                            return done(error);
                        }

                        memory_storage.get(key, function (error, result) {
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
                            memory_storage = storage.memory({size: 5});

                        yield memory_storage.store(key, value);
                        expect(yield memory_storage.get(key)).to.be(value);
                        yield memory_storage.store(key, update);
                        expect(yield memory_storage.get(key)).to.be(update);

                        done();
                    });
                });

                it('Callback', function (done) {
                    const key = 'KEY',
                        value = 'VALUE',
                        update = 'VALUE_UPDATED',
                        memory_storage = storage.memory({size: 5});

                    memory_storage.store(key, value, function (error, result) {
                        if (error) {
                            return done(error);
                        }

                        memory_storage.get(key, function (error, result) {
                            if (error) {
                                return done(error);
                            }

                            expect(result).to.be(value);
                            memory_storage.set(key, update, function (error) {
                                if (error) {
                                    return done(error);
                                }

                                memory_storage.get(key, function (error, result) {
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
                            memory_storage = storage.memory({size: size});

                        for (let i = 0; i < size; ++i) {
                            yield memory_storage.store(i, i);
                        }

                        expect(memory_storage.buffer.length).to.be(size);
                        yield memory_storage.remove(2);
                        expect(memory_storage.buffer.length).to.be(size - 1);
                        expect(memory_storage.map[2]).to.be(undefined);

                        done();
                    });
                });

                it('Callback', function (done) {
                    co(function* () {
                        const size = 5,
                            memory_storage = storage.memory({size: size});

                        for (let i = 0; i < size; ++i) {
                            yield memory_storage.store(i, i);
                        }

                        expect(memory_storage.buffer.length).to.be(size);
                        memory_storage.remove(2, function (error, result) {
                            expect(memory_storage.buffer.length).to.be(size - 1);
                            expect(memory_storage.map[2]).to.be(undefined);

                            done();
                        });
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

