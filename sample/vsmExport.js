"use strict";
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
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        yield notificationBus.startReceiving();
        try {
            const exportId = api.uuid();
            yield api.post(new index_1.ForgeCommands.ExportNode({ path: "~/_libraries/", exportId: exportId }));
            const packageResponse = yield api.get(`deltatre.forge.vsm/api/exports/node/${exportId}`);
            console.log(packageResponse);
        }
        finally {
            yield notificationBus.stopReceiving();
        }
    });
}
run()
    .catch((error) => {
    console.log(error);
});
