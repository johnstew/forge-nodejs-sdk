export interface IForgeFrontEndApiOptions {
    url: string;
    authKey: string;
}
export declare class ForgeFrontEndApi {
    URL: string;
    KEY: string;
    private httpAgent?;
    constructor(options: IForgeFrontEndApiOptions);
    get(path: string, queryStringObject?: any): any;
    getApi(path: string, queryStringObject?: any): any;
    getData(dataPath: string): any;
    getDataStories(): any;
    getDataStory(slug: string): any;
}
