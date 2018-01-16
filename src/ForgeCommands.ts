import * as uuid from "uuid";

export class CommandBase {
	readonly name: string;
	readonly bodyObject: any;

	constructor(name: string, cmd: any) {
		cmd.commandId = cmd.commandId || uuid.v4();

		this.name = name;
		this.bodyObject = cmd;
	}

	id() {
		return this.bodyObject.commandId;
	}
}

export class Batch extends CommandBase {
	// {commands}
	constructor(cmd: any) {
		if (!cmd.commands) {
			throw new Error("Invalid commands");
		}

		super("BatchCommand", cmd);
	}
}

// WCM

export class CreateStory extends CommandBase {
	// {storyId, translationId, translationInfo}
	constructor(cmd: any) {
		cmd.storyId = cmd.storyId || uuid.v4();
		cmd.translationId = cmd.translationId || uuid.v4();
		if (!cmd.translationInfo) {
			throw new Error("Invalid translationInfo");
		}
		cmd.translationInfo.platform = cmd.translationInfo.platform || "default";

		super("CreateStoryCommand", cmd);
	}
}

export class SetPublicAvailability extends CommandBase {
	// cmd: {aggregateId, aggregateType}
	constructor(cmd: {commandId?: string, aggregateId: string, aggregateType: string}) {
		super("SetPublicAvailabilityCommand", cmd);
	}
}

export class SetUnlistedAvailability extends CommandBase {
	// cmd: {aggregateId, aggregateType}
	constructor(cmd: {commandId?: string, aggregateId: string, aggregateType: string}) {
		super("SetUnlistedAvailabilityCommand", cmd);
	}
}

export class CreatePhoto extends CommandBase {
	// {photoId, translationId, storagePath, originalFileName, [photoPublishPolicy]}
	constructor(cmd: any) {
		cmd.photoId = cmd.photoId || uuid.v4();
		cmd.translationId = cmd.translationId || uuid.v4();

		super("CreatePhotoCommand", cmd);
	}
}

export class CreateDocument extends CommandBase {
	// {documentId, translationId, storagePath, originalFileName}
	constructor(cmd: any) {
		cmd.documentId = cmd.documentId || uuid.v4();
		cmd.translationId = cmd.translationId || uuid.v4();

		super("CreateDocumentCommand", cmd);
	}
}

export class CreateCustomEntity extends CommandBase {
	// {entityId, translationId, entityCode}
	constructor(cmd: any) {
		cmd.entityId = cmd.entityId || uuid.v4();
		cmd.translationId = cmd.translationId || uuid.v4();
		super("CreateCustomEntityCommand", cmd);
	}
}

export class CreateTag extends CommandBase {
	// {tagId, translationId, title, [slug]}
	constructor(cmd: any) {
		cmd.tagId = cmd.tagId || uuid.v4();
		cmd.translationId = cmd.translationId || uuid.v4();
		super("CreateTagCommand", cmd);
	}
}

export class CreateExternalTag extends CommandBase {
	// {tagId, translationId, title, [slug], dataSourceId, dataSourceName}
	constructor(cmd: any) {
		cmd.tagId = cmd.tagId || uuid.v4();
		cmd.translationId = cmd.translationId || uuid.v4();
		super("CreateExternalTagCommand", cmd);
	}
}

export class CreateCustomEntityTag extends CommandBase {
	// {tagId, translationId, title, [slug], entityTranslationId, entityCode}
	constructor(cmd: any) {
		cmd.tagId = cmd.tagId || uuid.v4();
		cmd.translationId = cmd.translationId || uuid.v4();
		super("CreateCustomEntityTagCommand", cmd);
	}
}

export class CreateAlbum extends CommandBase {
	// {albumId, translationId}
	constructor(cmd: any) {
		cmd = cmd || {};
		cmd.albumId = cmd.albumId || uuid.v4();
		cmd.translationId = cmd.translationId || uuid.v4();

		super("CreateAlbumCommand", cmd);
	}
}

export class CreateSelection extends CommandBase {
	// {selectionId, translationId}
	constructor(cmd?: { selectionId?: string, translationId?: string }) {
		cmd = cmd || {};
		cmd.selectionId = cmd.selectionId || uuid.v4();
		cmd.translationId = cmd.translationId || uuid.v4();

		super("CreateSelectionCommand", cmd);
	}
}

