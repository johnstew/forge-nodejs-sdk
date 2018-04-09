import { ForgeNotificationBus } from "./ForgeNotificationBus";
import * as ForgeCommands from "./ForgeCommands";
export interface IForgeManagementApiOptions {
    authKey: string;
    url: string;
    userAgent?: string;
}
export declare class ForgeManagementApi {
    KEY: string;
    FORGE_URL: string;
    notificationBus: ForgeNotificationBus | undefined;
    defaultHeaders: {
        [name: string]: string;
    };
    private httpAgent?;
    constructor(options: IForgeManagementApiOptions);
    post(cmd: ForgeCommands.CommandBase | ForgeCommands.CommandBase[], waitTimeout?: number): Promise<any>;
    postAndWaitAck(cmd: ForgeCommands.CommandBase | ForgeCommands.CommandBase[], waitTimeout?: number): Promise<CommandNotificationAcknowledgement>;
    autoWaitCommandNotification(notificationBus: ForgeNotificationBus): void;
    get(path: string, queryStringObject?: any): Promise<any>;
    getEvents(bucketId: string, options: {
        from?: any;
        skip?: any;
        limit?: any;
    }): Promise<any>;
    getCommits(bucketId: string, options: any): Promise<any>;
    getEventsByAggregateId(bucketId: string, aggregateId: string, options: any): Promise<any>;
    getStories(version: string, options: any): Promise<any>;
    getStory(version: string, translationId: string): Promise<any>;
    getStoryByCultureSlug(version: string, culture: string, slug: string): Promise<any>;
    getPhotos(version: string, options: any): Promise<any>;
    getPhoto(version: string, translationId: string): Promise<any>;
    getPhotoByCultureSlug(version: string, culture: string, slug: string): Promise<any>;
    getPhotoTranslations(version: string, entityId: string): Promise<any>;
    getTags(version: string, options: any): Promise<any>;
    getTag(version: string, translationId: string): Promise<any>;
    getTagByCultureSlug(version: string, culture: string, slug: string, mode?: AssemblerMode): Promise<any>;
    getTagTranslations(version: string, entityId: string): Promise<any>;
    getTagsByVersionAndEntityIds(version: string, entityIds: string[]): Promise<any>;
    getDocuments(version: string, options: any): Promise<any>;
    getDocument(version: string, translationId: string): Promise<any>;
    getDocumentByCultureSlug(version: string, culture: string, slug: string): Promise<any>;
    getDocumentTranslations(version: string, entityId: string): Promise<any>;
    getSelections(version: string, options: any): Promise<any>;
    getSelection(version: string, translationId: string): Promise<any>;
    getSelectionByCultureSlug(version: string, culture: string, slug: string): Promise<any>;
    getSelectionTranslations(version: string, entityId: string): Promise<any>;
    getAlbum(version: string, translationId: string): Promise<any>;
    getAlbumByCultureSlug(version: string, culture: string, slug: string): Promise<any>;
    getAlbumTranslations(version: string, entityId: string): Promise<any>;
    getAlbums(version: string, options: any): Promise<any>;
    getCustomEntity(entityCode: string, version: string, translationId: string): Promise<any>;
    getCustomEntityTranslations(entityCode: string, version: string, entityId: string): Promise<any>;
    getCustomEntityBySlug(entityCode: string, version: string, culture: string, slug: string): Promise<any>;
    getCustomEntities(entityCode: string, version: string, options: any): Promise<any>;
    getCheckpoints(bucketId: string): Promise<any>;
    getPage(pageId: string): Promise<any>;
    uuid(): string;
    randomSlug(): string;
    getAlbumContextualFieldsForElement(entityId: string, elementId: string): Promise<any>;
    slugify(values: string[]): Promise<ISlugificationResult[]>;
    private createCmdPostOptions(cmd);
}
export interface ISlugificationResult {
    OriginalValue: string;
    SlugifiedValue: string | null;
}
export declare enum AssemblerMode {
    Full = 0,
    Compact = 1,
}
export interface CommandNotificationAcknowledgement {
    Success: boolean;
    Message?: string;
}
