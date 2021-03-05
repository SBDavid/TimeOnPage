var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Session, SessionState } from '../model/session';
import { EventListener } from '../event_listener';
import { openDB } from 'idb';
import { Event, EventType } from '../model/event';
// session控制器，触发session的创建，event事件的创建
var SessionController = /** @class */ (function () {
    // 需要传入Id，以便在页面刷新后找回session
    function SessionController(id) {
        var _this = this;
        this.id = id;
        this._eventListener = new EventListener();
        // this
        this.onWindowClose = this.onWindowClose.bind(this);
        this.onUserInput = this.onUserInput.bind(this);
        // 创建数据库
        this._dbPromise = openDB("time_on_page", 1, {
            upgrade: function (database) {
                database.createObjectStore('sessions', { keyPath: 'id' });
            }
        });
        this._dbPromise.then(function (val) {
            _this._db = val;
        });
    }
    // 开始记录时间
    SessionController.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ret, session, session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this._db) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._dbPromise];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this._db.get('sessions', this.id)];
                    case 3:
                        ret = _a.sent();
                        if (ret) { // 数据恢复
                            session = new Session(this.id);
                            session.restore(ret);
                            session.appendEvent(new Event(EventType.resume));
                            session.state = SessionState.busy;
                            this.session = session;
                        }
                        else { // 数据新建
                            session = new Session(this.id);
                            session.init();
                            this.session = session;
                        }
                        // 注册事件
                        this._eventListener.on(this.onWindowClose);
                        this._eventListener.on(this.onUserInput);
                        this._eventListener.start();
                        return [2 /*return*/];
                }
            });
        });
    };
    SessionController.prototype.onUserInput = function (event) {
        if (event === 'UserInput') {
            this.session.onUserInput();
        }
    };
    // 用页面离开
    SessionController.prototype.onWindowClose = function (event) {
        if (event === 'Unload') {
            // 如果session处于初始化后没有任何操作，说明可能出现异常，不需要任何操作
            if (this.session.state == SessionState.init) {
            }
            // 直接关闭浏览器，需要补足停止事件
            else if (this.session.state == SessionState.busy) {
                this.session.onIdle();
                this._db.put('sessions', this.session.toObject());
            }
            // 直接关闭浏览器，直接保存
            else if (this.session.state == SessionState.idle) {
                this._db.put('sessions', this.session.toObject());
            }
            else if (this.session.state == SessionState.end) {
                this._db.put('sessions', this.session.toObject());
            }
            else if (this.session.state == SessionState.submit) {
            }
        }
    };
    // 结束事件
    SessionController.prototype.end = function () {
        this.session.onEnd();
        this.dispose();
        this._db.put('sessions', this.session.toObject());
    };
    SessionController.prototype.count = function () {
        return this.session.count();
    };
    SessionController.prototype.dispose = function () {
        // 取消事件
        this._eventListener.off(this.onWindowClose);
        this._eventListener.off(this.onUserInput);
    };
    return SessionController;
}());
export { SessionController };
//# sourceMappingURL=session_controller.js.map