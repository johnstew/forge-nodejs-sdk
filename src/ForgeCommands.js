"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
class CommandBase {
    constructor(name, cmd) {
        cmd.commandId = cmd.commandId || uuid.v4();
        this.name = name;
        this.bodyObject = cmd;
    }
    id() {
        return this.bodyObject.commandId;
    }
}
exports.CommandBase = CommandBase;
class Batch extends CommandBase {
    // {commands}
    constructor(cmd) {
        if (!cmd.commands) {
            throw new Error("Invalid commands");
        }
        super("BatchCommand", cmd);
    }
}
exports.Batch = Batch;
// WCM
class CreateStory extends CommandBase {
    // {storyId, translationId, translationInfo}
    constructor(cmd) {
        cmd.storyId = cmd.storyId || uuid.v4();
        cmd.translationId = cmd.translationId || uuid.v4();
        if (!cmd.translationInfo)
            throw new Error("Invalid translationInfo");
        cmd.translationInfo.platform = cmd.translationInfo.platform || "default";
        super("CreateStoryCommand", cmd);
    }
}
exports.CreateStory = CreateStory;
class CreatePhoto extends CommandBase {
    // {photoId, translationId, storagePath, originalFileName}
    constructor(cmd) {
        cmd.photoId = cmd.photoId || uuid.v4();
        cmd.translationId = cmd.translationId || uuid.v4();
        super("CreatePhotoCommand", cmd);
    }
}
exports.CreatePhoto = CreatePhoto;
class CreateDocument extends CommandBase {
    // {documentId, translationId, storagePath, originalFileName}
    constructor(cmd) {
        cmd.documentId = cmd.documentId || uuid.v4();
        cmd.translationId = cmd.translationId || uuid.v4();
        super("CreateDocumentCommand", cmd);
    }
}
exports.CreateDocument = CreateDocument;
class CreateCustomEntity extends CommandBase {
    //{entityId, translationId, entityCode}
    constructor(cmd) {
        cmd.entityId = cmd.entityId || uuid.v4();
        cmd.translationId = cmd.translationId || uuid.v4();
        super("CreateCustomEntityCommand", cmd);
    }
}
exports.CreateCustomEntity = CreateCustomEntity;
class CreateTag extends CommandBase {
    // {tagId, translationId, title, [slug]}
    constructor(cmd) {
        cmd.tagId = cmd.tagId || uuid.v4();
        cmd.translationId = cmd.translationId || uuid.v4();
        super("CreateTagCommand", cmd);
    }
}
exports.CreateTag = CreateTag;
class CreateExternalTag extends CommandBase {
    // {tagId, translationId, title, [slug], dataSourceId, dataSourceName}
    constructor(cmd) {
        cmd.tagId = cmd.tagId || uuid.v4();
        cmd.translationId = cmd.translationId || uuid.v4();
        super("CreateExternalTagCommand", cmd);
    }
}
exports.CreateExternalTag = CreateExternalTag;
class CreateCustomEntityTag extends CommandBase {
    // {tagId, translationId, title, [slug], entityTranslationId, entityCode}
    constructor(cmd) {
        cmd.tagId = cmd.tagId || uuid.v4();
        cmd.translationId = cmd.translationId || uuid.v4();
        super("CreateCustomEntityTagCommand", cmd);
    }
}
exports.CreateCustomEntityTag = CreateCustomEntityTag;
class CreateAlbum extends CommandBase {
    // {albumId, translationId}
    constructor(cmd) {
        cmd = cmd || {};
        cmd.albumId = cmd.albumId || uuid.v4();
        cmd.translationId = cmd.translationId || uuid.v4();
        super("CreateAlbumCommand", cmd);
    }
}
exports.CreateAlbum = CreateAlbum;
class CreateSelection extends CommandBase {
    // {selectionId, translationId}
    constructor(cmd) {
        cmd = cmd || {};
        cmd.selectionId = cmd.selectionId || uuid.v4();
        cmd.translationId = cmd.translationId || uuid.v4();
        super("CreateSelectionCommand", cmd);
    }
}
exports.CreateSelection = CreateSelection;
class SetTitle extends CommandBase {
    // {aggregateId, aggregateType, translationId, title}
    constructor(cmd) {
        super("SetTitleCommand", cmd);
    }
}
exports.SetTitle = SetTitle;
class SetSlug extends CommandBase {
    // {aggregateId, aggregateType, translationId, slug}
    constructor(cmd) {
        super("SetSlugCommand", cmd);
    }
}
exports.SetSlug = SetSlug;
class SetDescription extends CommandBase {
    // {aggregateId, aggregateType, translationId, description (markdown)}
    constructor(cmd) {
        super("SetDescriptionCommand", cmd);
    }
}
exports.SetDescription = SetDescription;
class SetContentDate extends CommandBase {
    // {aggregateId, aggregateType, translationId, contentDate (string as json date)}
    constructor(cmd) {
        super("SetContentDateCommand", cmd);
    }
}
exports.SetContentDate = SetContentDate;
class SetThumbnail extends CommandBase {
    // {aggregateId, aggregateType, photoId}
    constructor(cmd) {
        super("SetThumbnailCommand", cmd);
    }
}
exports.SetThumbnail = SetThumbnail;
class UnsetThumbnail extends CommandBase {
    // {aggregateId, aggregateType}
    constructor(cmd) {
        super("UnsetThumbnailCommand", cmd);
    }
}
exports.UnsetThumbnail = UnsetThumbnail;
class SetContext extends CommandBase {
    // {aggregateId, aggregateType, relatedItem}
    constructor(cmd) {
        super("SetContextCommand", cmd);
    }
}
exports.SetContext = SetContext;
class UnsetContext extends CommandBase {
    // {aggregateId, aggregateType}
    constructor(cmd) {
        super("UnsetContextCommand", cmd);
    }
}
exports.UnsetContext = UnsetContext;
class AddAlbumItems extends CommandBase {
    //{albumId, items {id, elementType, element { entityId } } , position}
    constructor(cmd) {
        cmd.position = cmd.position || 9999;
        super("AddAlbumItemsCommand", cmd);
    }
}
exports.AddAlbumItems = AddAlbumItems;
class AddSelectionItems extends CommandBase {
    //{selectionId, items {id, elementType, element { entityId } } , position}
    constructor(cmd) {
        cmd.position = cmd.position || 9999;
        super("AddSelectionItemsCommand", cmd);
    }
}
exports.AddSelectionItems = AddSelectionItems;
class DeleteAlbumItems extends CommandBase {
    //{albumId, albumItemIds}
    constructor(cmd) {
        super("DeleteAlbumItemsCommand", cmd);
    }
}
exports.DeleteAlbumItems = DeleteAlbumItems;
class MoveAlbumItem extends CommandBase {
    //{albumId, albumItemId, position}
    constructor(cmd) {
        super("MoveAlbumItemCommand", cmd);
    }
}
exports.MoveAlbumItem = MoveAlbumItem;
class Publish extends CommandBase {
    //{aggregateId, aggregateType, translationId}
    constructor(cmd) {
        super("PublishCommand", cmd);
    }
}
exports.Publish = Publish;
class Unpublish extends CommandBase {
    //{aggregateId, aggregateType, translationId}
    constructor(cmd) {
        super("UnpublishCommand", cmd);
    }
}
exports.Unpublish = Unpublish;
class Archive extends CommandBase {
    //{aggregateId, aggregateType, translationId}
    constructor(cmd) {
        super("ArchiveCommand", cmd);
    }
}
exports.Archive = Archive;
class AddStoryPart extends CommandBase {
    // cmd: {storyId, translationId, position, storyPart: {partType, partBody, partId} }
    constructor(cmd) {
        cmd.storyPart.partBodyJson = JSON.stringify(cmd.storyPart.partBody);
        delete cmd.storyPart.partBody;
        cmd.storyPart.partId = cmd.storyPart.partId || uuid.v4();
        super("AddStoryPartCommand", cmd);
    }
}
exports.AddStoryPart = AddStoryPart;
class SetStoryHeadline extends CommandBase {
    // cmd: {storyId, translationId, headline}
    constructor(cmd) {
        super("SetStoryHeadlineCommand", cmd);
    }
}
exports.SetStoryHeadline = SetStoryHeadline;
class SetExtendedFields extends CommandBase {
    // cmd: {aggregateId, aggregateType, translationId, values}
    constructor(cmd) {
        super("SetExtendedFieldsCommand", cmd);
    }
}
exports.SetExtendedFields = SetExtendedFields;
class SetWorkflowFields extends CommandBase {
    // cmd: {values, aggregateId, aggregateType, translationId?, workflowName}
    constructor(cmd) {
        super("SetWorkflowFieldsCommand", cmd);
    }
}
exports.SetWorkflowFields = SetWorkflowFields;
class SetFeatured extends CommandBase {
    // cmd: {aggregateId, aggregateType, featured}
    constructor(cmd) {
        super("SetFeaturedCommand", cmd);
    }
}
exports.SetFeatured = SetFeatured;
class SetFile extends CommandBase {
    // cmd: {aggregateId, aggregateType, translationId, storagePath, originalFileName}
    constructor(cmd) {
        super("SetFileCommand", cmd);
    }
}
exports.SetFile = SetFile;
class SetStoryPartExtendedFields extends CommandBase {
    // cmd: {storyId, translationId, partId, values }
    constructor(cmd) {
        super("SetStoryPartExtendedFieldsCommand", cmd);
    }
}
exports.SetStoryPartExtendedFields = SetStoryPartExtendedFields;
class AddEntityRelation extends CommandBase {
    // cmd: { aggregateId, aggregateType, relatedItem { entityType, entityId } }
    constructor(cmd) {
        super("AddEntityRelationCommand", cmd);
    }
}
exports.AddEntityRelation = AddEntityRelation;
class RemoveEntityRelation extends CommandBase {
    // cmd: { aggregateId, aggregateType, relatedItem { entityType, entityId } }
    constructor(cmd) {
        super("AddEntityRelationCommand", cmd);
    }
}
exports.RemoveEntityRelation = RemoveEntityRelation;
class MoveEntityRelation extends CommandBase {
    // cmd: { aggregateId, aggregateType, relatedItem { entityType, entityId }, position }
    constructor(cmd) {
        super("MoveEntityRelationCommand", cmd);
    }
}
exports.MoveEntityRelation = MoveEntityRelation;
class SetPhotoCropArea extends CommandBase {
    // cmd: { photoId, format, formatProperty { crop { x, y, height, width } } }
    constructor(cmd) {
        super("SetPhotoCropAreaCommand", cmd);
    }
}
exports.SetPhotoCropArea = SetPhotoCropArea;
class UnsetPhotoCropArea extends CommandBase {
    // cmd: { aggregateId, format }
    constructor(cmd) {
        super("UnsetPhotoCropAreaCommand", cmd);
    }
}
exports.UnsetPhotoCropArea = UnsetPhotoCropArea;
class SetPhotoGravity extends CommandBase {
    // cmd: { photoId, crop { x, y, height, width } }
    constructor(cmd) {
        super("SetPhotoGravityCommand", cmd);
    }
}
exports.SetPhotoGravity = SetPhotoGravity;
class UnsetPhotoGravity extends CommandBase {
    // cmd: { aggregateId }
    constructor(cmd) {
        super("UnsetPhotoGravityCommand", cmd);
    }
}
exports.UnsetPhotoGravity = UnsetPhotoGravity;
class ExtractPhotoMetadata extends CommandBase {
    // cmd: { aggregateId }
    constructor(cmd) {
        super("ExtractPhotoMetadataCommand", cmd);
    }
}
exports.ExtractPhotoMetadata = ExtractPhotoMetadata;
class AddTranslation extends CommandBase {
    // cmd: { aggregateId, aggregateType, translationId, translationInfo, [cloneFromTranslationId] }
    constructor(cmd) {
        cmd.translationId = cmd.translationId || uuid.v4();
        if (!cmd.translationInfo)
            throw new Error("Invalid translationInfo");
        cmd.translationInfo.platform = cmd.translationInfo.platform || "default";
        super("AddTranslationCommand", cmd);
    }
}
exports.AddTranslation = AddTranslation;
class RemoveTranslation extends CommandBase {
    // cmd: { aggregateId, aggregateType, translationId }
    constructor(cmd) {
        super("RemoveTranslationCommand", cmd);
    }
}
exports.RemoveTranslation = RemoveTranslation;
class SetTranslationVisibility extends CommandBase {
    // cmd: { aggregateId, aggregateType, translationId, visibility }
    constructor(cmd) {
        if (!cmd.visibility)
            throw new Error("Invalid visibility");
        super("SetTranslationVisibilityCommand", cmd);
    }
}
exports.SetTranslationVisibility = SetTranslationVisibility;
class ImportFeeds extends CommandBase {
    // cmd: { items : [ {id, sourceName}, {id, sourceName}, ... ] }
    constructor(cmd) {
        super("ImportFeedsCommand", cmd);
    }
}
exports.ImportFeeds = ImportFeeds;
class UploadPhoto extends CommandBase {
    // cmd: { photoId, translationId, sourceUrl, [title], [slug] }
    constructor(cmd) {
        super("UploadPhotoCommand", cmd);
    }
}
exports.UploadPhoto = UploadPhoto;
class UploadDocument extends CommandBase {
    // cmd: { documentId, translationId, sourceUrl, [title], [slug] }
    constructor(cmd) {
        super("UploadDocumentCommand", cmd);
    }
}
exports.UploadDocument = UploadDocument;
// VSM
class AddSitePage extends CommandBase {
    // cmd: {path}
    //  notification: SitePageAddedNotification {itemId}
    constructor(cmd) {
        super("AddSitePageCommand", cmd);
    }
}
exports.AddSitePage = AddSitePage;
class AddSiteMenu extends CommandBase {
    // cmd: {path}
    //  notification: SiteMenuAddedNotification {itemId, fullPath}
    constructor(cmd) {
        super("AddSiteMenuCommand", cmd);
    }
}
exports.AddSiteMenu = AddSiteMenu;
class AddMenuItem extends CommandBase {
    // cmd: {menuId, itemId, [properties, parentId, position]}
    constructor(cmd) {
        super("AddMenuItemCommand", cmd);
    }
}
exports.AddMenuItem = AddMenuItem;
class AddVariablesToMenu extends CommandBase {
    // cmd: {itemId, variables}
    constructor(cmd) {
        super("AddVariablesToMenuCommand", cmd);
    }
}
exports.AddVariablesToMenu = AddVariablesToMenu;
class PublishMenu extends CommandBase {
    // cmd: {itemId}
    constructor(cmd) {
        super("PublishMenuCommand", cmd);
    }
}
exports.PublishMenu = PublishMenu;
class PublishPage extends CommandBase {
    // cmd: {itemId}
    constructor(cmd) {
        super("PublishPageCommand", cmd);
    }
}
exports.PublishPage = PublishPage;
class PublishDirectory extends CommandBase {
    // cmd: {itemId}
    constructor(cmd) {
        super("PublishDirectoryCommand", cmd);
    }
}
exports.PublishDirectory = PublishDirectory;
class ChangePageTemplate extends CommandBase {
    // cmd: {pageId, template{ id, namespace } }
    //  notification: PageTemplateChanged {instanceId}
    constructor(cmd) {
        super("ChangePageTemplateCommand", cmd);
    }
}
exports.ChangePageTemplate = ChangePageTemplate;
class RemoveSitePage extends CommandBase {
    // cmd: {pageId }
    constructor(cmd) {
        super("RemoveSitePageCommand", cmd);
    }
}
exports.RemoveSitePage = RemoveSitePage;
class RemoveSiteMenu extends CommandBase {
    // cmd: {menuId }
    constructor(cmd) {
        super("RemoveSiteMenuCommand", cmd);
    }
}
exports.RemoveSiteMenu = RemoveSiteMenu;
class RemoveSiteDirectory extends CommandBase {
    // cmd: {directoryId }
    constructor(cmd) {
        super("RemoveSiteDirectoryCommand", cmd);
    }
}
exports.RemoveSiteDirectory = RemoveSiteDirectory;
class AddLayoutToSlot extends CommandBase {
    // cmd: {pageId, parentInstanceId, slot, layoutKey {id, namespace} }
    //  notification: ModuleAddedToSlot {instanceId}
    constructor(cmd) {
        super("AddLayoutToSlotCommand", cmd);
    }
}
exports.AddLayoutToSlot = AddLayoutToSlot;
class AddModuleToSlot extends CommandBase {
    // cmd: {pageId, parentInstanceId, slot, moduleKey {id, namespace} }
    //  notification: ModuleAddedToSlot {instanceId}
    constructor(cmd) {
        super("AddModuleToSlotCommand", cmd);
    }
}
exports.AddModuleToSlot = AddModuleToSlot;
class AddVariablesToPage extends CommandBase {
    // cmd: {commandId, itemId, variables [{key, variableType(KeyValue/DataItem/DataList/Script/StyleSheet), jsonBody}] }
    constructor(cmd) {
        super("AddVariablesToPageCommand", cmd);
    }
}
exports.AddVariablesToPage = AddVariablesToPage;
class AddVariablesToDirectory extends CommandBase {
    // cmd: {commandId, itemId, variables [{key, variableType(KeyValue/DataItem/DataList/Script/StyleSheet), jsonBody}] }
    constructor(cmd) {
        super("AddVariablesToDirectoryCommand", cmd);
    }
}
exports.AddVariablesToDirectory = AddVariablesToDirectory;
class DeletePageVariables extends CommandBase {
    // cmd: {commandId, itemId, variableKeys[] }
    constructor(cmd) {
        super("DeletePageVariablesCommand", cmd);
    }
}
exports.DeletePageVariables = DeletePageVariables;
class DeleteDirectoryVariables extends CommandBase {
    // cmd: {commandId, itemId, variableKeys[] }
    constructor(cmd) {
        super("DeleteDirectoryVariablesCommand", cmd);
    }
}
exports.DeleteDirectoryVariables = DeleteDirectoryVariables;
class DeleteMenuVariables extends CommandBase {
    // cmd: {commandId, itemId, variableKeys[] }
    constructor(cmd) {
        super("DeleteMenuVariablesCommand", cmd);
    }
}
exports.DeleteMenuVariables = DeleteMenuVariables;
class SetLayoutProperties extends CommandBase {
    // cmd: {commandId, pageId, layoutInstanceId, layoutKey?, properties {key, value}}
    constructor(cmd) {
        super("SetLayoutPropertiesCommand", cmd);
    }
}
exports.SetLayoutProperties = SetLayoutProperties;
class SetModuleProperties extends CommandBase {
    // cmd: {commandId, pageId, moduleInstanceId, properties {key, value}}
    constructor(cmd) {
        super("SetModulePropertiesCommand", cmd);
    }
}
exports.SetModuleProperties = SetModuleProperties;
class RemoveLinkRuleFromPage extends CommandBase {
    // cmd: {commandId, linkRuleId}
    constructor(cmd) {
        super("RemoveLinkRuleFromPageCommand", cmd);
    }
}
exports.RemoveLinkRuleFromPage = RemoveLinkRuleFromPage;
class CreateLinkRuleForPage extends CommandBase {
    // cmd: {commandId, pageId, entityType, priority, properties {key, value}}
    constructor(cmd) {
        super("CreateLinkRuleForPageCommand", cmd);
    }
}
exports.CreateLinkRuleForPage = CreateLinkRuleForPage;
class GenerateDiff extends CommandBase {
    // cmd: {aggregateId, aggregateType, leftRevision, rightRevision? }
    constructor(cmd) {
        super("GenerateDiffCommand", cmd);
    }
}
exports.GenerateDiff = GenerateDiff;
class Rollback extends CommandBase {
    // cmd: {aggregateId, aggregateType, aggregateRevision }
    constructor(cmd) {
        super("RollbackCommand", cmd);
    }
}
exports.Rollback = Rollback;
class CreateCheckpoint extends CommandBase {
    // cmd: { checkpointId, label, bucketId }
    constructor(cmd) {
        super("CreateCheckpointCommand", cmd);
    }
}
exports.CreateCheckpoint = CreateCheckpoint;
class DeleteCheckpoint extends CommandBase {
    // cmd: { checkpointId }
    constructor(cmd) {
        super("DeleteCheckpointCommand", cmd);
    }
}
exports.DeleteCheckpoint = DeleteCheckpoint;
class RestoreCheckpoint extends CommandBase {
    // cmd: { checkpointId }
    constructor(cmd) {
        super("RestoreCheckpointCommand", cmd);
    }
}
exports.RestoreCheckpoint = RestoreCheckpoint;
class ImportNode extends CommandBase {
    // cmd: { importId, targetPath, node { structureNode : SiteNodeTradeContract, memento : MementoContract, mode : ImportMode}, pagesWithLinkRules }
    constructor(cmd) {
        super("ImportNodeCommand", cmd);
    }
}
exports.ImportNode = ImportNode;
class ExportNode extends CommandBase {
    // cmd: { path, exportId, description }
    constructor(cmd) {
        super("ExportNodeCommand", cmd);
    }
}
exports.ExportNode = ExportNode;