export class SetSelectionMaxItems extends CommandBase {
	constructor(cmd: { selectionId: string, maxItems: number, commandId?: string }) {
		super("SetSelectionMaxItemsCommand", cmd);
	}
}

export class AddSelectionEntityTypes extends CommandBase {
	constructor(cmd: { selectionId: string, entityTypes: string[], commandId?: string }) {
		super("AddSelectionEntityTypesCommand", cmd);
	}
}

export class RemoveSelectionEntityTypes extends CommandBase {
	constructor(cmd: { selectionId: string, entityTypes: string[], commandId?: string }) {
		super("RemoveSelectionEntityTypesCommand", cmd);
	}
}

export class SetTitle extends CommandBase {
	// {aggregateId, aggregateType, translationId, title}
	constructor(cmd: any) {
		super("SetTitleCommand", cmd);
	}
}

export class SetSlug extends CommandBase {
	// {aggregateId, aggregateType, translationId, slug}
	constructor(cmd: any) {
		super("SetSlugCommand", cmd);
	}
}

export class SetDescription extends CommandBase {
	// {aggregateId, aggregateType, translationId, description (markdown)}
	constructor(cmd: any) {
		super("SetDescriptionCommand", cmd);
	}
}

export class SetContentDate extends CommandBase {
	// {aggregateId, aggregateType, translationId, contentDate (string as json date)}
	constructor(cmd: any) {
		super("SetContentDateCommand", cmd);
	}
}

export class SetThumbnail extends CommandBase {
	// {aggregateId, aggregateType, photoId}
	constructor(cmd: any) {
		super("SetThumbnailCommand", cmd);
	}
}

export class UnsetThumbnail extends CommandBase {
	// {aggregateId, aggregateType}
	constructor(cmd: any) {
		super("UnsetThumbnailCommand", cmd);
	}
}

export class SetContext extends CommandBase {
	// {aggregateId, aggregateType, relatedItem}
	constructor(cmd: any) {
		super("SetContextCommand", cmd);
	}
}

export class UnsetContext extends CommandBase {
	// {aggregateId, aggregateType}
	constructor(cmd: any) {
		super("UnsetContextCommand", cmd);
	}
}

export class AddAlbumItems extends CommandBase {
	// {albumId, items {id, elementType, element { entityId } } , position}
	constructor(cmd: any) {
		cmd.position = cmd.position || 9999;
		super("AddAlbumItemsCommand", cmd);
	}
}

export class AddSelectionItems extends CommandBase {
	// {selectionId, items {id, elementType, element { entityId } } , position}
	constructor(cmd: any) {
		cmd.position = cmd.position || 9999;
		super("AddSelectionItemsCommand", cmd);
	}
}

export class DeleteAlbumItems extends CommandBase {
	// {albumId, albumItemIds}
	constructor(cmd: any) {
		super("DeleteAlbumItemsCommand", cmd);
	}
}

export class MoveAlbumItem extends CommandBase {
	// {albumId, albumItemId, position}
	constructor(cmd: any) {
		super("MoveAlbumItemCommand", cmd);
	}
}

export class Publish extends CommandBase {
	// {aggregateId, aggregateType, translationId}
	constructor(cmd: any) {
		super("PublishCommand", cmd);
	}
}

export class Unpublish extends CommandBase {
	// {aggregateId, aggregateType, translationId}
	constructor(cmd: any) {
		super("UnpublishCommand", cmd);
	}
}

export class Archive extends CommandBase {
	// {aggregateId, aggregateType, translationId}
	constructor(cmd: any) {
		super("ArchiveCommand", cmd);
	}
}

export class AddStoryPart extends CommandBase {
	// cmd: {storyId, translationId, position, storyPart: {partType, partBody, partId} }
	constructor(cmd: any) {
		cmd.storyPart.partBodyJson = JSON.stringify(cmd.storyPart.partBody);
		delete cmd.storyPart.partBody;
		cmd.storyPart.partId = cmd.storyPart.partId || uuid.v4();
		super("AddStoryPartCommand", cmd);
	}
}

export class SetStoryHeadline extends CommandBase {
	// cmd: {storyId, translationId, headline}
	constructor(cmd: any) {
		super("SetStoryHeadlineCommand", cmd);
	}
}

