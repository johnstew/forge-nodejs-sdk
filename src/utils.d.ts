import { Response } from "node-fetch";
export declare function toCamel(o: any): any;
export declare class TimeoutError extends Error {
    readonly isTimeout: boolean;
    constructor(msg: string);
}
export declare function withTimeout(p: Promise<any>, ms: number): Promise<any>;
export declare function handleEmptyResponse(response: Response): Promise<void>;
export declare function handleJsonResponse(response: Response): Promise<any>;
