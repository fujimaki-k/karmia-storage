/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/*jslint node: true, nomen: true */
/*global beforeEach, describe, it */
'use strict';



// Import modules
import KarmiaStorageAdapterMemory = require("karmia-storage-adapter-memory");
import KarmiaStorage = require("../");
import Fixture = require("./resources/fixture");


// Variables
const expect = require("expect.js");
const options = {};


describe('karmia-storage', function () {
    describe('getConnection', function () {
        it('Should not get connection', function (done) {
            const storage = new KarmiaStorage(new KarmiaStorageAdapterMemory(options));
            expect(storage.getConnection()).to.be(undefined);

            done();
        });

        it('Should get connection', function (done) {
            const storage = new KarmiaStorage(new KarmiaStorageAdapterMemory(options));
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
                const storage = new KarmiaStorage(new KarmiaStorageAdapterMemory(options));
                storage.connect().then(function () {
                    const connection = storage.getConnection();
                    expect(connection.constructor.name).to.be('KarmiaStorageAdapterMemory');

                    done();
                }).catch(function (error) {
                    done(error);
                });
            });

            it('Callback', function (done) {
                const storage = new KarmiaStorage(new KarmiaStorageAdapterMemory(options));
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
                    const storage = new KarmiaStorage(new KarmiaStorageAdapterMemory(options));
                    storage.connect().then(function () {
                        return storage.disconnect();
                    }).then(function (result) {
                        expect(result).to.be(undefined);

                        done();
                    }).catch(done);
                });

                it('Callback', function (done) {
                    const storage = new KarmiaStorage(new KarmiaStorageAdapterMemory(options));
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
                    const storage = new KarmiaStorage(new KarmiaStorageAdapterMemory(options));
                    storage.disconnect().then(function (result) {
                        expect(result).to.be(undefined);

                        done();
                    }).catch(done);
                });

                it('Callback', function (done) {
                    const storage = new KarmiaStorage(new KarmiaStorageAdapterMemory(options));
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

    describe('storage', function () {
        const storages = new KarmiaStorage(new KarmiaStorageAdapterMemory(options)),
            name = 'user';

        before(function (done) {
            storages.connect().then(function () {
                const storage = storages.storage(name);

                return Fixture.reduce(function (promise, data) {
                    return promise.then(function () {
                        storage.set(data.key, data.value);
                    });
                }, Promise.resolve());
            }).then(function () {
                return done();
            }).catch(done);
        });

        after(function (done) {
            storages.adapter = new KarmiaStorageAdapterMemory(options);

            done();
        });

        describe('count', function () {
            describe('Should count items', function () {
                it('Promise', function (done) {
                    const storage = storages.storage(name);
                    storage.count().then(function (result) {
                        expect(result).to.be(9);

                        done();
                    }).catch(done);
                });

                it('Callback', function (done) {
                    const storage = storages.storage(name);
                    storage.count(function (error, result) {
                        if (error) {
                            return done(error);
                        }

                        expect(result).to.be(9);

                        done();
                    });
                });
            });
        });

        describe('get', function () {
            it('Promise', function (done) {
                const storage = storages.storage(name),
                    data = Fixture[0];
                storage.get(data.key).then(function (result) {
                    expect(result).to.be(data.value);

                    done();
                }).catch(done);
            });

            it('Callback', function (done) {
                const storage = storages.storage(name),
                    data = Fixture[0];
                storage.get(data.key, function (error, result) {
                    if (error) {
                        return done(error);
                    }

                    expect(result).to.be(data.value);

                    done();
                });
            });
        });

        describe('set', function () {
            it('Promise', function (done) {
                const storage = storages.storage(name),
                    key = 10,
                    value = 'Yukiho Kosaka';

                storage.get(key).then(function (result) {
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
                const storage = storages.storage(name),
                    key = 10,
                    value = 'Yukiho Kosaka';

                storage.get(key, function (error, result) {
                    if (error) {
                        return done(error);
                    }

                    expect(result).to.be(null);

                    storage.set(key, value, function (error) {
                        if (error) {
                            return done(error);
                        }

                        storage.get(key, function (error, result) {
                            if (error) {
                                return done(error);
                            }

                            expect(result).to.be(value);

                            storage.remove(key, done);
                        })
                    });
                });
            });
        });

        describe('remove', function () {
            it('Promise', function (done) {
                const storage = storages.storage(name),
                    key = 10,
                    value = 'Yukiho Kosaka';

                storage.set(key, value).then(function () {
                    return storage.get(key);
                }).then(function (result) {
                    expect(result).to.be(value);

                    return storage.remove(key);
                }).then(function (result) {
                    expect(result).to.be(undefined);

                    return storage.get(key);
                }).then(function (result) {
                    expect(result).to.be(null);

                    done();
                })
            });

            it('Callback', function (done) {
                const storage = storages.storage(name),
                    key = 10,
                    value = 'Yukiho Kosaka';

                storage.set(key, value, function (error) {
                    if (error) {
                        return done(error);
                    }

                    storage.get(key, function (error, result) {
                        if (error) {
                            return done(error);
                        }

                        expect(result).to.be(value);

                        storage.remove(key, function (error, result) {
                            if (error) {
                                return done(error);
                            }

                            expect(result).to.be(result);

                            storage.get(key, function (error, result) {
                                if (error) {
                                    return done(error);
                                }

                                expect(result).to.be(null);

                                done();
                            });
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
