"use strict";
var MessagePriority;
(function (MessagePriority) {
    MessagePriority[MessagePriority["Background"] = 0] = "Background";
    MessagePriority[MessagePriority["Foreground"] = 1] = "Foreground";
})(MessagePriority = exports.MessagePriority || (exports.MessagePriority = {}));
exports.MessagePriorities = [MessagePriority.Background, MessagePriority.Foreground];
