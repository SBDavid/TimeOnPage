import { Event, EventType } from './event';

// 计算耗时
export class Counter {
  lastEventType: EventType;
  events: Event[];
  lastBusyTime: number;
  // 总共消耗时间
  totalTime: number = 0;

  constructor(events: Event[]) {
    this.events = events;
  }

  // 检测数据时候合法
  _validateEvent() {
    if (this.events.length === 0) {
      throw new Error("无法计算耗时，events为空");
    } else if (this.events[this.events.length-1].type !== EventType.stop) {
      throw new Error("无法计算耗时，events的最后一项应该为stop类型");
    } else if (this.events.filter((e) => e.time === undefined).length > 0) {
      throw new Error("无法计算耗时，event的时间信息错误");
    }

  }

  count(): number {
    this._validateEvent();
    for(let i=0; i<this.events.length; i++) {
      if (!this.run(this.events[i])) {
        return this.totalTime;
      }
    }

    throw new Error("计算耗时发生异常，循环无法正常退出");
  }

  // 返回false表示结束
  run(event: Event): boolean {
    const lastEventType = this.lastEventType;
    const lastBusyTime = this.lastBusyTime;
    this.lastEventType = event.type;
    this.lastBusyTime = event.time;

    switch (event.type) {
      case EventType.start: {
        if (lastEventType !== undefined) {
          throw new Error("计算耗时发生异常，首个事件必须为start");
        }
        
        break;
      }

      case EventType.pause: {
        if (lastEventType === EventType.start || lastEventType === EventType.resume) {
          this.totalTime += event.time - lastBusyTime;
        } else {
          throw new Error("计算耗时发生异常，pause事件的前一个事件因该是start或者resume");
        }

        break;
      }

      case EventType.resume: {
        if (lastEventType !== EventType.pause) {
          throw new Error("计算耗时发生异常，resume事件的前一个事件因该是pause");
        }

        break;
      }

      case EventType.stop: {
        if (lastEventType === EventType.pause) {
          return false;
        } else if (lastEventType === EventType.resume || lastEventType === EventType.start) {
          this.totalTime += event.time - lastBusyTime;
          return false;
        } else {
          throw new Error("计算耗时发生异常，stop事件的前一个事件不可能为stop");
        }
      }
    }

    return true;
  }
    
}