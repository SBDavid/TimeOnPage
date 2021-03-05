/// <reference types="node" />
import { EventEmitter } from 'events';
export declare class EventListener {
    state: String;
    _lastEventTime: number;
    _eventEmitter: EventEmitter;
    constructor();
    _init(): void;
    _uninit(): void;
    _onMousedown(): void;
    _onMousemove(): void;
    _onBeforeUnload(): void;
    _sendEvent(): void;
    start(): void;
    stop(): void;
    on(callback: (...args: any[]) => void): void;
    off(callback: (...args: any[]) => void): void;
}
