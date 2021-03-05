import { Session, SessionDB } from '../model/session';
import { EventListener } from '../event_listener';
import { IDBPDatabase } from 'idb';
export declare class SessionController {
    _eventListener: EventListener;
    _dbPromise: Promise<IDBPDatabase<SessionDB>>;
    _db: IDBPDatabase<SessionDB>;
    session: Session;
    id: string;
    constructor(id: string);
    start(): Promise<void>;
    onUserInput(event: any): void;
    onWindowClose(event: any): void;
    end(): void;
    count(): number;
    dispose(): void;
}
