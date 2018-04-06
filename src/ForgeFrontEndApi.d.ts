export interface IForgeFrontEndApiOptions {
    url: string;
    authKey: string;
}
export declare class ForgeFrontEndApi {
    URL: string;
    KEY: string;
    constructor(options: IForgeFrontEndApiOptions);
    get(path: string, queryStringObject?: any): Promise<string | undefined>;
    getApi(path: string, queryStringObject?: any): Promise<any>;
    getData(dataPath: string): Promise<any>;
    getDataStories(): Promise<any>;
    getDataStory(slug: string): Promise<any>;
}
