import { EventEmitter } from 'events';
// 监听window事件，和用户输入
// 代表用户活跃的事件包括，键盘输入、鼠标移动、div滚动
var EventListener = /** @class */ (function () {
    function EventListener() {
        // 是否正在运行，stop|running
        this.state = 'stop';
        // 上一次时间触发的时间
        this._lastEventTime = 0;
        this._eventEmitter = new EventEmitter();
        this._onMousedown = this._onMousedown.bind(this);
        this._onMousemove = this._onMousemove.bind(this);
        this._onBeforeUnload = this._onBeforeUnload.bind(this);
    }
    EventListener.prototype._init = function () {
        if (this.state === 'stop') {
            window.addEventListener('mousedown', this._onMousedown);
            window.addEventListener('mousemove', this._onMousemove);
            window.addEventListener('beforeunload', this._onBeforeUnload);
            this.state = 'running';
        }
    };
    EventListener.prototype._uninit = function () {
        if (this.state === 'running') {
            window.removeEventListener('mousedown', this._onMousedown);
            window.removeEventListener('mousemove', this._onMousemove);
            window.removeEventListener('beforeunload', this._onBeforeUnload);
            this.state = 'stop';
        }
    };
    EventListener.prototype._onMousedown = function () {
        this._sendEvent();
    };
    EventListener.prototype._onMousemove = function () {
        this._sendEvent();
    };
    EventListener.prototype._onBeforeUnload = function () {
        this._eventEmitter.emit("Unload", "Unload");
    };
    EventListener.prototype._sendEvent = function () {
        if (Date.now() - this._lastEventTime > 200) {
            this._eventEmitter.emit("UserInput", "UserInput");
            this._lastEventTime = Date.now();
        }
    };
    // 启动事件监听
    EventListener.prototype.start = function () {
        this._init();
        this._sendEvent();
    };
    // 停止事件监听
    EventListener.prototype.stop = function () {
        this._uninit();
    };
    EventListener.prototype.on = function (callback) {
        this._eventEmitter.on("UserInput", callback);
        this._eventEmitter.on("Unload", callback);
    };
    EventListener.prototype.off = function (callback) {
        this._eventEmitter.off("UserInput", callback);
        this._eventEmitter.off("Unload", callback);
    };
    return EventListener;
}());
export { EventListener };
//# sourceMappingURL=event_listener.js.map