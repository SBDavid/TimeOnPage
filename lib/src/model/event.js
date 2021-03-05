export var EventType;
(function (EventType) {
    EventType[EventType["start"] = 0] = "start";
    EventType[EventType["pause"] = 1] = "pause";
    EventType[EventType["resume"] = 2] = "resume";
    EventType[EventType["stop"] = 3] = "stop"; // session终结
})(EventType || (EventType = {}));
// Time on Page 事件模型
var Event = /** @class */ (function () {
    function Event(type, time) {
        this.time = time ? time : Date.now();
        this.type = type;
    }
    return Event;
}());
export { Event };
//# sourceMappingURL=event.js.map