import * as React from 'react';
import {connect} from 'react-redux';
import {AppState} from '../../../../store';
import {Tooltip} from '@patternfly/react-core';
import * as WorkspacesStore from '../../../../store/Workspaces';

import './workspace-status.styl';

const STOPPED = 'STOPPED';
const RUNNING = 'RUNNING';

type WorkspaceStatusProps =
    WorkspacesStore.WorkspacesState // ... state we've requested from the Redux store
    & WorkspacesStore.IActionCreators // ... plus action creators we've requested
    & { workspaceId: string; onClick?: Function }; // ... plus incoming parameters

class WorkspaceStatus extends React.Component<WorkspaceStatusProps> {

    public render() {
        const workspace = this.props.workspaces.find(workspace => workspace.id === this.props.workspaceId);
        const isDisabled = () => !workspace || (workspace.status !== STOPPED && workspace.status !== RUNNING);
        const tooltipContent = () => workspace && workspace.status === STOPPED ? 'Run Workspace' : 'Stop workspace';
        const iconClass = () => workspace && workspace.status === STOPPED ? 'fa fa-play' : 'fa fa-stop';

        return (
            <React.Fragment>
                <span className={isDisabled() ? 'disabled-workspace-status' : 'workspace-status'}
                      onClick={e => {
                          e.stopPropagation();
                          this.onClick(workspace);
                      }}>
                    <Tooltip content={tooltipContent()}><span className={iconClass()}/></Tooltip>
                </span>
            </React.Fragment>
        );
    }

    private onClick(workspace: che.IWorkspace | undefined) {
        // TODO It was the fastest way to organize Debouncing. Rework it.
        const startDateIndex = new Date().getTime() / 5000;

        if (workspace && workspace.id) {
            if (workspace.status === STOPPED) {
                this.props.startWorkspace(workspace.id, startDateIndex);
            } else if (workspace.status === RUNNING) {
                this.props.stopWorkspace(workspace.id, startDateIndex);
            }
        }
        if (this.props.onClick) {
            this.props.onClick();
        }
    }

}

export default connect(
    (state: AppState) => state.workspaces, // Selects which state properties are merged into the component's props
    WorkspacesStore.actionCreators // Selects which action creators are merged into the component's props
)(WorkspaceStatus);
