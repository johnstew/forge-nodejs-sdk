"use strict";
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
    constructor(cmd) {
        if (!cmd.commands)
            throw new Error("Invalid commands");
        super("BatchCommand", cmd);
    }
}
exports.Batch = Batch;
class CreateStory extends CommandBase {
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
    constructor(cmd) {
        cmd.photoId = cmd.photoId || uuid.v4();
        cmd.translationId = cmd.translationId || uuid.v4();
        super("CreatePhotoCommand", cmd);
    }
}
exports.CreatePhoto = CreatePhoto;
class CreateDocument extends CommandBase {
    constructor(cmd) {
        cmd.documentId = cmd.documentId || uuid.v4();
        cmd.translationId = cmd.translationId || uuid.v4();
        super("CreateDocumentCommand", cmd);
    }
}
exports.CreateDocument = CreateDocument;
class CreateCustomEntity extends CommandBase {
    constructor(cmd) {
        cmd.entityId = cmd.entityId || uuid.v4();
        cmd.translationId = cmd.translationId || uuid.v4();
        super("CreateCustomEntityCommand", cmd);
    }
}
exports.CreateCustomEntity = CreateCustomEntity;
class CreateTag extends CommandBase {
    constructor(cmd) {
        cmd.tagId = cmd.tagId || uuid.v4();
        cmd.translationId = cmd.translationId || uuid.v4();
        super("CreateTagCommand", cmd);
    }
}
exports.CreateTag = CreateTag;
class CreateExternalTag extends CommandBase {
    constructor(cmd) {
        cmd.tagId = cmd.tagId || uuid.v4();
        cmd.translationId = cmd.translationId || uuid.v4();
        super("CreateExternalTagCommand", cmd);
    }
}
exports.CreateExternalTag = CreateExternalTag;
class CreateCustomEntityTag extends CommandBase {
    constructor(cmd) {
        cmd.tagId = cmd.tagId || uuid.v4();
        cmd.translationId = cmd.translationId || uuid.v4();
        super("CreateCustomEntityTagCommand", cmd);
    }
}
exports.CreateCustomEntityTag = CreateCustomEntityTag;
class CreateAlbum extends CommandBase {
    constructor(cmd) {
        cmd = cmd || {};
        cmd.albumId = cmd.albumId || uuid.v4();
        cmd.translationId = cmd.translationId || uuid.v4();
        super("CreateAlbumCommand", cmd);
    }
}
exports.CreateAlbum = CreateAlbum;
class CreateSelection extends CommandBase {
    constructor(cmd) {
        cmd = cmd || {};
        cmd.selectionId = cmd.selectionId || uuid.v4();
        cmd.translationId = cmd.translationId || uuid.v4();
        super("CreateSelectionCommand", cmd);
    }
}
exports.CreateSelection = CreateSelection;
class SetTitle extends CommandBase {
    constructor(cmd) {
        super("SetTitleCommand", cmd);
    }
}
exports.SetTitle = SetTitle;
class SetSlug extends CommandBase {
    constructor(cmd) {
        super("SetSlugCommand", cmd);
    }
}
exports.SetSlug = SetSlug;
class SetDescription extends CommandBase {
    constructor(cmd) {
        super("SetDescriptionCommand", cmd);
    }
}
exports.SetDescription = SetDescription;
class SetContentDate extends CommandBase {
    constructor(cmd) {
        super("SetContentDateCommand", cmd);
    }
}
exports.SetContentDate = SetContentDate;
class SetThumbnail extends CommandBase {
    constructor(cmd) {
        super("SetThumbnailCommand", cmd);
    }
}
exports.SetThumbnail = SetThumbnail;
class UnsetThumbnail extends CommandBase {
    constructor(cmd) {
        super("UnsetThumbnailCommand", cmd);
    }
}
exports.UnsetThumbnail = UnsetThumbnail;
class SetContext extends CommandBase {
    constructor(cmd) {
        super("SetContextCommand", cmd);
    }
}
exports.SetContext = SetContext;
class UnsetContext extends CommandBase {
    constructor(cmd) {
        super("UnsetContextCommand", cmd);
    }
}
exports.UnsetContext = UnsetContext;
class AddAlbumItems extends CommandBase {
    constructor(cmd) {
        cmd.position = cmd.position || 9999;
        super("AddAlbumItemsCommand", cmd);
    }
}
exports.AddAlbumItems = AddAlbumItems;
class AddSelectionItems extends CommandBase {
    constructor(cmd) {
        cmd.position = cmd.position || 9999;
        super("AddSelectionItemsCommand", cmd);
    }
}
exports.AddSelectionItems = AddSelectionItems;
class DeleteAlbumItems extends CommandBase {
    constructor(cmd) {
        super("DeleteAlbumItemsCommand", cmd);
    }
}
exports.DeleteAlbumItems = DeleteAlbumItems;
class MoveAlbumItem extends CommandBase {
    constructor(cmd) {
        super("MoveAlbumItemCommand", cmd);
    }
}
exports.MoveAlbumItem = MoveAlbumItem;
class Publish extends CommandBase {
    constructor(cmd) {
        super("PublishCommand", cmd);
    }
}
exports.Publish = Publish;
class Unpublish extends CommandBase {
    constructor(cmd) {
        super("UnpublishCommand", cmd);
    }
}
exports.Unpublish = Unpublish;
class Archive extends CommandBase {
    constructor(cmd) {
        super("ArchiveCommand", cmd);
    }
}
exports.Archive = Archive;
class AddStoryPart extends CommandBase {
    constructor(cmd) {
        cmd.storyPart.partBodyJson = JSON.stringify(cmd.storyPart.partBody);
        delete cmd.storyPart.partBody;
        cmd.storyPart.partId = cmd.storyPart.partId || uuid.v4();
        super("AddStoryPartCommand", cmd);
    }
}
exports.AddStoryPart = AddStoryPart;
class SetStoryHeadline extends CommandBase {
    constructor(cmd) {
        super("SetStoryHeadlineCommand", cmd);
    }
}
exports.SetStoryHeadline = SetStoryHeadline;
class SetExtendedFields extends CommandBase {
    constructor(cmd) {
        super("SetExtendedFieldsCommand", cmd);
    }
}
exports.SetExtendedFields = SetExtendedFields;
class SetFeatured extends CommandBase {
    constructor(cmd) {
        super("SetFeaturedCommand", cmd);
    }
}
exports.SetFeatured = SetFeatured;
class SetFile extends CommandBase {
    constructor(cmd) {
        super("SetFileCommand", cmd);
    }
}
exports.SetFile = SetFile;
class SetStoryPartExtendedFields extends CommandBase {
    constructor(cmd) {
        super("SetStoryPartExtendedFieldsCommand", cmd);
    }
}
exports.SetStoryPartExtendedFields = SetStoryPartExtendedFields;
class AddEntityRelation extends CommandBase {
    constructor(cmd) {
        super("AddEntityRelationCommand", cmd);
    }
}
exports.AddEntityRelation = AddEntityRelation;
class MoveEntityRelation extends CommandBase {
    constructor(cmd) {
        super("MoveEntityRelationCommand", cmd);
    }
}
exports.MoveEntityRelation = MoveEntityRelation;
class SetPhotoCropArea extends CommandBase {
    constructor(cmd) {
        super("SetPhotoCropAreaCommand", cmd);
    }
}
exports.SetPhotoCropArea = SetPhotoCropArea;
class UnsetPhotoCropArea extends CommandBase {
    constructor(cmd) {
        super("UnsetPhotoCropAreaCommand", cmd);
    }
}
exports.UnsetPhotoCropArea = UnsetPhotoCropArea;
class SetPhotoGravity extends CommandBase {
    constructor(cmd) {
        super("SetPhotoGravityCommand", cmd);
    }
}
exports.SetPhotoGravity = SetPhotoGravity;
class UnsetPhotoGravity extends CommandBase {
    constructor(cmd) {
        super("UnsetPhotoGravityCommand", cmd);
    }
}
exports.UnsetPhotoGravity = UnsetPhotoGravity;
class ExtractPhotoMetadata extends CommandBase {
    constructor(cmd) {
        super("ExtractPhotoMetadataCommand", cmd);
    }
}
exports.ExtractPhotoMetadata = ExtractPhotoMetadata;
class AddTranslation extends CommandBase {
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
    constructor(cmd) {
        super("RemoveTranslationCommand", cmd);
    }
}
exports.RemoveTranslation = RemoveTranslation;
class SetTranslationVisibility extends CommandBase {
    constructor(cmd) {
        if (!cmd.visibility)
            throw new Error("Invalid visibility");
        super("SetTranslationVisibilityCommand", cmd);
    }
}
exports.SetTranslationVisibility = SetTranslationVisibility;
class ImportFeeds extends CommandBase {
    constructor(cmd) {
        super("ImportFeedsCommand", cmd);
    }
}
exports.ImportFeeds = ImportFeeds;
class UploadPhoto extends CommandBase {
    constructor(cmd) {
        super("UploadPhotoCommand", cmd);
    }
}
exports.UploadPhoto = UploadPhoto;
class UploadDocument extends CommandBase {
    constructor(cmd) {
        super("UploadDocumentCommand", cmd);
    }
}
exports.UploadDocument = UploadDocument;
class AddSitePage extends CommandBase {
    constructor(cmd) {
        super("AddSitePageCommand", cmd);
    }
}
exports.AddSitePage = AddSitePage;
class AddSiteMenu extends CommandBase {
    constructor(cmd) {
        super("AddSiteMenuCommand", cmd);
    }
}
exports.AddSiteMenu = AddSiteMenu;
class AddMenuItem extends CommandBase {
    constructor(cmd) {
        super("AddMenuItemCommand", cmd);
    }
}
exports.AddMenuItem = AddMenuItem;
class AddVariablesToMenu extends CommandBase {
    constructor(cmd) {
        super("AddVariablesToMenuCommand", cmd);
    }
}
exports.AddVariablesToMenu = AddVariablesToMenu;
class PublishMenu extends CommandBase {
    constructor(cmd) {
        super("PublishMenuCommand", cmd);
    }
}
exports.PublishMenu = PublishMenu;
class PublishPage extends CommandBase {
    constructor(cmd) {
        super("PublishPageCommand", cmd);
    }
}
exports.PublishPage = PublishPage;
class PublishDirectory extends CommandBase {
    constructor(cmd) {
        super("PublishDirectoryCommand", cmd);
    }
}
exports.PublishDirectory = PublishDirectory;
class ChangePageTemplate extends CommandBase {
    constructor(cmd) {
        super("ChangePageTemplateCommand", cmd);
    }
}
exports.ChangePageTemplate = ChangePageTemplate;
class RemoveSitePage extends CommandBase {
    constructor(cmd) {
        super("RemoveSitePageCommand", cmd);
    }
}
exports.RemoveSitePage = RemoveSitePage;
class RemoveSiteMenu extends CommandBase {
    constructor(cmd) {
        super("RemoveSiteMenuCommand", cmd);
    }
}
exports.RemoveSiteMenu = RemoveSiteMenu;
class RemoveSiteDirectory extends CommandBase {
    constructor(cmd) {
        super("RemoveSiteDirectoryCommand", cmd);
    }
}
exports.RemoveSiteDirectory = RemoveSiteDirectory;
class AddLayoutToSlot extends CommandBase {
    constructor(cmd) {
        super("AddLayoutToSlotCommand", cmd);
    }
}
exports.AddLayoutToSlot = AddLayoutToSlot;
class AddModuleToSlot extends CommandBase {
    constructor(cmd) {
        super("AddModuleToSlotCommand", cmd);
    }
}
exports.AddModuleToSlot = AddModuleToSlot;
class AddVariablesToPage extends CommandBase {
    constructor(cmd) {
        super("AddVariablesToPageCommand", cmd);
    }
}
exports.AddVariablesToPage = AddVariablesToPage;
class AddVariablesToDirectory extends CommandBase {
    constructor(cmd) {
        super("AddVariablesToDirectoryCommand", cmd);
    }
}
exports.AddVariablesToDirectory = AddVariablesToDirectory;
class DeletePageVariables extends CommandBase {
    constructor(cmd) {
        super("DeletePageVariablesCommand", cmd);
    }
}
exports.DeletePageVariables = DeletePageVariables;
class DeleteDirectoryVariables extends CommandBase {
    constructor(cmd) {
        super("DeleteDirectoryVariablesCommand", cmd);
    }
}
exports.DeleteDirectoryVariables = DeleteDirectoryVariables;
class DeleteMenuVariables extends CommandBase {
    constructor(cmd) {
        super("DeleteMenuVariablesCommand", cmd);
    }
}
exports.DeleteMenuVariables = DeleteMenuVariables;
class SetLayoutProperties extends CommandBase {
    constructor(cmd) {
        super("SetLayoutPropertiesCommand", cmd);
    }
}
exports.SetLayoutProperties = SetLayoutProperties;
class SetModuleProperties extends CommandBase {
    constructor(cmd) {
        super("SetModulePropertiesCommand", cmd);
    }
}
exports.SetModuleProperties = SetModuleProperties;
class RemoveLinkRuleFromPage extends CommandBase {
    constructor(cmd) {
        super("RemoveLinkRuleFromPageCommand", cmd);
    }
}
exports.RemoveLinkRuleFromPage = RemoveLinkRuleFromPage;
class CreateLinkRuleForPage extends CommandBase {
    constructor(cmd) {
        super("CreateLinkRuleForPageCommand", cmd);
    }
}
exports.CreateLinkRuleForPage = CreateLinkRuleForPage;
class GenerateDiff extends CommandBase {
    constructor(cmd) {
        super("GenerateDiffCommand", cmd);
    }
}
exports.GenerateDiff = GenerateDiff;
class Rollback extends CommandBase {
    constructor(cmd) {
        super("RollbackCommand", cmd);
    }
}
exports.Rollback = Rollback;
class CreateCheckpoint extends CommandBase {
    constructor(cmd) {
        super("CreateCheckpointCommand", cmd);
    }
}
exports.CreateCheckpoint = CreateCheckpoint;
class DeleteCheckpoint extends CommandBase {
    constructor(cmd) {
        super("DeleteCheckpointCommand", cmd);
    }
}
exports.DeleteCheckpoint = DeleteCheckpoint;
class RestoreCheckpoint extends CommandBase {
    constructor(cmd) {
        super("RestoreCheckpointCommand", cmd);
    }
}
exports.RestoreCheckpoint = RestoreCheckpoint;
class ImportNode extends CommandBase {
    constructor(cmd) {
        super("ImportNodeCommand", cmd);
    }
}
exports.ImportNode = ImportNode;
class ExportNode extends CommandBase {
    constructor(cmd) {
        super("ExportNodeCommand", cmd);
    }
}
exports.ExportNode = ExportNode;