export class SetExtendedFields extends CommandBase {
	// cmd: {aggregateId, aggregateType, translationId, values}
	constructor(cmd: any) {
		super("SetExtendedFieldsCommand", cmd);
	}
}

export class SetWorkflowFields extends CommandBase {
	// cmd: {values, aggregateId, aggregateType, translationId?, workflowName}
	constructor(cmd: any) {
		super("SetWorkflowFieldsCommand", cmd);
	}
}

export class SetFeatured extends CommandBase {
	// cmd: {aggregateId, aggregateType, featured}
	constructor(cmd: any) {
		super("SetFeaturedCommand", cmd);
	}
}

export class SetFile extends CommandBase {
	// cmd: {aggregateId, aggregateType, translationId, storagePath, originalFileName}
	constructor(cmd: any) {
		super("SetFileCommand", cmd);
	}
}

export class SetStoryPartExtendedFields extends CommandBase {
	// cmd: {storyId, translationId, partId, values }
	constructor(cmd: any) {
		super("SetStoryPartExtendedFieldsCommand", cmd);
	}
}

export class AddEntityRelation extends CommandBase {
	// cmd: { aggregateId, aggregateType, relatedItem { entityType, entityId } }
	constructor(cmd: any) {
		super("AddEntityRelationCommand", cmd);
	}
}

export class RemoveEntityRelation extends CommandBase {
	// cmd: { aggregateId, aggregateType, relatedItem { entityType, entityId } }
	constructor(cmd: any) {
		super("RemoveEntityRelationCommand", cmd);
	}
}

export class MoveEntityRelation extends CommandBase {
	// cmd: { aggregateId, aggregateType, relatedItem { entityType, entityId }, position }
	constructor(cmd: any) {
		super("MoveEntityRelationCommand", cmd);
	}
}

export class SetPhotoCropArea extends CommandBase {
	// cmd: { photoId, format, formatProperty { crop { x, y, height, width } } }
	constructor(cmd: any) {
		super("SetPhotoCropAreaCommand", cmd);
	}
}

export class UnsetPhotoCropArea extends CommandBase {
	// cmd: { aggregateId, format }
	constructor(cmd: any) {
		super("UnsetPhotoCropAreaCommand", cmd);
	}
}

export class SetPhotoGravity extends CommandBase {
	// cmd: { photoId, crop { x, y, height, width } }
	constructor(cmd: any) {
		super("SetPhotoGravityCommand", cmd);
	}
}

export class UnsetPhotoGravity extends CommandBase {
	// cmd: { aggregateId }
	constructor(cmd: any) {
		super("UnsetPhotoGravityCommand", cmd);
	}
}

export class ExtractPhotoMetadata extends CommandBase {
	// cmd: { aggregateId }
	constructor(cmd: any) {
		super("ExtractPhotoMetadataCommand", cmd);
	}
}

export class AddReferenceFieldItems extends CommandBase {
	constructor(cmd: {
		aggregateId: string, aggregateType: string, translationId: string, fieldName: string,
		referenceItem: Array<{ entityId: string, entityType: string }>
	}) {
		super("AddReferenceFieldItemsCommand", cmd);
	}
}

export class RemoveReferenceFieldItems extends CommandBase {
	constructor(cmd: {
		aggregateId: string, aggregateType: string, translationId: string, fieldName: string,
		referenceItem: Array<{ entityId: string, entityType: string }>
	}) {
		super("RemoveReferenceFieldItemsCommand", cmd);
	}
}

export class ResetReferenceField extends CommandBase {
	constructor(cmd: {
		aggregateId: string, aggregateType: string, translationId: string, fieldName: string
	}) {
		super("ResetReferenceFieldCommand", cmd);
	}
}

export class MoveReferenceFieldItem extends CommandBase {
	constructor(cmd: {
		aggregateId: string, aggregateType: string, translationId: string, fieldName: string, startPosition: number, endPosition: number
	}) {
		super("MoveReferenceFieldItemCommand", cmd);
	}
}

export class AddTranslation extends CommandBase {
	// cmd: { aggregateId, aggregateType, translationId, translationInfo, [cloneFromTranslationId] }
	constructor(cmd: any) {
		cmd.translationId = cmd.translationId || uuid.v4();
		if (!cmd.translationInfo) {
			throw new Error("Invalid translationInfo");
		}
		cmd.translationInfo.platform = cmd.translationInfo.platform || "default";

		super("AddTranslationCommand", cmd);
	}
}

