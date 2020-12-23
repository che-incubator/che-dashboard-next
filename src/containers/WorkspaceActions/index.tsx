/*
 * Copyright (c) 2018-2020 Red Hat, Inc.
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  buildDetailsPath,
  buildIdeLoaderPath,
  buildWorkspacesPath,
} from '../../services/helpers/location';
import {
  IdeLoaderTab,
  WorkspaceAction,
  WorkspaceDetailsTab,
} from '../../services/helpers/types';
import { AppState } from '../../store';
import { selectAllWorkspaces } from '../../store/Workspaces/selectors';
import * as WorkspacesStore from '../../store/Workspaces';
import { WorkspaceActionsContext } from './context';

type Props = MappedProps & {
  children: React.ReactElement;
};
type State = {
  isDeleted: string[];
};

export class WorkspaceActionsProvider extends React.Component<Props, State> {

  private deleting: Set<string> = new Set();

  constructor(props: Props) {
    super(props);

    this.state = {
      isDeleted: [],
    };
  }

  /**
   * Performs an action on the given workspace
   */
  private async handleAction(action: WorkspaceAction, id: string): Promise<string | void> {
    const workspace = this.props.allWorkspaces.find(workspace => id === workspace.id);

    if (!workspace) {
      console.warn(`Workspace not found, ID: ${id}.`);
      return;
    }

    if (this.deleting.has(id)) {
      console.warn(`Workspace "${workspace.devfile.metadata.name}" is being deleted.`);
      return;
    }

    switch (action) {
      case WorkspaceAction.OPEN_IDE:
        {
          return buildIdeLoaderPath(workspace);
        }
      case WorkspaceAction.START_DEBUG_AND_OPEN_LOGS:
        {
          await this.props.startWorkspace(workspace.id, {
            'debug-workspace-start': true
          });
          return buildIdeLoaderPath(workspace, IdeLoaderTab.Logs);
        }
      case WorkspaceAction.START_IN_BACKGROUND:
        {
          await this.props.startWorkspace(workspace.id);
        }
        break;
      case WorkspaceAction.STOP_WORKSPACE:
        {
          await this.props.stopWorkspace(workspace.id);
        }
        break;
      case WorkspaceAction.ADD_PROJECT:
        return buildDetailsPath(workspace, WorkspaceDetailsTab.Devfile);
      case WorkspaceAction.DELETE_WORKSPACE:
        {
          this.deleting.add(id);
          this.setState({
            isDeleted: Array.from(this.deleting),
          });

          try {
            await this.props.deleteWorkspace(workspace.id);
            this.deleting.delete(id);
            this.setState({
              isDeleted: Array.from(this.deleting),
            });
            return buildWorkspacesPath();
          } catch (e) {
            this.deleting.delete(id);
            this.setState({
              isDeleted: Array.from(this.deleting),
            });
            console.error(`Action failed: "${action}", ID: "${id}", e: ${e}.`);
          }
        }
        break;
      default:
        console.warn(`Unhandled action type: "${action}".`);
    }
  }

  public render(): React.ReactElement {
    const { isDeleted } = this.state;

    return (
      <WorkspaceActionsContext.Provider
        value={{
          handleAction: (action, id) => this.handleAction(action, id),
          isDeleted,
        }}
      >
        {this.props.children}
      </WorkspaceActionsContext.Provider>
    );
  }

}

const mapStateToProps = (state: AppState) => ({
  allWorkspaces: selectAllWorkspaces(state),
});

const connector = connect(
  mapStateToProps,
  WorkspacesStore.actionCreators,
);

type MappedProps = ConnectedProps<typeof connector>;
export default connector(WorkspaceActionsProvider);
