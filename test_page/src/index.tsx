import { render } from 'react-dom';
import * as React from 'react';
import { SessionController, TimeOnPage } from 'time-on-page';

import "babel-polyfill";

interface Props {
}

interface State {
    sessionId: string
}

class Clock extends React.Component<Props, State> {

    controller: SessionController;
    sessionId: string;

    constructor(props: any) {
        super(props);
        this.state = {
            sessionId: "test-session-id"
        };
    }

    componentDidMount() {
        this.init();
    }

    async init() {
        await TimeOnPage.init();
    }

    render() {
        return (
            <div>
                <h1>页面活跃时间计算</h1>
                <h3>SessionID</h3>
                <p>
                    
                    <input type="text" value={this.state.sessionId} onChange={(event) => {
                        console.info(event.target.value);
                        
                        this.setState({
                            sessionId: event.target.value
                        });
                    }}></input>
                </p>
                <button onClick={async () => {
                    this.controller = new SessionController(this.state.sessionId);
                    this.controller.start();
                }}>start</button>
                <button onClick={() => {
                    this.controller.end();
                    console.info(this.controller.count());
                }}>end</button>
                <button onClick={async () => {
                    await TimeOnPage.init();
                    await TimeOnPage.cleanSubmitedSessions();
                }}>删除已提交的session</button>
                <button onClick={async () => {
                    const sessions = await TimeOnPage.getEndSession();
                    console.info(sessions);
                    await TimeOnPage.submitSession(sessions);
                }}>更改状态为已提交</button>
            </div>
        );
    }
}

render(<Clock />, document.getElementById("root"));