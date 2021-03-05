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
import { SessionController } from './controller/session_controller';
import { SessionState, Session } from './model/session';
import { openDB } from 'idb';
// 对外接口
var TimeOnPage = /** @class */ (function () {
    function TimeOnPage() {
        // 创建数据库
        TimeOnPage._dbPromise = openDB("time_on_page", 1, {
            upgrade: function (database) {
                database.createObjectStore('sessions', { keyPath: 'id' });
            }
        });
        TimeOnPage._dbPromise.then(function (val) {
            TimeOnPage._db = val;
        });
    }
    TimeOnPage.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = TimeOnPage;
                        return [4 /*yield*/, openDB("time_on_page", 1, {
                                upgrade: function (database) {
                                    database.createObjectStore('sessions', { keyPath: 'id' });
                                }
                            })];
                    case 1:
                        _a._db = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TimeOnPage.cleanSubmitedSessions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sessions;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this._db) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._dbPromise];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this._db.getAll('sessions')];
                    case 3:
                        sessions = _a.sent();
                        return [4 /*yield*/, Promise.all(sessions.map(function (s) {
                                if (s.state === SessionState.submit) {
                                    return _this._db.delete('sessions', s.id);
                                }
                                else {
                                    return;
                                }
                            }))];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TimeOnPage.getEndSession = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sessions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this._db) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._dbPromise];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this._db.getAll('sessions')];
                    case 3: return [4 /*yield*/, (_a.sent()).filter(function (s) { return s.state === SessionState.end; })];
                    case 4:
                        sessions = _a.sent();
                        return [2 /*return*/, sessions.map(function (s) {
                                var session = new Session(s.id);
                                session.restore({
                                    id: s.id,
                                    state: s.state,
                                    events: s.events
                                });
                                return session;
                            })];
                }
            });
        });
    };
    // 将end状态的session改为提交状态
    TimeOnPage.submitSession = function (sessions) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this._db) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._dbPromise];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        sessions.forEach(function (s) {
                            if (s.state !== SessionState.end) {
                                throw new Error("无法将Session的状态修改为submit，Session的当前状态应该为end，SessionId：" + s.id);
                            }
                            s.state = SessionState.submit;
                        });
                        return [4 /*yield*/, Promise.all(sessions.map(function (s) {
                                _this._db.put('sessions', s.toObject());
                            }))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return TimeOnPage;
}());
export { TimeOnPage };
export { SessionController };
//# sourceMappingURL=time_on_page.js.map