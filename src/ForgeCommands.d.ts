export declare class CommandBase {
    readonly name: string;
    readonly bodyObject: any;
    constructor(name: string, cmd: any);
    id(): any;
}
export declare class Batch extends CommandBase {
    constructor(cmd: any);
}
export declare class CreateStory extends CommandBase {
    constructor(cmd: any);
}
export declare class SetPublicAvailability extends CommandBase {
    constructor(cmd: {
        commandId?: string;
        aggregateId: string;
        aggregateType: string;
    });
}
export declare class SetUnlistedAvailability extends CommandBase {
    constructor(cmd: {
        commandId?: string;
        aggregateId: string;
        aggregateType: string;
    });
}
export declare class CreatePhoto extends CommandBase {
    constructor(cmd: any);
}
export declare class CreateDocument extends CommandBase {
    constructor(cmd: any);
}
export declare class CreateCustomEntity extends CommandBase {
    constructor(cmd: any);
}
export declare class CreateTag extends CommandBase {
    constructor(cmd: any);
}
export declare class CreateExternalTag extends CommandBase {
    constructor(cmd: any);
}
export declare class CreateCustomEntityTag extends CommandBase {
    constructor(cmd: any);
}
export declare class CreateAlbum extends CommandBase {
    constructor(cmd: any);
}
export declare class CreateSelection extends CommandBase {
    constructor(cmd?: {
        selectionId?: string;
        translationId?: string;
    });
}
export declare class SetSelectionMaxItems extends CommandBase {
    constructor(cmd: {
        selectionId: string;
        maxItems: number;
        commandId?: string;
    });
}
export declare class AddSelectionEntityTypes extends CommandBase {
    constructor(cmd: {
        selectionId: string;
        entityTypes: string[];
        commandId?: string;
    });
}
export declare class RemoveSelectionEntityTypes extends CommandBase {
    constructor(cmd: {
        selectionId: string;
        entityTypes: string[];
        commandId?: string;
    });
}
export declare class SetTitle extends CommandBase {
    constructor(cmd: any);
}
export declare class SetSlug extends CommandBase {
    constructor(cmd: any);
}
export declare class SetDescription extends CommandBase {
    constructor(cmd: any);
}
export declare class SetContentDate extends CommandBase {
    constructor(cmd: any);
}
export declare class SetThumbnail extends CommandBase {
    constructor(cmd: any);
}
export declare class UnsetThumbnail extends CommandBase {
    constructor(cmd: any);
}
export declare class SetContext extends CommandBase {
    constructor(cmd: any);
}
export declare class UnsetContext extends CommandBase {
    constructor(cmd: any);
}
export declare class AddAlbumItems extends CommandBase {
    constructor(cmd: any);
}
export declare class AddSelectionItems extends CommandBase {
    constructor(cmd: any);
}
export declare class DeleteAlbumItems extends CommandBase {
    constructor(cmd: any);
}
export declare class MoveAlbumItem extends CommandBase {
    constructor(cmd: any);
}
export declare class Publish extends CommandBase {
    constructor(cmd: any);
}
export declare class Unpublish extends CommandBase {
    constructor(cmd: any);
}
export declare class Archive extends CommandBase {
    constructor(cmd: any);
}
export declare class AddStoryPart extends CommandBase {
    constructor(cmd: any);
}
export declare class SetStoryHeadline extends CommandBase {
    constructor(cmd: any);
}
export declare class SetExtendedFields extends CommandBase {
    constructor(cmd: any);
}
export declare class SetWorkflowFields extends CommandBase {
    constructor(cmd: any);
}
export declare class SetFeatured extends CommandBase {
    constructor(cmd: any);
}
export declare class SetFile extends CommandBase {
    constructor(cmd: any);
}
export declare class SetStoryPartExtendedFields extends CommandBase {
    constructor(cmd: any);
}
export declare class AddEntityRelation extends CommandBase {
    constructor(cmd: any);
}
export declare class RemoveEntityRelation extends CommandBase {
    constructor(cmd: any);
}
export declare class MoveEntityRelation extends CommandBase {
    constructor(cmd: any);
}
export declare class SetPhotoCropArea extends CommandBase {
    constructor(cmd: any);
}
export declare class UnsetPhotoCropArea extends CommandBase {
    constructor(cmd: any);
}
export declare class SetPhotoGravity extends CommandBase {
    constructor(cmd: any);
}
export declare class UnsetPhotoGravity extends CommandBase {
    constructor(cmd: any);
}
export declare class ExtractPhotoMetadata extends CommandBase {
    constructor(cmd: any);
}
export declare class AddReferenceFieldItems extends CommandBase {
    constructor(cmd: {
        aggregateId: string;
        aggregateType: string;
        translationId: string;
        fieldName: string;
        referenceItem: Array<{
            entityId: string;
            entityType: string;
        }>;
    });
}
export declare class RemoveReferenceFieldItems extends CommandBase {
    constructor(cmd: {
        aggregateId: string;
        aggregateType: string;
        translationId: string;
        fieldName: string;
        referenceItem: Array<{
            entityId: string;
            entityType: string;
        }>;
    });
}
export declare class ResetReferenceField extends CommandBase {
    constructor(cmd: {
        aggregateId: string;
        aggregateType: string;
        translationId: string;
        fieldName: string;
    });
}
export declare class MoveReferenceFieldItem extends CommandBase {
    constructor(cmd: {
        aggregateId: string;
        aggregateType: string;
        translationId: string;
        fieldName: string;
        startPosition: number;
        endPosition: number;
    });
}
export declare class AddTranslation extends CommandBase {
    constructor(cmd: any);
}
export declare class RemoveTranslation extends CommandBase {
    constructor(cmd: any);
}
export declare class SetTranslationVisibility extends CommandBase {
    constructor(cmd: any);
}
export declare class ImportFeeds extends CommandBase {
    constructor(cmd: any);
}
export declare class UploadPhoto extends CommandBase {
    constructor(cmd: any);
}
export declare class UploadDocument extends CommandBase {
    constructor(cmd: any);
}
export declare class AddSitePage extends CommandBase {
    constructor(cmd: any);
}
export declare class AddSiteMenu extends CommandBase {
    constructor(cmd: any);
}
export declare class AddMenuItem extends CommandBase {
    constructor(cmd: any);
}
export declare class AddVariablesToMenu extends CommandBase {
    constructor(cmd: any);
}
export declare class PublishMenu extends CommandBase {
    constructor(cmd: any);
}
export declare class PublishPage extends CommandBase {
    constructor(cmd: any);
}
export declare class PublishDirectory extends CommandBase {
    constructor(cmd: any);
}
export declare class ChangePageTemplate extends CommandBase {
    constructor(cmd: any);
}
export declare class RemoveSitePage extends CommandBase {
    constructor(cmd: any);
}
export declare class RemoveSiteMenu extends CommandBase {
    constructor(cmd: any);
}
export declare class RemoveSiteDirectory extends CommandBase {
    constructor(cmd: any);
}
export declare class AddLayoutToSlot extends CommandBase {
    constructor(cmd: any);
}
export declare class AddModuleToSlot extends CommandBase {
    constructor(cmd: any);
}
export declare class AddVariablesToPage extends CommandBase {
    constructor(cmd: any);
}
export declare class AddVariablesToDirectory extends CommandBase {
    constructor(cmd: any);
}
export declare class DeletePageVariables extends CommandBase {
    constructor(cmd: any);
}
export declare class DeleteDirectoryVariables extends CommandBase {
    constructor(cmd: any);
}
export declare class DeleteMenuVariables extends CommandBase {
    constructor(cmd: any);
}
export declare class SetLayoutProperties extends CommandBase {
    constructor(cmd: any);
}
export declare class SetModuleProperties extends CommandBase {
    constructor(cmd: any);
}
export declare class RemoveLinkRuleFromPage extends CommandBase {
    constructor(cmd: any);
}
export declare class CreateLinkRuleForPage extends CommandBase {
    constructor(cmd: any);
}
export declare class GenerateDiff extends CommandBase {
    constructor(cmd: any);
}
export declare class Rollback extends CommandBase {
    constructor(cmd: any);
}
export declare class CreateCheckpoint extends CommandBase {
    constructor(cmd: any);
}
export declare class DeleteCheckpoint extends CommandBase {
    constructor(cmd: any);
}
export declare class RestoreCheckpoint extends CommandBase {
    constructor(cmd: any);
}
export declare class ImportNode extends CommandBase {
    constructor(cmd: any);
}
export declare class ExportNode extends CommandBase {
    constructor(cmd: {
        path: string;
        exportId: string;
        description?: string;
    });
}
export declare class SetContextualFields extends CommandBase {
    constructor(cmd: {
        commandId?: string;
        aggregateId: string;
        aggregateType: string;
        translationId: string;
        elementId: string;
        contextualFields: any;
    });
}
export declare class UnsetContextualFields extends CommandBase {
    constructor(cmd: {
        commandId?: string;
        aggregateId: string;
        aggregateType: string;
        translationId: string;
        elementId: string;
        contextualFieldNames: any;
    });
}
export declare class EnsureTag extends CommandBase {
    constructor(cmd: {
        slug: string;
    });
}
