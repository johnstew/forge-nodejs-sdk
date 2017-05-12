export declare function toCamel(o: any): any;
export declare class TimeoutError extends Error {
    readonly isTimeout: boolean;
    constructor(msg: string);
}
export declare function withTimeout(p: Promise<any>, ms: number): Promise<Promise<any> | Promise<{}>>;
