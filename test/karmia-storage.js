/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/*jslint node: true, nomen: true */
/*global beforeEach, describe, it */
'use strict';



// Variables
const expect = require('expect.js'),
    karmia_storage_adapter_memory = require('karmia-storage-adapter-memory'),
    karmia_storage = require('../'),
    fixture = require('./resource/fixture'),
    options = {};


describe('karmia-storage', function () {
    describe('getConnection', function () {
        it('Should not get connection', function (done) {
            const storage = karmia_storage(karmia_storage_adapter_memory(options));
            expect(storage.getConnection()).to.be(undefined);

            done();
        });

        it('Should get connection', function (done) {
            const storage = karmia_storage(karmia_storage_adapter_memory(options));
            storage.connect().then(function () {
                const connection = storage.getConnection();
                expect(connection.constructor.name).to.be('KarmiaStorageAdapterMemory');

                done();
            });
        });
    });

    describe('connect', function () {
        describe('Should connect to database', function () {
            it('Promise', function (done) {
                const storage = karmia_storage(karmia_storage_adapter_memory(options));
                storage.connect().then(function () {
                    const connection = storage.getConnection();
                    expect(connection.constructor.name).to.be('KarmiaStorageAdapterMemory');

                    done();
                }).catch(function (error) {
                    done(error);
                });
            });

            it('Callback', function (done) {
                const storage = karmia_storage(karmia_storage_adapter_memory(options));
                storage.connect(function (error) {
                    if (error) {
                        return done(error);
                    }

                    const connection = storage.getConnection();
                    expect(connection.constructor.name).to.be('KarmiaStorageAdapterMemory');

                    done();
                });
            });
        });
    });

    describe('disconnect', function () {
        describe('Should disconnect database', function () {
            describe('Connected', function () {
                it('Promise', function (done) {
                    const storage = karmia_storage(karmia_storage_adapter_memory(options));
                    storage.connect().then(function () {
                        return storage.disconnect();
                    }).then(function (result) {
                        expect(result).to.be(undefined);

                        done();
                    }).catch(done);
                });

                it('Callback', function (done) {
                    const storage = karmia_storage(karmia_storage_adapter_memory(options));
                    storage.connect().then(function () {
                        storage.disconnect(function (error, result) {
                            if (error) {
                                return done(error);
                            }

                            expect(result).to.be(undefined);

                            done();
                        });
                    });
                });
            });

            describe('Not connected', function () {
                it('Promise', function (done) {
                    const storage = karmia_storage(karmia_storage_adapter_memory(options));
                    storage.disconnect().then(function (result) {
                        expect(result).to.be(undefined);

                        done();
                    }).catch(done);
                });

                it('Callback', function (done) {
                    const storage = karmia_storage(karmia_storage_adapter_memory(options));
                    storage.disconnect(function (error, result) {
                        if (error) {
                            return done(error);
                        }

                        expect(result).to.be(undefined);

                        done();
                    });
                });
            });
        });
    });

    describe('count', function () {
        const storage = karmia_storage(karmia_storage_adapter_memory(options));

        before(function (done) {
            storage.connect().then(function () {
                return fixture.reduce(function (promise, data) {
                    return promise.then(function () {
                        storage.set(data.key, data.value);
                    });
                }, Promise.resolve());
            }).then(function () {
                return done();
            }).catch(function (error) {
                return done(error);
            });
        });

        describe('Should count items', function () {
            it('Promise', function (done) {
                storage.count().then(function (result) {
                    expect(result).to.be(9);

                    done();
                }).catch(done);
            });

            it('Callback', function (done) {
                storage.count(function (error, result) {
                    if (error) {
                        return done(error);
                    }

                    expect(result).to.be(9);

                    done();
                });
            });
        });

        after(function (done) {
            Promise.all(fixture.map(function (data) {
                return storage.remove(data.key);
            })).then(function () {
                return done();
            }).catch(function (error) {
                return done(error);
            });
        });
    });

    describe('get', function () {
        describe('Should get value', function () {
            it('Promise', function (done) {
                const storage = karmia_storage(karmia_storage_adapter_memory(options)),
                    key = 'KEY',
                    value = 'VALUE';

                storage.connect().then(function () {
                    return storage.get(key);
                }).then(function (result) {
                    expect(result).to.be(null);

                    return storage.set(key, value);
                }).then(function () {
                    return storage.get(key);
                }).then(function (result) {
                    expect(result).to.be(value);

                    return storage.remove(key);
                }).then(function () {
                    done();
                }).catch(done);
            });

            it('Callback', function (done) {
                const storage = karmia_storage(karmia_storage_adapter_memory(options)),
                    key = 'KEY',
                    value = 'VALUE';

                storage.connect().then(function () {
                    storage.get(key, function (error, result) {
                        if (error) {
                            return done(error);
                        }

                        expect(result).to.be(null);

                        storage.set(key, value).then(function () {
                            storage.get(key, function (error, result) {
                                if (error) {
                                    return done(error);
                                }

                                expect(result).to.be(value);

                                done();
                            });
                        }).catch(done);
                    });
                });
            });
        });
    });

    describe('set', function () {
        describe('Should set new value', function () {
            it('Promise', function (done) {
                const storage = karmia_storage(karmia_storage_adapter_memory(options)),
                    key = 'KEY',
                    value = 'VALUE';

                storage.connect().then(function () {
                    return storage.get(key);
                }).then(function (result) {
                    expect(result).to.be(null);

                    return storage.set(key, value);
                }).then(function () {
                    return storage.get(key);
                }).then(function (result) {
                    expect(result).to.be(value);

                    return storage.remove(key);
                }).then(function () {
                    done();
                }).catch(done);
            });

            it('Callback', function (done) {
                const storage = karmia_storage(karmia_storage_adapter_memory(options)),
                    key = 'KEY',
                    value = 'VALUE';

                storage.connect().then(function () {
                    return storage.get(key);
                }).then(function (result) {
                    expect(result).to.be(null);

                    return storage.set(key, value, function (error) {
                        if (error) {
                            return done(error);
                        }

                        storage.get(key).then(function (result) {
                            expect(result).to.be(value);

                            storage.remove(key).then(function () {
                                done();
                            }).catch(done);
                        }).catch(done);
                    });
                }).catch(done);
            });
        });

        describe('Should update value', function () {
            it('Promise', function (done) {
                const storage = karmia_storage(karmia_storage_adapter_memory(options)),
                    key = 'KEY',
                    value = 'VALUE',
                    update = 'UPDATE';

                storage.connect().then(function () {
                    return storage.get(key);
                }).then(function (result) {
                    expect(result).to.be(null);

                    return storage.set(key, value);
                }).then(function () {
                    return storage.get(key);
                }).then(function (result) {
                    expect(result).to.be(value);

                    return storage.set(key, update);
                }).then(function () {
                    return storage.get(key);
                }).then(function (result) {
                    expect(result).to.be(update);

                    return storage.remove(key);
                }).then(function () {
                    done();
                }).catch(done);
            });

            it('Callback', function (done) {
                const storage = karmia_storage(karmia_storage_adapter_memory(options)),
                    key = 'KEY',
                    value = 'VALUE',
                    update = 'UPDATE';

                storage.connect().then(function () {
                    return storage.get(key);
                }).then(function (result) {
                    expect(result).to.be(null);

                    return storage.set(key, value, function (error) {
                        if (error) {
                            return done(error);
                        }

                        storage.get(key).then(function (result) {
                            expect(result).to.be(value);

                            storage.set(key, update).then(function () {
                                storage.get(key, function (error, result) {
                                    if (error) {
                                        return done(error);
                                    }

                                    expect(result).to.be(update);

                                    storage.remove(key).then(function () {
                                        done();
                                    }).catch(done);
                                });
                            }).catch(done);
                        }).catch(done);
                    });
                }).catch(done);
            });
        });
    });

    describe('remove', function () {
        describe('Should remove value', function () {
            it('Promise', function (done) {
                const storage = karmia_storage(karmia_storage_adapter_memory(options)),
                    key = 'KEY',
                    value = 'VALUE';

                storage.connect().then(function () {
                    return storage.set(key, value);
                }).then(function () {
                    return storage.get(key);
                }).then(function (result) {
                    expect(result).to.be(value);

                    return storage.remove(key);
                }).then(function () {
                    return storage.get(key);
                }).then(function (result) {
                    expect(result).to.be(null);

                    done();
                }).catch(done);
            });

            it('Callbacck', function (done) {
                const storage = karmia_storage(karmia_storage_adapter_memory(options)),
                    key = 'KEY',
                    value = 'VALUE';

                storage.connect().then(function () {
                    return storage.set(key, value);
                }).then(function () {
                    return storage.get(key);
                }).then(function (result) {
                    expect(result).to.be(value);

                    storage.remove(key, function (error) {
                        if (error) {
                            return done(error);
                        }

                        storage.get(key).then(function (result) {
                            expect(result).to.be(null);

                            done();
                        }).catch(done);
                    });
                }).catch(done);
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

