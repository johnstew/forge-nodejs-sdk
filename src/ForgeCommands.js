"use strict";

const uuid = require("node-uuid");

class CommandBase{
	constructor(name, cmd){
		cmd.commandId = cmd.commandId || uuid.v4();

		this.name = name;
		this.bodyObject = cmd;
	}

	id(){
		return this.bodyObject.commandId;
	}
}

// WCM

class CreateStory extends CommandBase {
	// {storyId, translationId, translationInfo}
	constructor(cmd){
		cmd.storyId = cmd.storyId || uuid.v4();
		cmd.translationId = cmd.translationId || uuid.v4();
		if (!cmd.translationInfo) throw new Error("Invalid translationInfo");
		cmd.translationInfo.platform = cmd.translationInfo.platform || "default";

		super("CreateStoryCommand", cmd);
	}
}

class CreatePhoto extends CommandBase {
	// {photoId, translationId, storagePath, originalFileName}
	constructor(cmd){
		cmd.photoId = cmd.photoId || uuid.v4();
		cmd.translationId = cmd.translationId || uuid.v4();

		super("CreatePhotoCommand", cmd);
	}
}

class CreateDocument extends CommandBase {
	// {documentId, translationId, storagePath, originalFileName}
	constructor(cmd){
		cmd.documentId = cmd.documentId || uuid.v4();
		cmd.translationId = cmd.translationId || uuid.v4();

		super("CreateDocumentCommand", cmd);
	}
}

class CreateCustomEntity extends CommandBase {
	//{entityId, translationId, entityCode}
	constructor(cmd){
		cmd.entityId = cmd.entityId || uuid.v4();
		cmd.translationId = cmd.translationId || uuid.v4();
		super("CreateCustomEntityCommand", cmd);
	}
}

class CreateTag extends CommandBase {
	// {tagId, translationId, title, [slug]}
	constructor(cmd){
		cmd.tagId = cmd.tagId || uuid.v4();
		cmd.translationId = cmd.translationId || uuid.v4();
		super("CreateTagCommand", cmd);
	}
}

class CreateAlbum extends CommandBase {
	// {albumId, translationId}
	constructor(cmd){
		cmd = cmd || {};
		cmd.albumId = cmd.albumId || uuid.v4();
		cmd.translationId = cmd.translationId || uuid.v4();

		super("CreateAlbumCommand", cmd);
	}
}

class CreateSelection extends CommandBase {
	// {selectionId, translationId}
	constructor(cmd){
		cmd = cmd || {};
		cmd.selectionId = cmd.selectionId || uuid.v4();
		cmd.translationId = cmd.translationId || uuid.v4();

		super("CreateSelectionCommand", cmd);
	}
}

class SetTitle extends CommandBase {
	// {aggregateId, aggregateType, translationId, title}
	constructor(cmd){
		super("SetTitleCommand", cmd);
	}
}

class SetSlug extends CommandBase {
	// {aggregateId, aggregateType, translationId, slug}
	constructor(cmd){
		super("SetSlugCommand", cmd);
	}
}

class SetDescription extends CommandBase {
	// {aggregateId, aggregateType, translationId, description (markdown)}
	constructor(cmd){
		super("SetDescriptionCommand", cmd);
	}
}

class AddAlbumItems extends CommandBase {
	//{albumId, items {id, elementType, element { entityId } } , position}
	constructor(cmd){
		cmd.position = cmd.position || 9999;
		super("AddAlbumItemsCommand", cmd);
	}
}

class AddSelectionItems extends CommandBase {
	//{selectionId, items {id, elementType, element { entityId } } , position}
	constructor(cmd){
		cmd.position = cmd.position || 9999;
		super("AddSelectionItemsCommand", cmd);
	}
}

class DeleteAlbumItems extends CommandBase {
	//{albumId, albumItemIds}
	constructor(cmd){
		super("DeleteAlbumItemsCommand", cmd);
	}
}

