import { EventEmitter } from 'events';

// 监听window事件，和用户输入
// 代表用户活跃的事件包括，键盘输入、鼠标移动、div滚动
export class EventListener {
  // 是否正在运行，stop|running
  state: String = 'stop';
  // 上一次时间触发的时间
  _lastEventTime: number = 0;
  _eventEmitter: EventEmitter = new EventEmitter();

  constructor() {
    this._onMousedown = this._onMousedown.bind(this);
    this._onMousemove = this._onMousemove.bind(this);
    this._onBeforeUnload = this._onBeforeUnload.bind(this);
  }


  _init() {
    if (this.state === 'stop') {
      window.addEventListener('mousedown', this._onMousedown);
      window.addEventListener('mousemove', this._onMousemove);
      window.addEventListener('beforeunload', this._onBeforeUnload);
      this.state = 'running';
    }
  }

  _uninit() {
    if (this.state === 'running') {
      window.removeEventListener('mousedown', this._onMousedown);
      window.removeEventListener('mousemove', this._onMousemove);
      window.removeEventListener('beforeunload', this._onBeforeUnload);
      this.state = 'stop';
    }
  }

  _onMousedown() {
    this._sendEvent();
  }

  _onMousemove() {
    this._sendEvent();
  }

  _onBeforeUnload() {
    this._eventEmitter.emit("Unload", "Unload");
  }

  _sendEvent() {
    if (Date.now() - this._lastEventTime > 200) {
      this._eventEmitter.emit("UserInput", "UserInput");
      this._lastEventTime = Date.now();
    }
  }

  // 启动事件监听
  start() {
    this._init();
    this._sendEvent();
  }

  // 停止事件监听
  stop() {
    this._uninit();
  }

  on(callback: (...args: any[]) => void) {
    this._eventEmitter.on("UserInput", callback);
    this._eventEmitter.on("Unload", callback);
  }

  off(callback: (...args: any[]) => void) {
    this._eventEmitter.off("UserInput", callback);
    this._eventEmitter.off("Unload", callback);
  }
}