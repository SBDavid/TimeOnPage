import { Event, EventType } from './event';
import { Counter } from './counter';
export var SessionState;
(function (SessionState) {
    SessionState[SessionState["init"] = 0] = "init";
    SessionState[SessionState["busy"] = 1] = "busy";
    SessionState[SessionState["idle"] = 2] = "idle";
    SessionState[SessionState["end"] = 3] = "end";
    SessionState[SessionState["submit"] = 4] = "submit";
})(SessionState || (SessionState = {}));
// 独立的计时单位
var Session = /** @class */ (function () {
    function Session(id) {
        this.id = id;
        this.lastUserInputTime = Date.now();
        this.onUserInput = this.onUserInput.bind(this);
        this.onResume = this.onResume.bind(this);
        this.onIdle = this.onIdle.bind(this);
        this.onEnd = this.onEnd.bind(this);
    }
    // 仅在创建新的session时使用，恢复老数据使用restore
    Session.prototype.init = function () {
        this.events = [];
        this.state = SessionState.busy;
        this.events.push(new Event(EventType.start));
    };
    // 从数据库中恢复或者创建
    Session.prototype.restore = function (session) {
        this.events = session.events.map(function (e) { return new Event(e.type, e.time); });
        this.state = session.state;
    };
    // 添加活动事件
    Session.prototype.appendEvent = function (event) {
        this.events.push(event);
    };
    Session.prototype.onUserInput = function () {
        if (this.state === SessionState.busy) {
            this.lastUserInputTime = Date.now();
        }
        else if (this.state === SessionState.idle) {
            this.onResume();
        }
        else if (this.state === SessionState.end || this.state === SessionState.submit) {
            return;
        }
        if (this._idleTimer) {
            clearTimeout(this._idleTimer);
        }
        this._idleTimer = setTimeout(this.onIdle, 1000 * 60);
    };
    Session.prototype.onResume = function () {
        this.lastUserInputTime = Date.now();
        this.state = SessionState.busy;
        this.appendEvent(new Event(EventType.resume));
    };
    Session.prototype.onIdle = function () {
        this.state = SessionState.idle;
        this.appendEvent(new Event(EventType.pause));
    };
    // 即使结束
    Session.prototype.onEnd = function () {
        if (this.state === SessionState.end || this.state === SessionState.submit) {
            throw new Error("Session已近结束，不可以再次结束");
        }
        clearTimeout(this._idleTimer);
        this.state = SessionState.end;
        this.appendEvent(new Event(EventType.stop));
    };
    // 用于存储数据库
    Session.prototype.toObject = function () {
        return {
            id: this.id,
            state: this.state,
            events: this.events
        };
    };
    // 最终耗时计算
    Session.prototype.count = function () {
        return (new Counter(this.events)).count();
    };
    return Session;
}());
export { Session };
//# sourceMappingURL=session.js.map