"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOCKET_EVENT = void 0;
var SOCKET_EVENT;
(function (SOCKET_EVENT) {
    SOCKET_EVENT["JOIN_ROOM"] = "join_room";
    SOCKET_EVENT["FROM_CLIENT"] = "from_client";
    SOCKET_EVENT["READ_MESSAGE"] = "read_message";
    SOCKET_EVENT["LEAVE_ROOM"] = "leave_room";
    SOCKET_EVENT["DISCONNECT"] = "disconnect";
})(SOCKET_EVENT || (exports.SOCKET_EVENT = SOCKET_EVENT = {}));