export class RemoveTranslation extends CommandBase {
	// cmd: { aggregateId, aggregateType, translationId }
	constructor(cmd: any) {
		super("RemoveTranslationCommand", cmd);
	}
}

export class SetTranslationVisibility extends CommandBase {
	// cmd: { aggregateId, aggregateType, translationId, visibility }
	constructor(cmd: any) {
		if (!cmd.visibility) {
			throw new Error("Invalid visibility");
		}

		super("SetTranslationVisibilityCommand", cmd);
	}
}

export class ImportFeeds extends CommandBase {
	// cmd: { items : [ {id, sourceName}, {id, sourceName}, ... ] }
	constructor(cmd: any) {
		super("ImportFeedsCommand", cmd);
	}
}

export class UploadPhoto extends CommandBase {
	// cmd: { photoId, translationId, sourceUrl, [title], [slug], [photoPublishPolicy] }
	constructor(cmd: any) {
		cmd.photoId = cmd.photoId || uuid.v4();
		cmd.translationId = cmd.translationId || uuid.v4();

		super("UploadPhotoCommand", cmd);
	}
}

export class UploadDocument extends CommandBase {
	// cmd: { documentId, translationId, sourceUrl, [title], [slug] }
	constructor(cmd: any) {
		super("UploadDocumentCommand", cmd);
	}
}

// VSM

export class AddSitePage extends CommandBase {
	// cmd: {path}
	//  notification: SitePageAddedNotification {itemId}
	constructor(cmd: any) {
		super("AddSitePageCommand", cmd);
	}
}

export class AddSiteMenu extends CommandBase {
	// cmd: {path}
	//  notification: SiteMenuAddedNotification {itemId, fullPath}
	constructor(cmd: any) {
		super("AddSiteMenuCommand", cmd);
	}
}

export class AddMenuItem extends CommandBase {
	// cmd: {menuId, itemId, [properties, parentId, position]}
	constructor(cmd: any) {
		super("AddMenuItemCommand", cmd);
	}
}

export class AddVariablesToMenu extends CommandBase {
	// cmd: {itemId, variables}
	constructor(cmd: any) {
		super("AddVariablesToMenuCommand", cmd);
	}
}

export class PublishMenu extends CommandBase {
	// cmd: {itemId}
	constructor(cmd: any) {
		super("PublishMenuCommand", cmd);
	}
}

export class PublishPage extends CommandBase {
	// cmd: {itemId}
	constructor(cmd: any) {
		super("PublishPageCommand", cmd);
	}
}

export class PublishDirectory extends CommandBase {
	// cmd: {itemId}
	constructor(cmd: any) {
		super("PublishDirectoryCommand", cmd);
	}
}

export class ChangePageTemplate extends CommandBase {
	// cmd: {pageId, template{ id, namespace } }
	//  notification: PageTemplateChanged {instanceId}
	constructor(cmd: any) {
		super("ChangePageTemplateCommand", cmd);
	}
}

export class RemoveSitePage extends CommandBase {
	// cmd: {pageId }
	constructor(cmd: any) {
		super("RemoveSitePageCommand", cmd);
	}
}

export class RemoveSiteMenu extends CommandBase {
	// cmd: {menuId }
	constructor(cmd: any) {
		super("RemoveSiteMenuCommand", cmd);
	}
}

export class RemoveSiteDirectory extends CommandBase {
	// cmd: {directoryId }
	constructor(cmd: any) {
		super("RemoveSiteDirectoryCommand", cmd);
	}
}

export class AddLayoutToSlot extends CommandBase {
	// cmd: {pageId, parentInstanceId, slot, layoutKey {id, namespace} }
	//  notification: ModuleAddedToSlot {instanceId}
	constructor(cmd: any) {
		super("AddLayoutToSlotCommand", cmd);
	}
}

export class AddModuleToSlot extends CommandBase {
	// cmd: {pageId, parentInstanceId, slot, moduleKey {id, namespace} }
	//  notification: ModuleAddedToSlot {instanceId}
	constructor(cmd: any) {
		super("AddModuleToSlotCommand", cmd);
	}
}

