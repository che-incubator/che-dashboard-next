import * as React from 'react';
import {Tooltip} from '@patternfly/react-core';

import './delete-workspace.styl';

// TODO should move this constant to the separate file
const STOPPED = 'STOPPED';

type DeleteWorkspaceProps = { workspaceId: string, status: string, deleteWorkspace: Function }; // incoming parameters

class DeleteWorkspace extends React.PureComponent<DeleteWorkspaceProps> {
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
        return this.isDebounceDelay || this.props.status !== STOPPED;
    };

    public render() {

        return (
            <span className={this.isDisabled() ?
                'disabled-delete-workspace' :
                'delete-workspace'}
                  onClick={e => {
                      e.stopPropagation();
                      this.onActionClick();
                  }}>
                    <Tooltip entryDelay={200} exitDelay={200} content='Delete Workspace'>
                        <i className='fa fa-trash'>&nbsp;</i>
                    </Tooltip>
                </span>
        );
    }

    private onActionClick() {
        if (this.isDisabled()) {
            return;
        }
        this.props.deleteWorkspace(this.props.workspaceId);
        this.setDebounceDelay();
    }
}

export default DeleteWorkspace;
