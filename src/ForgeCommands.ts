import * as uuid from "uuid";

export class CommandBase{
	readonly name: string;
	readonly bodyObject: any;

	constructor(name, cmd){
		cmd.commandId = cmd.commandId || uuid.v4();

		this.name = name;
		this.bodyObject = cmd;
	}

	id(){
		return this.bodyObject.commandId;
	}
}

export class Batch extends CommandBase {
	// {commands}
	constructor(cmd){
		if (!cmd.commands) throw new Error("Invalid commands");

		super("BatchCommand", cmd);
	}
}

// WCM

export class CreateStory extends CommandBase {
	// {storyId, translationId, translationInfo}
	constructor(cmd){
		cmd.storyId = cmd.storyId || uuid.v4();
		cmd.translationId = cmd.translationId || uuid.v4();
		if (!cmd.translationInfo) throw new Error("Invalid translationInfo");
		cmd.translationInfo.platform = cmd.translationInfo.platform || "default";

		super("CreateStoryCommand", cmd);
	}
}

export class CreatePhoto extends CommandBase {
	// {photoId, translationId, storagePath, originalFileName}
	constructor(cmd){
		cmd.photoId = cmd.photoId || uuid.v4();
		cmd.translationId = cmd.translationId || uuid.v4();

		super("CreatePhotoCommand", cmd);
	}
}

export class CreateDocument extends CommandBase {
	// {documentId, translationId, storagePath, originalFileName}
	constructor(cmd){
		cmd.documentId = cmd.documentId || uuid.v4();
		cmd.translationId = cmd.translationId || uuid.v4();

		super("CreateDocumentCommand", cmd);
	}
}

export class CreateCustomEntity extends CommandBase {
	//{entityId, translationId, entityCode}
	constructor(cmd){
		cmd.entityId = cmd.entityId || uuid.v4();
		cmd.translationId = cmd.translationId || uuid.v4();
		super("CreateCustomEntityCommand", cmd);
	}
}

export class CreateTag extends CommandBase {
	// {tagId, translationId, title, [slug]}
	constructor(cmd){
		cmd.tagId = cmd.tagId || uuid.v4();
		cmd.translationId = cmd.translationId || uuid.v4();
		super("CreateTagCommand", cmd);
	}
}

export class CreateExternalTag extends CommandBase {
	// {tagId, translationId, title, [slug], dataSourceId, dataSourceName}
	constructor(cmd){
		cmd.tagId = cmd.tagId || uuid.v4();
		cmd.translationId = cmd.translationId || uuid.v4();
		super("CreateExternalTagCommand", cmd);
	}
}

export class CreateCustomEntityTag extends CommandBase {
	// {tagId, translationId, title, [slug], entityTranslationId, entityCode}
	constructor(cmd){
		cmd.tagId = cmd.tagId || uuid.v4();
		cmd.translationId = cmd.translationId || uuid.v4();
		super("CreateCustomEntityTagCommand", cmd);
	}
}

export class CreateAlbum extends CommandBase {
	// {albumId, translationId}
	constructor(cmd){
		cmd = cmd || {};
		cmd.albumId = cmd.albumId || uuid.v4();
		cmd.translationId = cmd.translationId || uuid.v4();

		super("CreateAlbumCommand", cmd);
	}
}

export class CreateSelection extends CommandBase {
	// {selectionId, translationId}
	constructor(cmd){
		cmd = cmd || {};
		cmd.selectionId = cmd.selectionId || uuid.v4();
		cmd.translationId = cmd.translationId || uuid.v4();

		super("CreateSelectionCommand", cmd);
	}
}

export class SetTitle extends CommandBase {
	// {aggregateId, aggregateType, translationId, title}
	constructor(cmd){
		super("SetTitleCommand", cmd);
	}
}

export class SetSlug extends CommandBase {
	// {aggregateId, aggregateType, translationId, slug}
	constructor(cmd){
		super("SetSlugCommand", cmd);
	}
}

export class SetDescription extends CommandBase {
	// {aggregateId, aggregateType, translationId, description (markdown)}
	constructor(cmd){
		super("SetDescriptionCommand", cmd);
	}
}

export class SetContentDate extends CommandBase {
	// {aggregateId, aggregateType, translationId, contentDate (string as json date)}
	constructor(cmd){
		super("SetContentDateCommand", cmd);
	}
}

