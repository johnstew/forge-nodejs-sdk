export declare class ForgeDistributionApi {
    URL: string;
    constructor(options: {
        url: string;
    });
    get(path: string, queryStringObject?: any): Promise<{}>;
    getStories(culture: string, queryStringObject?: any): Promise<{}>;
    getStory(culture: string, slug: string): Promise<{}>;
    getPhotos(culture: string, queryStringObject?: any): Promise<{}>;
    getPhoto(culture: string, slug: string): Promise<{}>;
    getTag(culture: string, slug: string): Promise<{}>;
    getDocument(culture: string, slug: string): Promise<{}>;
    getAlbum(culture: string, slug: string): Promise<{}>;
    getCustomEntity(culture: string, entityCode: string, slug: string): Promise<{}>;
    getSelection(culture: string, slug: string, queryStringObject?: any): Promise<{}>;
}
