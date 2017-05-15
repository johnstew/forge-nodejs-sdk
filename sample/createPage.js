"use strict";
/* tslint:disable:no-console */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./../index"); // forge-nodejs-sdk
const config = require("./../config.js");
const api = new index_1.ForgeManagementApi(config.managementApi);
const notificationBus = new index_1.ForgeNotificationBus(config.serviceBus);
api.autoWaitCommandNotification(notificationBus);
function addSitePage(pagePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const cmd = new index_1.ForgeCommands.AddSitePage({
            path: pagePath
        });
        const waitAdded = notificationBus.waitCommand(cmd.id(), "SitePageAddedNotification");
        yield api.post(cmd);
        const msg = yield waitAdded;
        return msg.itemId;
    });
}
function changeTemplate(pageId, template) {
    const cmd = new index_1.ForgeCommands.ChangePageTemplate({ pageId, template });
    return api.post(cmd);
}
notificationBus.startReceiving()
    .then(() => __awaiter(this, void 0, void 0, function* () {
    const pageId = yield addSitePage("~/test/sdksample/page_" + (new Date().getTime()));
    console.log("New page id: " + pageId);
    yield changeTemplate(pageId, { id: "homePage", namespace: "urn:mynamespace" });
    console.log("Template changed");
}))
    .then(() => notificationBus.stopReceiving())
    .catch((error) => {
    console.log(error);
    notificationBus.stopReceiving();
});
