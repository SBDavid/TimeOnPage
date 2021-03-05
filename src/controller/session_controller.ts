import { Session, SessionState, SessionDB } from '../model/session';
import { EventListener } from '../event_listener';
import { openDB, IDBPDatabase } from 'idb';
import { Event, EventType } from '../model/event';


// session控制器，触发session的创建，event事件的创建
export class SessionController {

  _eventListener: EventListener;
  _dbPromise: Promise<IDBPDatabase<SessionDB>>;
  _db: IDBPDatabase<SessionDB>;
  session: Session;
  id: string;

  // 需要传入Id，以便在页面刷新后找回session
  constructor(id: string) {
    this.id = id;
    this._eventListener = new EventListener();

    // this
    this.onWindowClose = this.onWindowClose.bind(this);
    this.onUserInput = this.onUserInput.bind(this);

    // 创建数据库
    this._dbPromise = openDB<SessionDB>("time_on_page", 1, {
      upgrade: (database: IDBPDatabase<SessionDB>) => {
        database.createObjectStore('sessions', {keyPath: 'id'});
      }
    });

    this._dbPromise.then((val) => {
      this._db = val;
    });
  }

  // 开始记录时间
  async start() {
    if (!this._db) {
      await this._dbPromise;
    }
    
    // 尝试从数据库找回session
    const ret = await this._db.get('sessions', this.id);
    if (ret) {  // 数据恢复
      const session = new Session(this.id);
      session.restore(ret);

      session.appendEvent(new Event(EventType.resume));
      session.state = SessionState.busy;
      this.session = session;
    } else {    // 数据新建
      const session = new Session(this.id);
      session.init();
      this.session = session;
    }

    // 注册事件
    this._eventListener.on(this.onWindowClose);
    this._eventListener.on(this.onUserInput);
    this._eventListener.start();
  }

  onUserInput(event: any) {
    if (event === 'UserInput') {
      this.session.onUserInput();
    }
  }

  // 用页面离开
  onWindowClose(event: any) {
    if (event === 'Unload') {
      // 如果session处于初始化后没有任何操作，说明可能出现异常，不需要任何操作
      if (this.session.state == SessionState.init) {

      }
      // 直接关闭浏览器，需要补足停止事件
      else if (this.session.state == SessionState.busy) {
        this.session.onIdle();
        this._db.put('sessions', this.session.toObject());
      }
      // 直接关闭浏览器，直接保存
      else if (this.session.state == SessionState.idle) {
        this._db.put('sessions', this.session.toObject());
      }
      else if (this.session.state == SessionState.end) {
        this._db.put('sessions', this.session.toObject());
      }
      else if (this.session.state == SessionState.submit) {

      }

    }
  }

  // 结束事件
  end() {
    this.session.onEnd();
    this.dispose();
    this._db.put('sessions', this.session.toObject());
  }

  count(): number {
    return this.session.count();
  }

  dispose() {
    // 取消事件
    this._eventListener.off(this.onWindowClose);
    this._eventListener.off(this.onUserInput);
  }
}