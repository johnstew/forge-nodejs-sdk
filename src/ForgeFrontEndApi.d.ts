export interface IForgeFrontEndApiOptions {
    url: string;
    authKey: string;
}
export declare class ForgeFrontEndApi {
    URL: string;
    KEY: string;
    constructor(options: IForgeFrontEndApiOptions);
    get(path: string, questyStringObject?: any): Promise<{}>;
    getApi(path: string, questyStringObject?: any): Promise<{}>;
    getData(dataPath: string): Promise<{}>;
    getDataStories(): Promise<{}>;
    getDataStory(slug: string): Promise<{}>;
}
