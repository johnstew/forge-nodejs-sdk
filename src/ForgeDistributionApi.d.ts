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
    private httpAgent?;
    constructor(options: IForgeDistributionApiOptions);
    get(path: string, queryStringObject?: any): Promise<any>;
    getStories(culture: string, queryStringObject?: DistributionQueryString): Promise<DistributionList<DistributionEntity>>;
    getStory(culture: string, slug: string): Promise<DistributionEntity>;
    getPhotos(culture: string, queryStringObject?: DistributionQueryString): Promise<DistributionList<DistributionEntity>>;
    getPhoto(culture: string, slug: string): Promise<DistributionEntity>;
    getTags(culture: string, queryStringObject?: DistributionQueryString): Promise<DistributionList<DistributionEntity>>;
    getTag(culture: string, slug: string): Promise<DistributionEntity>;
    getDocuments(culture: string, queryStringObject?: DistributionQueryString): Promise<DistributionList<DistributionEntity>>;
    getDocument(culture: string, slug: string): Promise<DistributionEntity>;
    getAlbums(culture: string, queryStringObject?: DistributionQueryString): Promise<DistributionList<DistributionEntity>>;
    getAlbum(culture: string, slug: string): Promise<DistributionEntity>;
    getCustomEntities(culture: string, entityCode: string, queryStringObject?: DistributionQueryString): Promise<DistributionList<DistributionEntity>>;
    getCustomEntity(culture: string, entityCode: string, slug: string): Promise<DistributionEntity>;
    getSelection(culture: string, slug: string, queryStringObject?: DistributionQueryString): Promise<DistributionList<DistributionEntity>>;
}
export interface DistributionEntity {
    title: string;
    slug: string;
    [name: string]: any;
}
export interface DistributionQueryString {
    [name: string]: string | undefined;
}
export interface DistributionList<T> {
    items: T[];
}
