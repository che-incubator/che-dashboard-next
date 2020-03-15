import * as React from 'react';
import {Tooltip} from '@patternfly/react-core';

import './workspace-status.styl';

// TODO should move these constants to the separate file
const STOPPED = 'STOPPED';
const RUNNING = 'RUNNING';

type WorkspaceStatusProps = { workspaceId: string, status: string, startWorkspace: Function, stopWorkspace: Function }; // incoming parameters

class WorkspaceStatus extends React.PureComponent<WorkspaceStatusProps> {
    // TODO move it to the separate service
    private timerVar: number | undefined;
    private isDebounceDelay = false;
    private setDebounceDelay = (time: number = 5000) => {
        this.isDebounceDelay = true;
        if (this.timerVar) {
            clearTimeout(this.timerVar);
        }
        this.timerVar = setTimeout(() => this.isDebounceDelay = false, time);
    };

    private isDisabled = () => {
        return this.isDebounceDelay || this.props.status !== STOPPED && this.props.status !== RUNNING;
    };

    public render() {
        const tooltipContent = () => this.props.status === STOPPED ? 'Run Workspace' : 'Stop workspace';
        const iconClass = () => this.props.status === STOPPED ? 'fa fa-play' : 'fa fa-stop';

        return (
            <span key={`wrks-status-${this.props.workspaceId}`}
                  className={this.isDisabled() ? 'disabled-workspace-status' : 'workspace-status'}
                  onClick={e => {
                      e.stopPropagation();
                      this.onActionClick();
                  }}>
                    <Tooltip entryDelay={200} exitDelay={200}
                             content={tooltipContent()}>
                        <i className={iconClass()}>&nbsp;</i>
                    </Tooltip>
                </span>
        );
    }

    private onActionClick() {
        if (this.isDisabled()) {
            return;
        }
        if (this.props.status === STOPPED) {
            this.props.startWorkspace(this.props.workspaceId);
        } else if (this.props.status === RUNNING) {
            this.props.stopWorkspace(this.props.workspaceId);
        }
        this.setDebounceDelay();
    }

}

export default WorkspaceStatus;
