import { SessionController } from './controller/session_controller';
import { SessionDB, Session } from './model/session';
import { IDBPDatabase } from 'idb';
export declare class TimeOnPage {
    static _dbPromise: Promise<IDBPDatabase<SessionDB>>;
    static _db: IDBPDatabase<SessionDB>;
    constructor();
    static init(): Promise<void>;
    static cleanSubmitedSessions(): Promise<void>;
    static getEndSession(): Promise<Session[]>;
    static submitSession(sessions: Session[]): Promise<void>;
}
export { SessionController };
