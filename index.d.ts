declare interface KarmiaStorageAdapterStorageInterface {
    store(key: any, value: any, callback?: (error: Error, result: any) => void): Promise<any>;
    count(callback?: (error: Error, result: any) => void): Promise<any>;
    has(key: any, callback?: (error: Error, result: any) => void): Promise<any>;
    get(key: any, callback?: (error: Error, result: any) => void): Promise<any>;
    set(key: any, value: any, callback?: (error: Error, result: any) => void): Promise<any>;
    remove(key: any, callback?: (error: Error, result: any) => void): Promise<any>;
}

declare interface KarmiaStorageAdapterInterface {
    getConnection():object;
    connect(callback?: (error: Error, result: any) => void): Promise<any>;
    disconnect(callback?: (error: Error, result: any) => void): Promise<any>;
    storage(name: string, options?: object): KarmiaStorageAdapterStorageInterface;
}

declare class KarmiaStorage {
    adapter: KarmiaStorageAdapterInterface;

    constructor(adapter: KarmiaStorageAdapterInterface);
    getConnection(): object;
    connect(callback?: (error: Error, result: any) => void): Promise<any>;
    disconnect(callback?: (error: Error, result: any) => void): Promise<any>;
    storage(name: string, options?: object): KarmiaStorageAdapterStorageInterface;
}

export = KarmiaStorage;
