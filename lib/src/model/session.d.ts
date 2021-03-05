/// <reference types="node" />
import { Event } from './event';
import { DBSchema } from 'idb';
export declare enum SessionState {
    init = 0,
    busy = 1,
    idle = 2,
    end = 3,
    submit = 4
}
export interface SessionDB extends DBSchema {
    'sessions': {
        key: string;
        value: SessionScheme;
    };
}
export interface SessionScheme {
    id: string;
    state: SessionState;
    events: Event[];
}
export declare class Session {
    id: string;
    time: Number;
    state: SessionState;
    events: Event[];
    lastUserInputTime: number;
    _idleTimer: NodeJS.Timeout;
    constructor(id: string);
    init(): void;
    restore(session: SessionScheme): void;
    appendEvent(event: Event): void;
    onUserInput(): void;
    onResume(): void;
    onIdle(): void;
    onEnd(): void;
    toObject(): {
        id: string;
        state: SessionState;
        events: Event[];
    };
    count(): number;
}
