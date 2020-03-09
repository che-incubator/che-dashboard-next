import * as React from 'react';
import {connect} from 'react-redux';
import {AppState} from '../../../../store';
import {Tooltip} from '@patternfly/react-core';
import * as WorkspacesStore from '../../../../store/Workspaces';

import './delete-workspace.styl';

const STOPPED = 'STOPPED';

type DeleteWorkspaceProps =
    WorkspacesStore.WorkspacesState // ... state we've requested from the Redux store
    & WorkspacesStore.IActionCreators // ... plus action creators we've requested
    & { workspaceId: string; }; // ... plus incoming parameters

class DeleteWorkspace extends React.PureComponent<DeleteWorkspaceProps> {

    public render() {
        const workspace = this.props.workspaces.find(workspace => workspace.id === this.props.workspaceId);
        const isDisabled = () => !workspace || (workspace.status !== STOPPED);

        return (
            <React.Fragment>
                <span className={isDisabled() ? 'disabled-delete-workspace' : 'delete-workspace'}
                      onClick={e => {
                          e.stopPropagation();
                          this.onClick(workspace);
                      }}>
                    <Tooltip content="Delete Workspace"><span className="fa fa-trash"/></Tooltip>
                </span>
            </React.Fragment>
        );
    }

    private onClick(workspace: che.IWorkspace | undefined) {
        if (workspace && workspace.id) {
            // TODO It was the fastest way to organize Debouncing. Rework it.
            this.props.deleteWorkspace(workspace.id, new Date().getTime() / 5000);
        }
    }
}

export default connect(
    (state: AppState) => state.workspaces, // Selects which state properties are merged into the component's props
    WorkspacesStore.actionCreators // Selects which action creators are merged into the component's props
)(DeleteWorkspace);
