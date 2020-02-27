export type IResolveFn<T> = {
    (value?: T | PromiseLike<T>): void
}

export type IRejectFn<T> = {
    (reason?: any): void
}

/**
 * Provides a defered object
 */
export type IDeferred<T> = {
    resolve(value?: T|Promise<T>): void;
    reject(reason?: any): void;
    promise: Promise<T>;
}

export const getDefer = () => {
    const deferred: {[param: string]: Promise<any>|Function} = {};
    deferred.promise = new Promise((resolve: IResolveFn<any>, reject: IRejectFn<any>) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });
    return <IDeferred<any>>deferred;
};
