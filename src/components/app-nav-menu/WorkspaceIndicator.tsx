import * as React from 'react';


export const WorkspaceIndicator = (props: { status: string | undefined }) => {
    // RUNNING, STOPPED, PAUSED, STARTING, STOPPING, ERROR
    if (props.status === 'STARTING' || props.status === 'STOPPING') {
        return (
            <span className="workspace-status-indicator">
              <span className="workspace-status-spinner ng-scope">
                <div className="spinner">
                  <div className="rect1"></div>
                  <div className="rect2"></div>
                  <div className="rect3"></div>
                 </div>
              </span>
            </span>
        );
    }
    return (
        <React.Fragment>
            <span className="workspace-status-indicator">
              <i className={props.status === 'RUNNING' ? 'fa fa-circle' : 'fa fa-circle-o'}>
                &nbsp;&nbsp;
              </i>
            </span>
        </React.Fragment>
    );
};
