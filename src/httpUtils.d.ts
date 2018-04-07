/// <reference types="node" />
import { Response } from "node-fetch";
import * as http from "http";
export declare function createAgent(baseUrl: string): http.Agent | undefined;
export declare function handleEmptyResponse(response: Response): Promise<void>;
export declare function handleJsonResponse(response: Response): Promise<any>;
export declare function handleTextResponse(response: Response): Promise<string | undefined>;
