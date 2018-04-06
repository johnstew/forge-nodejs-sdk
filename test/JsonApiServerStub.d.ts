/// <reference types="node" />
import * as http from "http";
export declare class JsonApiServerStub {
    lastCall?: {
        path: string;
        queryString: any;
        headers: any;
        method: string;
    };
    responseJsonStringify: boolean;
    response: any;
    responseStatusCode: number;
    responseHeaders: http.OutgoingHttpHeaders;
    private srv?;
    connect(port: number): Promise<{}>;
    disconnect(): Promise<{}>;
    resetCalls(): void;
}
