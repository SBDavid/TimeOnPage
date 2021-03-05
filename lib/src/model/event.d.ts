export declare enum EventType {
    start = 0,
    pause = 1,
    resume = 2,
    stop = 3
}
export declare class Event {
    constructor(type: EventType, time?: number);
    time: number;
    type: EventType;
}