class MoveAlbumItem extends CommandBase {
	//{albumId, albumItemId, position}
	constructor(cmd){
		super("MoveAlbumItemCommand", cmd);
	}
}

class Publish extends CommandBase {
	//{aggregateId, aggregateType, translationId}
	constructor(cmd){
		super("PublishCommand", cmd);
	}
}

class Archive extends CommandBase {
	//{aggregateId, aggregateType, translationId}
	constructor(cmd){
		super("ArchiveCommand", cmd);
	}
}

class AddStoryPart extends CommandBase {
	// cmd: {storyId, translationId, position, storyPart: {partType, partBody, partId} }
	constructor(cmd){
		cmd.storyPart.partBodyJson = JSON.stringify(cmd.storyPart.partBody);
		delete cmd.storyPart.partBody;
		cmd.storyPart.partId = cmd.storyPart.partId || uuid.v4();
		super("AddStoryPartCommand", cmd);
	}
}

class SetExtendedFields extends CommandBase {
	// cmd: {aggregateId, aggregateType, translationId, values}
	constructor(cmd){
		super("SetExtendedFieldsCommand", cmd);
	}
}

class SetFeatured extends CommandBase {
	// cmd: {aggregateId, aggregateType, featured}
	constructor(cmd){
		super("SetFeaturedCommand", cmd);
	}
}

class SetFile extends CommandBase {
	// cmd: {aggregateId, aggregateType, translationId, storagePath, originalFileName}
	constructor(cmd){
		super("SetFileCommand", cmd);
	}
}

class SetStoryPartExtendedFields extends CommandBase {
	// cmd: {storyId, translationId, partId, values }
	constructor(cmd){
		super("SetStoryPartExtendedFieldsCommand", cmd);
	}
}

class AddEntityRelation extends CommandBase {
	// cmd: { aggregateId, aggregateType, relatedItem { entityType, entityId } }
	constructor(cmd){
		super("AddEntityRelationCommand", cmd);
	}
}

class SetPhotoCropArea extends CommandBase {
	// cmd: { photoId, format, formatProperty { crop { x, y, height, width } } }
	constructor(cmd) {
		super("SetPhotoCropAreaCommand", cmd);
	}
}

class UnsetPhotoCropArea extends CommandBase {
	// cmd: { aggregateId, format }
	constructor(cmd) {
		super("UnsetPhotoCropAreaCommand", cmd);
	}
}

class ExtractPhotoMetadata extends CommandBase {
	// cmd: { aggregateId }
	constructor(cmd) {
		super("ExtractPhotoMetadataCommand", cmd);
	}
}

class AddTranslation extends CommandBase {
	// cmd: { aggregateId, aggregateType, translationId, translationInfo, [cloneFromTranslationId] }
	constructor(cmd) {
		cmd.translationId = cmd.translationId || uuid.v4();
		if (!cmd.translationInfo) throw new Error("Invalid translationInfo");
		cmd.translationInfo.platform = cmd.translationInfo.platform || "default";

		super("AddTranslationCommand", cmd);
	}
}


// VSM

class AddSitePage extends CommandBase {
	// cmd: {path}
	constructor(cmd){
		super("AddSitePageCommand", cmd);
	}
}

class ChangePageTemplate extends CommandBase {
	// cmd: {pageId, template{ id, namespace } }
	//  notification: PageTemplateChanged {instanceId}
	constructor(cmd){
		super("ChangePageTemplateCommand", cmd);
	}
}

class RemoveSitePage extends CommandBase {
	// cmd: {pageId, template{ id, namespace } }
	constructor(cmd){
		super("RemoveSitePageCommand", cmd);
	}
}

class AddLayoutToSlot extends CommandBase {
	// cmd: {pageId, parentInstanceId, slot, layoutKey {id, namespace} }
	//  notification: ModuleAddedToSlot {instanceId}
	constructor(cmd){
		super("AddLayoutToSlotCommand", cmd);
	}
}