export class SetThumbnail extends CommandBase {
	// {aggregateId, aggregateType, photoId}
	constructor(cmd){
		super("SetThumbnailCommand", cmd);
	}
}

export class UnsetThumbnail extends CommandBase {
	// {aggregateId, aggregateType}
	constructor(cmd){
		super("UnsetThumbnailCommand", cmd);
	}
}

export class SetContext extends CommandBase {
	// {aggregateId, aggregateType, relatedItem}
	constructor(cmd){
		super("SetContextCommand", cmd);
	}
}

export class UnsetContext extends CommandBase {
	// {aggregateId, aggregateType}
	constructor(cmd){
		super("UnsetContextCommand", cmd);
	}
}

export class AddAlbumItems extends CommandBase {
	//{albumId, items {id, elementType, element { entityId } } , position}
	constructor(cmd){
		cmd.position = cmd.position || 9999;
		super("AddAlbumItemsCommand", cmd);
	}
}

export class AddSelectionItems extends CommandBase {
	//{selectionId, items {id, elementType, element { entityId } } , position}
	constructor(cmd){
		cmd.position = cmd.position || 9999;
		super("AddSelectionItemsCommand", cmd);
	}
}

export class DeleteAlbumItems extends CommandBase {
	//{albumId, albumItemIds}
	constructor(cmd){
		super("DeleteAlbumItemsCommand", cmd);
	}
}

export class MoveAlbumItem extends CommandBase {
	//{albumId, albumItemId, position}
	constructor(cmd){
		super("MoveAlbumItemCommand", cmd);
	}
}

export class Publish extends CommandBase {
	//{aggregateId, aggregateType, translationId}
	constructor(cmd){
		super("PublishCommand", cmd);
	}
}

export class Unpublish extends CommandBase {
	//{aggregateId, aggregateType, translationId}
	constructor(cmd){
		super("UnpublishCommand", cmd);
	}
}

export class Archive extends CommandBase {
	//{aggregateId, aggregateType, translationId}
	constructor(cmd){
		super("ArchiveCommand", cmd);
	}
}

export class AddStoryPart extends CommandBase {
	// cmd: {storyId, translationId, position, storyPart: {partType, partBody, partId} }
	constructor(cmd){
		cmd.storyPart.partBodyJson = JSON.stringify(cmd.storyPart.partBody);
		delete cmd.storyPart.partBody;
		cmd.storyPart.partId = cmd.storyPart.partId || uuid.v4();
		super("AddStoryPartCommand", cmd);
	}
}

export class SetStoryHeadline extends CommandBase {
	// cmd: {storyId, translationId, headline}
	constructor(cmd){
		super("SetStoryHeadlineCommand", cmd);
	}
}

export class SetExtendedFields extends CommandBase {
	// cmd: {aggregateId, aggregateType, translationId, values}
	constructor(cmd){
		super("SetExtendedFieldsCommand", cmd);
	}
}

export class SetFeatured extends CommandBase {
	// cmd: {aggregateId, aggregateType, featured}
	constructor(cmd){
		super("SetFeaturedCommand", cmd);
	}
}

export class SetFile extends CommandBase {
	// cmd: {aggregateId, aggregateType, translationId, storagePath, originalFileName}
	constructor(cmd){
		super("SetFileCommand", cmd);
	}
}

export class SetStoryPartExtendedFields extends CommandBase {
	// cmd: {storyId, translationId, partId, values }
	constructor(cmd){
		super("SetStoryPartExtendedFieldsCommand", cmd);
	}
}

export class AddEntityRelation extends CommandBase {
	// cmd: { aggregateId, aggregateType, relatedItem { entityType, entityId } }
	constructor(cmd){
		super("AddEntityRelationCommand", cmd);
	}
}

export class MoveEntityRelation extends CommandBase {
	// cmd: { aggregateId, aggregateType, relatedItem { entityType, entityId }, position }
	constructor(cmd){
		super("MoveEntityRelationCommand", cmd);
	}
}

export class SetPhotoCropArea extends CommandBase {
	// cmd: { photoId, format, formatProperty { crop { x, y, height, width } } }
	constructor(cmd) {
		super("SetPhotoCropAreaCommand", cmd);
	}
}

