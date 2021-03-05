import { SessionController } from './controller/session_controller';
import { SessionDB, SessionState, Session } from './model/session';
import { openDB, IDBPDatabase } from 'idb';

// 对外接口
export class TimeOnPage {

  static _dbPromise: Promise<IDBPDatabase<SessionDB>>;
  static _db: IDBPDatabase<SessionDB>;

  constructor() {
    // 创建数据库
    TimeOnPage._dbPromise = openDB<SessionDB>("time_on_page", 1, {
      upgrade: (database: IDBPDatabase<SessionDB>) => {
        database.createObjectStore('sessions', {keyPath: 'id'});
      }
    });

    TimeOnPage._dbPromise.then((val) => {
      TimeOnPage._db = val;
    });
    
  }

  static async init() {
    TimeOnPage._db = await openDB<SessionDB>("time_on_page", 1, {
      upgrade: (database: IDBPDatabase<SessionDB>) => {
        database.createObjectStore('sessions', {keyPath: 'id'});
      }
    });
  }

  static async cleanSubmitedSessions() {
    if (!this._db) {
      await this._dbPromise;
    }

    const sessions = await this._db.getAll('sessions');
    await Promise.all(sessions.map((s) => {
      if (s.state === SessionState.submit) {
        return this._db.delete('sessions', s.id);
      } else {
        return;
      }
      
    }));
  } 

  static async getEndSession(): Promise<Session[]> {
    if (!this._db) {
      await this._dbPromise;
    }

    const sessions = await (await this._db.getAll('sessions')).filter((s) => s.state === SessionState.end);

    return sessions.map<Session>((s): Session => {
      const session = new Session(s.id);
      session.restore({
        id: s.id,
        state: s.state,
        events: s.events
      });

      return session;
    });
  }

  // 将end状态的session改为提交状态
  static async submitSession(sessions: Session[]) {
    if (!this._db) {
      await this._dbPromise;
    }

    sessions.forEach((s) => {
      if (s.state !== SessionState.end) {
        throw new Error("无法将Session的状态修改为submit，Session的当前状态应该为end，SessionId："+s.id);
      }
      s.state = SessionState.submit;
    });

    await Promise.all(sessions.map((s) => {
      this._db.put('sessions', s.toObject());
    }));
  }
}

export {
  SessionController
}