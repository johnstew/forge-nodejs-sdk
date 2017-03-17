export declare class ForgeFrontEndApi {
    URL: string;
    KEY: string;
    constructor(options: {
        url: string;
        authKey: string;
    });
    get(path: string, questyStringObject?: any): Promise<{}>;
    getApi(path: string, questyStringObject?: any): Promise<{}>;
    getData(dataPath: string): Promise<{}>;
    getDataStories(): Promise<{}>;
    getDataStory(slug: any): Promise<{}>;
}
