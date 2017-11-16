export declare enum ReadSource {
    Default = "Default",
    Primary = "Primary",
}
export interface IForgeDistributionApiOptions {
    url: string;
    version?: string;
    readSource?: ReadSource;
}
export declare class ForgeDistributionApi {
    URL: string;
    version: string;
    readSource: ReadSource;
    constructor(options: IForgeDistributionApiOptions);
    get(path: string, queryStringObject?: any): Promise<{}>;
    getStories(culture: string, queryStringObject?: any): Promise<{}>;
    getStory(culture: string, slug: string): Promise<{}>;
    getPhotos(culture: string, queryStringObject?: any): Promise<{}>;
    getPhoto(culture: string, slug: string): Promise<{}>;
    getTags(culture: string, queryStringObject?: any): Promise<{}>;
    getTag(culture: string, slug: string): Promise<{}>;
    getDocuments(culture: string, queryStringObject?: any): Promise<{}>;
    getDocument(culture: string, slug: string): Promise<{}>;
    getAlbums(culture: string, queryStringObject?: any): Promise<{}>;
    getAlbum(culture: string, slug: string): Promise<{}>;
    getCustomEntities(culture: string, entityCode: string, queryStringObject?: any): Promise<{}>;
    getCustomEntity(culture: string, entityCode: string, slug: string): Promise<{}>;
    getSelection(culture: string, slug: string, queryStringObject?: any): Promise<{}>;
}
