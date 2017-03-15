"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MessagePriority;
(function (MessagePriority) {
    MessagePriority[MessagePriority["Background"] = 0] = "Background";
    MessagePriority[MessagePriority["Foreground"] = 1] = "Foreground";
})(MessagePriority = exports.MessagePriority || (exports.MessagePriority = {}));
class MessagePriorities {
    static toShortString(value) {
        switch (value) {
            case MessagePriority.Background:
                return "bg";
            case MessagePriority.Foreground:
                return "fg";
            default:
                throw new Error("Invalid value");
        }
    }
}
MessagePriorities.values = [MessagePriority.Background, MessagePriority.Foreground];
exports.MessagePriorities = MessagePriorities;
class ConnectionStatus {
}
exports.ConnectionStatus = ConnectionStatus;
