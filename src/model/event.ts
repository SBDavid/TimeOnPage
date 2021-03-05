export enum EventType {
  start = 0,  // 建立session后，开始活动
  pause = 1,  // 进入不活跃状态，浏览器关闭
  resume = 2, // 接收到用户交互后重新进入活跃状态
  stop = 3    // session终结
}

// Time on Page 事件模型
export class Event {
  constructor(type: EventType, time?: number) {
    this.time = time ? time :Date.now();
    this.type = type;
  }

  // time
  time: number;
  type: EventType;
}