class AddModuleToSlot extends CommandBase {
	// cmd: {pageId, parentInstanceId, slot, moduleKey {id, namespace} }
	//  notification: ModuleAddedToSlot {instanceId}
	constructor(cmd){
		super("AddModuleToSlotCommand", cmd);
	}
}

class AddVariablesToPage extends CommandBase {
	// cmd: {commandId, itemId, variables [{key, variableType(KeyValue/DataItem/DataList/Script/StyleSheet), jsonBody}] }
	constructor(cmd){
		super("AddVariablesToPageCommand", cmd);
	}
}

class SetLayoutProperties extends CommandBase {
	// cmd: {commandId, pageId, layoutInstanceId, layoutKey?, properties {key, value}}
	constructor(cmd){
		super("SetLayoutPropertiesCommand", cmd);
	}
}

class SetModuleProperties extends CommandBase {
	// cmd: {commandId, pageId, moduleInstanceId, properties {key, value}}
	constructor(cmd){
		super("SetModulePropertiesCommand", cmd);
	}
}

class GenerateDiff extends CommandBase {
	// cmd: {aggregateId, aggregateType, leftRevision, rightRevision? }
	constructor(cmd){
		super("GenerateDiffCommand", cmd);
	}
}

class Rollback extends CommandBase {
	// cmd: {aggregateId, aggregateType, aggregateRevision }
	constructor(cmd){
		super("RollbackCommand", cmd);
	}
}

class CreateCheckpoint extends CommandBase {
	// cmd: { checkpointId, label, bucketId }
	constructor(cmd){
		super("CreateCheckpointCommand", cmd);
	}
}

class DeleteCheckpoint extends CommandBase {
	// cmd: { checkpointId }
	constructor(cmd){
		super("DeleteCheckpointCommand", cmd);
	}
}

class RestoreCheckpoint extends CommandBase {
	// cmd: { checkpointId }
	constructor(cmd){
		super("RestoreCheckpointCommand", cmd);
	}
}


module.exports = {
	CommandBase : CommandBase,
	// WCM
	CreateStory : CreateStory,
	CreatePhoto : CreatePhoto,
	CreateAlbum : CreateAlbum,
	CreateTag : CreateTag,
	CreateSelection : CreateSelection,
	CreateCustomEntity : CreateCustomEntity,
	CreateDocument : CreateDocument,
	SetTitle : SetTitle,
	SetSlug : SetSlug,
	SetDescription : SetDescription,
	AddAlbumItems : AddAlbumItems,
	AddSelectionItems : AddSelectionItems,
	DeleteAlbumItems : DeleteAlbumItems,
	MoveAlbumItem : MoveAlbumItem,
	Archive : Archive,
	Publish : Publish,
	AddStoryPart : AddStoryPart,
	SetExtendedFields : SetExtendedFields,
	SetStoryPartExtendedFields : SetStoryPartExtendedFields,
	AddEntityRelation : AddEntityRelation,
	SetPhotoCropArea : SetPhotoCropArea,
	UnsetPhotoCropArea : UnsetPhotoCropArea,
	ExtractPhotoMetadata : ExtractPhotoMetadata,
	SetFile : SetFile,
	SetFeatured : SetFeatured,
	AddTranslation : AddTranslation,
	// VSM
	AddSitePage : AddSitePage,
	ChangePageTemplate : ChangePageTemplate,
	AddModuleToSlot : AddModuleToSlot,
	AddLayoutToSlot : AddLayoutToSlot,
	AddVariablesToPage : AddVariablesToPage,
	RemoveSitePage : RemoveSitePage,
	SetLayoutProperties : SetLayoutProperties,
	SetModuleProperties : SetModuleProperties,
	GenerateDiff : GenerateDiff,
	Rollback : Rollback,
	CreateCheckpoint : CreateCheckpoint,
	RestoreCheckpoint : RestoreCheckpoint,
	DeleteCheckpoint : DeleteCheckpoint
};