export class UnsetPhotoCropArea extends CommandBase {
	// cmd: { aggregateId, format }
	constructor(cmd) {
		super("UnsetPhotoCropAreaCommand", cmd);
	}
}

export class SetPhotoGravity extends CommandBase {
	// cmd: { photoId, crop { x, y, height, width } }
	constructor(cmd) {
		super("SetPhotoGravityCommand", cmd);
	}
}

export class UnsetPhotoGravity extends CommandBase {
	// cmd: { aggregateId }
	constructor(cmd) {
		super("UnsetPhotoGravityCommand", cmd);
	}
}

export class ExtractPhotoMetadata extends CommandBase {
	// cmd: { aggregateId }
	constructor(cmd) {
		super("ExtractPhotoMetadataCommand", cmd);
	}
}

export class AddTranslation extends CommandBase {
	// cmd: { aggregateId, aggregateType, translationId, translationInfo, [cloneFromTranslationId] }
	constructor(cmd) {
		cmd.translationId = cmd.translationId || uuid.v4();
		if (!cmd.translationInfo) throw new Error("Invalid translationInfo");
		cmd.translationInfo.platform = cmd.translationInfo.platform || "default";

		super("AddTranslationCommand", cmd);
	}
}

export class RemoveTranslation extends CommandBase {
	// cmd: { aggregateId, aggregateType, translationId }
	constructor(cmd) {
		super("RemoveTranslationCommand", cmd);
	}
}

export class SetTranslationVisibility extends CommandBase {
	// cmd: { aggregateId, aggregateType, translationId, visibility }
	constructor(cmd) {
		if (!cmd.visibility) throw new Error("Invalid visibility");

		super("SetTranslationVisibilityCommand", cmd);
	}
}

export class ImportFeeds extends CommandBase {
	// cmd: { items : [ {id, sourceName}, {id, sourceName}, ... ] }
	constructor(cmd) {
		super("ImportFeedsCommand", cmd);
	}
}

export class UploadPhoto extends CommandBase {
	// cmd: { photoId, translationId, sourceUrl, [title], [slug] }
	constructor(cmd) {
		super("UploadPhotoCommand", cmd);
	}
}

export class UploadDocument extends CommandBase {
	// cmd: { documentId, translationId, sourceUrl, [title], [slug] }
	constructor(cmd) {
		super("UploadDocumentCommand", cmd);
	}
}

// VSM

export class AddSitePage extends CommandBase {
	// cmd: {path}
	//  notification: SitePageAddedNotification {itemId}
	constructor(cmd){
		super("AddSitePageCommand", cmd);
	}
}

export class AddSiteMenu extends CommandBase {
	// cmd: {path}
	//  notification: SiteMenuAddedNotification {itemId, fullPath}
	constructor(cmd){
		super("AddSiteMenuCommand", cmd);
	}
}

export class AddMenuItem extends CommandBase {
	// cmd: {menuId, itemId, [properties, parentId, position]}
	constructor(cmd){
		super("AddMenuItemCommand", cmd);
	}
}

export class AddVariablesToMenu extends CommandBase {
	// cmd: {itemId, variables}
	constructor(cmd){
		super("AddVariablesToMenuCommand", cmd);
	}
}

export class PublishMenu extends CommandBase {
	// cmd: {itemId}
	constructor(cmd){
		super("PublishMenuCommand", cmd);
	}
}

export class PublishPage extends CommandBase {
	// cmd: {itemId}
	constructor(cmd){
		super("PublishPageCommand", cmd);
	}
}

export class PublishDirectory extends CommandBase {
	// cmd: {itemId}
	constructor(cmd){
		super("PublishDirectoryCommand", cmd);
	}
}

export class ChangePageTemplate extends CommandBase {
	// cmd: {pageId, template{ id, namespace } }
	//  notification: PageTemplateChanged {instanceId}
	constructor(cmd){
		super("ChangePageTemplateCommand", cmd);
	}
}

export class RemoveSitePage extends CommandBase {
	// cmd: {pageId }
	constructor(cmd){
		super("RemoveSitePageCommand", cmd);
	}
}

export class RemoveSiteMenu extends CommandBase {
	// cmd: {menuId }
	constructor(cmd){
		super("RemoveSiteMenuCommand", cmd);
	}
}

