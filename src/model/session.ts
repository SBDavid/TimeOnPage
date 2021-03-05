import { Event, EventType } from './event';
import { Counter } from './counter';
import { DBSchema } from 'idb';

export enum SessionState {
  init = 0, // 创建后的默认状态
  busy = 1, // 用户处于活跃状态
  idle = 2, // 非活跃状态
  end = 3,  // session结束，等待上报
  submit = 4, // 数据已提交
}

// session数据库格式
export interface SessionDB extends DBSchema {
  'sessions': {
    key: string;
    value: SessionScheme;
  };
}

export interface SessionScheme {
  id: string,
  state: SessionState,
  events: Event[] 
}

// 独立的计时单位
export class Session {

  id: string;
  time: Number;
  state: SessionState;

  // 事件列表
  events: Event[];

  // 上次收到用户交互事件的时间
  lastUserInputTime: number;

  _idleTimer: NodeJS.Timeout;

  constructor(id: string) {
    this.id = id;
    this.lastUserInputTime = Date.now();
    this.onUserInput = this.onUserInput.bind(this);
    this.onResume = this.onResume.bind(this);
    this.onIdle = this.onIdle.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  // 仅在创建新的session时使用，恢复老数据使用restore
  init() {
    this.events = [];
    this.state = SessionState.busy;
    this.events.push(new Event(EventType.start));
  }

  // 从数据库中恢复或者创建
  restore(session: SessionScheme) {
    this.events = session.events.map((e) => new Event(e.type, e.time));
    this.state = session.state;
  }

  // 添加活动事件
  appendEvent(event: Event) {
    this.events.push(event);
  }

  onUserInput() {
    if (this.state === SessionState.busy) {
      this.lastUserInputTime = Date.now();
    } else if (this.state === SessionState.idle) {
      this.onResume();
    } else if (this.state === SessionState.end || this.state === SessionState.submit) {
      return;
    }

    if (this._idleTimer) {
      clearTimeout(this._idleTimer);
    }
    this._idleTimer = setTimeout(this.onIdle, 1000*60);
  }

  onResume() {
    this.lastUserInputTime = Date.now();
    this.state = SessionState.busy;
    this.appendEvent(new Event(EventType.resume));
  }

  onIdle() {
    this.state = SessionState.idle;
    this.appendEvent(new Event(EventType.pause));
  }

  // 即使结束
  onEnd() {
    if (this.state === SessionState.end || this.state === SessionState.submit) {
      throw new Error("Session已近结束，不可以再次结束");
    }
    clearTimeout(this._idleTimer);
    this.state = SessionState.end;
    this.appendEvent(new Event(EventType.stop));
  }

  // 用于存储数据库
  toObject() {
    return {
      id: this.id,
      state: this.state,
      events: this.events  
    }
  }

  // 最终耗时计算
  count(): number {
    return (new Counter(this.events)).count();
  }

  
}