export class AddVariablesToPage extends CommandBase {
	// cmd: {commandId, itemId, variables [{key, variableType(KeyValue/DataItem/DataList/Script/StyleSheet), jsonBody}] }
	constructor(cmd: any) {
		super("AddVariablesToPageCommand", cmd);
	}
}

export class AddVariablesToDirectory extends CommandBase {
	// cmd: {commandId, itemId, variables [{key, variableType(KeyValue/DataItem/DataList/Script/StyleSheet), jsonBody}] }
	constructor(cmd: any) {
		super("AddVariablesToDirectoryCommand", cmd);
	}
}

export class DeletePageVariables extends CommandBase {
	// cmd: {commandId, itemId, variableKeys[] }
	constructor(cmd: any) {
		super("DeletePageVariablesCommand", cmd);
	}
}

export class DeleteDirectoryVariables extends CommandBase {
	// cmd: {commandId, itemId, variableKeys[] }
	constructor(cmd: any) {
		super("DeleteDirectoryVariablesCommand", cmd);
	}
}

export class DeleteMenuVariables extends CommandBase {
	// cmd: {commandId, itemId, variableKeys[] }
	constructor(cmd: any) {
		super("DeleteMenuVariablesCommand", cmd);
	}
}

export class SetLayoutProperties extends CommandBase {
	// cmd: {commandId, pageId, layoutInstanceId, layoutKey?, properties {key, value}}
	constructor(cmd: any) {
		super("SetLayoutPropertiesCommand", cmd);
	}
}

export class SetModuleProperties extends CommandBase {
	// cmd: {commandId, pageId, moduleInstanceId, properties {key, value}}
	constructor(cmd: any) {
		super("SetModulePropertiesCommand", cmd);
	}
}

export class RemoveLinkRuleFromPage extends CommandBase {
	// cmd: {commandId, linkRuleId}
	constructor(cmd: any) {
		super("RemoveLinkRuleFromPageCommand", cmd);
	}
}

export class CreateLinkRuleForPage extends CommandBase {
	// cmd: {commandId, pageId, entityType, priority, properties {key, value}}
	constructor(cmd: any) {
		super("CreateLinkRuleForPageCommand", cmd);
	}
}

export class GenerateDiff extends CommandBase {
	// cmd: {aggregateId, aggregateType, leftRevision, rightRevision? }
	constructor(cmd: any) {
		super("GenerateDiffCommand", cmd);
	}
}

export class Rollback extends CommandBase {
	// cmd: {aggregateId, aggregateType, aggregateRevision }
	constructor(cmd: any) {
		super("RollbackCommand", cmd);
	}
}

export class CreateCheckpoint extends CommandBase {
	// cmd: { checkpointId, label, bucketId }
	constructor(cmd: any) {
		super("CreateCheckpointCommand", cmd);
	}
}

export class DeleteCheckpoint extends CommandBase {
	// cmd: { checkpointId }
	constructor(cmd: any) {
		super("DeleteCheckpointCommand", cmd);
	}
}

export class RestoreCheckpoint extends CommandBase {
	// cmd: { checkpointId }
	constructor(cmd: any) {
		super("RestoreCheckpointCommand", cmd);
	}
}

export class ImportNode extends CommandBase {
	// cmd: { importId, targetPath,
	// node { structureNode : SiteNodeTradeContract, memento : MementoContract, mode : ImportMode}, pagesWithLinkRules
	// }
	constructor(cmd: any) {
		super("ImportNodeCommand", cmd);
	}
}

export class ExportNode extends CommandBase {
	// cmd: { path, exportId, description }
	constructor(cmd: { path: string, exportId: string, description?: string }) {
		super("ExportNodeCommand", cmd);
	}
}

export class SetContextualFields extends CommandBase {
	// cmd: {translationId, elementId, contextualFields}
	constructor(cmd: {commandId?: string, aggregateId: string, aggregateType: string, translationId: string, elementId: string, contextualFields: any}) {
		super("SetContextualFieldsCommand", cmd);
	}
}

export class UnsetContextualFields extends CommandBase {
	// cmd: {translationId, elementId, contextualFieldNames}
	constructor(cmd: {commandId?: string, aggregateId: string, aggregateType: string, translationId: string, elementId: string, contextualFieldNames: any}) {
		super("UnsetContextualFieldsCommand", cmd);
	}
}