export class RemoveSiteDirectory extends CommandBase {
	// cmd: {directoryId }
	constructor(cmd){
		super("RemoveSiteDirectoryCommand", cmd);
	}
}

export class AddLayoutToSlot extends CommandBase {
	// cmd: {pageId, parentInstanceId, slot, layoutKey {id, namespace} }
	//  notification: ModuleAddedToSlot {instanceId}
	constructor(cmd){
		super("AddLayoutToSlotCommand", cmd);
	}
}

export class AddModuleToSlot extends CommandBase {
	// cmd: {pageId, parentInstanceId, slot, moduleKey {id, namespace} }
	//  notification: ModuleAddedToSlot {instanceId}
	constructor(cmd){
		super("AddModuleToSlotCommand", cmd);
	}
}

export class AddVariablesToPage extends CommandBase {
	// cmd: {commandId, itemId, variables [{key, variableType(KeyValue/DataItem/DataList/Script/StyleSheet), jsonBody}] }
	constructor(cmd){
		super("AddVariablesToPageCommand", cmd);
	}
}

export class AddVariablesToDirectory extends CommandBase {
	// cmd: {commandId, itemId, variables [{key, variableType(KeyValue/DataItem/DataList/Script/StyleSheet), jsonBody}] }
	constructor(cmd){
		super("AddVariablesToDirectoryCommand", cmd);
	}
}

export class DeletePageVariables extends CommandBase {
	// cmd: {commandId, itemId, variableKeys[] }
	constructor(cmd){
		super("DeletePageVariablesCommand", cmd);
	}
}

export class DeleteDirectoryVariables extends CommandBase {
	// cmd: {commandId, itemId, variableKeys[] }
	constructor(cmd){
		super("DeleteDirectoryVariablesCommand", cmd);
	}
}

export class DeleteMenuVariables extends CommandBase {
	// cmd: {commandId, itemId, variableKeys[] }
	constructor(cmd){
		super("DeleteMenuVariablesCommand", cmd);
	}
}

export class SetLayoutProperties extends CommandBase {
	// cmd: {commandId, pageId, layoutInstanceId, layoutKey?, properties {key, value}}
	constructor(cmd){
		super("SetLayoutPropertiesCommand", cmd);
	}
}

export class SetModuleProperties extends CommandBase {
	// cmd: {commandId, pageId, moduleInstanceId, properties {key, value}}
	constructor(cmd){
		super("SetModulePropertiesCommand", cmd);
	}
}

export class RemoveLinkRuleFromPage extends CommandBase {
	// cmd: {commandId, linkRuleId}
	constructor(cmd){
		super("RemoveLinkRuleFromPageCommand", cmd);
	}
}

export class CreateLinkRuleForPage extends CommandBase {
	// cmd: {commandId, pageId, entityType, priority, properties {key, value}}
	constructor(cmd){
		super("CreateLinkRuleForPageCommand", cmd);
	}
}

export class GenerateDiff extends CommandBase {
	// cmd: {aggregateId, aggregateType, leftRevision, rightRevision? }
	constructor(cmd){
		super("GenerateDiffCommand", cmd);
	}
}

export class Rollback extends CommandBase {
	// cmd: {aggregateId, aggregateType, aggregateRevision }
	constructor(cmd){
		super("RollbackCommand", cmd);
	}
}

export class CreateCheckpoint extends CommandBase {
	// cmd: { checkpointId, label, bucketId }
	constructor(cmd){
		super("CreateCheckpointCommand", cmd);
	}
}

export class DeleteCheckpoint extends CommandBase {
	// cmd: { checkpointId }
	constructor(cmd){
		super("DeleteCheckpointCommand", cmd);
	}
}

export class RestoreCheckpoint extends CommandBase {
	// cmd: { checkpointId }
	constructor(cmd){
		super("RestoreCheckpointCommand", cmd);
	}
}

export class ImportNode extends CommandBase {
	// cmd: { importId, targetPath, node { structureNode : SiteNodeTradeContract, memento : MementoContract, mode : ImportMode}, pagesWithLinkRules }
	constructor(cmd){
		super("ImportNodeCommand", cmd);
	}
}

export class ExportNode extends CommandBase {
	// cmd: { path, exportId, description }
	constructor(cmd){
		super("ExportNodeCommand", cmd);
	}
}
