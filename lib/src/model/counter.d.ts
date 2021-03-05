import { Event, EventType } from './event';
export declare class Counter {
    lastEventType: EventType;
    events: Event[];
    lastBusyTime: number;
    totalTime: number;
    constructor(events: Event[]);
    _validateEvent(): void;
    count(): number;
    run(event: Event): boolean;
}
