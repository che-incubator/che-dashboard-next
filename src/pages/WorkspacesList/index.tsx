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

import 'reflect-metadata';
import React from 'react';
import {
  IAction,
  ICell,
  IRow,
  IRowData,
  Table,
  TableBody,
  TableHeader,
  TableVariant,
} from '@patternfly/react-table';
import { History } from 'history';
import {
  AlertVariant,
  Button,
  Divider,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { BrandingData } from '../../services/bootstrap/branding.constant';
import { formatDate, formatRelativeDate } from '../../services/helpers/date';
import { WorkspaceAction, WorkspaceStatus } from '../../services/helpers/types';
import Head from '../../components/Head';
import WorkspaceIndicator from '../../components/Workspace/Indicator';
import {
  buildDetailsPath,
  buildGettingStartedPath,
  buildIdeLoaderPath,
  toHref
} from '../../services/helpers/location';
import { AppAlerts } from '../../services/alerts/appAlerts';
import getRandomString from '../../services/helpers/random';
import WorkspacesListToolbar from './Toolbar';
import { lazyInject } from '../../inversify.config';

import * as styles from './index.module.css';
import NoWorkspacesEmptyState from './EmptyState/NoWorkspaces';
import NothingFoundEmptyState from './EmptyState/NothingFound';

interface RowData extends IRow {
  props: {
    workspaceId: string;
  };
}

type Props = {
  branding: BrandingData;
  history: History;
  workspaces: che.Workspace[];
  isDeleted: string[];
  onAction: (action: WorkspaceAction, id: string) => Promise<string | void>;
};
type State = {
  filtered: string[]; // IDs of filtered workspaces
  selected: string[]; // IDs of selected workspaces
  isSelectedAll: boolean;
}

export default class WorkspacesList extends React.PureComponent<Props, State> {

  @lazyInject(AppAlerts)
  private appAlerts: AppAlerts;

  private columns: (ICell | string)[];

  constructor(props: Props) {
    super(props);

    this.columns = [
      {
        title: (<span className={styles.nameColumnTitle}>Name</span>),
        dataLabel: 'Name',
      },
      'Last Accessed',
      'Project(s)',
      {
        title: '',
        dataLabel: ' ',
      }
    ];

    const filtered = this.props.workspaces.map(workspace => workspace.id);
    this.state = {
      filtered,
      selected: [],
      isSelectedAll: false,
    };
  }

  private showAlert(message: string, variant = AlertVariant.warning): void {
    this.appAlerts.showAlert({
      key: 'workspaces-list-' + getRandomString(4),
      title: message,
      variant,
    });
  }

  private buildRows(): IRow[] {
    const { isDeleted, workspaces } = this.props;
    const { filtered, selected } = this.state;

    const rows: IRow[] = [];
    workspaces.forEach(workspace => {
      // skip workspace that is not match a filter
      if (filtered.indexOf(workspace.id) === -1) {
        return;
      }

      const isSelected = selected.includes(workspace.id);
      const deleting = isDeleted.includes(workspace.id);
      try {
        rows.push(this.buildRow(workspace, isSelected, deleting));
      } catch (e) {
        console.warn('Skip workspace: ', e);
      }
    });
    return rows;
  }

  private buildRow(workspace: che.Workspace, isSelected: boolean, isDeleted: boolean): IRow {
    if (!workspace.devfile.metadata.name) {
      throw new Error('Empty workspace name.');
    }
    if (!workspace.attributes) {
      throw new Error('Empty workspace attributes');
    }
    if (!workspace.namespace) {
      throw new Error('Empty namespace');
    }

    /* workspace status indicator */
    const statusIndicator = (<WorkspaceIndicator status={workspace.status} />);
    /* workspace name */
    const detailsPath = buildDetailsPath(workspace);
    const detailsLink = toHref(this.props.history, detailsPath);
    const details = (
      <span>
        {statusIndicator}
        <a href={detailsLink}>{workspace.devfile.metadata.name}</a>
      </span>
    );

    /* last accessed time */
    const { created, updated } = workspace.attributes;
    const lastAccessedMs = parseInt(updated ? updated : created, 10);
    let lastAccessedDate = '';
    if (lastAccessedMs) {
      const nowMs = Date.now();
      // show relative date if last accessed withing an hour
      if (nowMs - lastAccessedMs < 60 * 60 * 1000) {
        lastAccessedDate = formatRelativeDate(lastAccessedMs);
      } else {
        lastAccessedDate = formatDate(lastAccessedMs);
      }
    }

    /* projects list */
    let projects = '';
    workspace.devfile.projects?.forEach(project => {
      const location = project.source.location;
      const name = project.name;
      projects += (projects ? ' ' : '') + (location ? location : name);
    });

    /* Open IDE link */
    let open: React.ReactElement;
    if (isDeleted) {
      open = (
        <TextContent>
          <Text component={TextVariants.small}>deleting...</Text>
        </TextContent>
      );
    } else {
      const openIdePath = buildIdeLoaderPath(workspace);
      const openIdeLink = toHref(this.props.history, openIdePath);
      open = <a href={openIdeLink}>Open</a>;
    }

    return {
      cells: [
        { title: details },
        lastAccessedDate,
        projects,
        { title: open },
      ],
      props: {
        workspaceId: workspace.id,
      },
      selected: isSelected || isDeleted,
      disableCheckbox: isDeleted,
      'aria-label': 'Test label'
    };
  }

  private actionResolver(rowData: IRowData): IAction[] {
    const id = (rowData as RowData).props.workspaceId;
    const workspace = this.props.workspaces.find(workspace => id === workspace.id);

    if (!workspace) {
      console.warn('Unable to build list of actions: Workspace not found.');
      return [];
    }

    return [
      {
        title: 'Open in Verbose Mode',
        isDisabled: false === this.isEnabledAction(WorkspaceAction.START_DEBUG_AND_OPEN_LOGS, WorkspaceStatus[workspace.status]),
        onClick: (event, rowId, rowData) => this.handleAction(WorkspaceAction.START_DEBUG_AND_OPEN_LOGS, rowData),

      },
      {
        title: 'Start in Background',
        isDisabled: false === this.isEnabledAction(WorkspaceAction.START_IN_BACKGROUND, WorkspaceStatus[workspace.status]),
        onClick: (event, rowId, rowData) => this.handleAction(WorkspaceAction.START_IN_BACKGROUND, rowData)
      },
      {
        title: 'Stop Workspace',
        isDisabled: false === this.isEnabledAction(WorkspaceAction.STOP_WORKSPACE, WorkspaceStatus[workspace.status]),
        onClick: (event, rowId, rowData) => this.handleAction(WorkspaceAction.STOP_WORKSPACE, rowData)
      },
      {
        title: 'Add Project',
        onClick: (event, rowId, rowData) => this.handleAction(WorkspaceAction.ADD_PROJECT, rowData)
      },
      {
        title: 'Delete Workspace',
        onClick: (event, rowId, rowData) => this.handleAction(WorkspaceAction.DELETE_WORKSPACE, rowData)
      },
    ];
  }

  private isEnabledAction(action: WorkspaceAction, status: WorkspaceStatus): boolean {
    if (action === WorkspaceAction.START_DEBUG_AND_OPEN_LOGS
      || action === WorkspaceAction.START_IN_BACKGROUND) {
      switch (status) {
        case WorkspaceStatus.STARTING:
        case WorkspaceStatus.RUNNING:
        case WorkspaceStatus.STOPPING:
          return false;
        default:
          return true;
      }
    }
    if (action === WorkspaceAction.STOP_WORKSPACE) {
      switch (status) {
        case WorkspaceStatus.STARTING:
        case WorkspaceStatus.RUNNING:
          return true;
        default:
          return false;
      }
    }

    return true;
  }

  private async handleAction(action: WorkspaceAction, rowData: IRowData): Promise<void> {
    const id = (rowData as RowData).props.workspaceId;
    try {
      const nextPath = await this.props.onAction(action, id);
      if (!nextPath) {
        return;
      }
      this.props.history.push(nextPath);
    } catch (e) {
      const message = `Unable to ${action}. ` + e.toString().replace('Error: ', '');
      this.showAlert(message);
      console.warn(message);
    }
  }

  private async handleDeleteSelected(): Promise<void> {
    const promises = this.state.selected.map(async id =>
      this.props.onAction(WorkspaceAction.DELETE_WORKSPACE, id)
        .then(() => id)
    );

    try {
      const results = await Promise.allSettled(promises);

      let fulfilled = 0;
      let rejected = 0;
      const { selected } = this.state;
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          fulfilled += 1;
          const idx = selected.indexOf(result.value);
          if (idx !== -1) {
            selected.splice(idx, 1);
          }
        } else {
          rejected += 1;
          console.warn(`Workspace deletion failed due to ${result.reason}`);
        }
      });
      this.setState({
        selected,
      });

      if (!rejected) {
        const message = `${promises.length} workspace(s) were deleted successfully.`;
        this.showAlert(message, AlertVariant.success);
        return;
      }

      const message = `${fulfilled} of ${promises.length} workspace(s) were deleted. `;
      this.showAlert(message);
    } catch (e) {
      const message = 'Bulk workspaces deletion failed due to ${e}.';
      console.error(message);
      this.showAlert(message, AlertVariant.danger);
    }
  }

  private handleWorkspacesFilter(filtered: che.Workspace[]): void {
    this.setState({
      filtered: filtered.map(workspace => workspace.id),
    });
  }

  private handleSelectAll(isSelectedAll: boolean): void {
    if (isSelectedAll) {
      const selected = this.props.workspaces.map(workspace => workspace.id);
      this.setState({
        selected,
        isSelectedAll,
      });
    } else {
      this.setState({
        selected: [],
        isSelectedAll,
      });
    }
  }

  private handleSelect(isSelected: boolean, rowIndex: number, rowData?: IRowData): void {
    /* (un)select all */
    if (rowIndex === -1) {
      this.handleSelectAll(isSelected);
      return;
    }

    /* (un)select specified row */
    const id = (rowData as RowData).props.workspaceId;
    const selected = [...this.state.selected];
    const idx = selected.indexOf(id);
    if (idx === -1) {
      if (isSelected) {
        selected.push(id);
      }
    } else {
      if (!isSelected) {
        selected.splice(idx, 1);
      }
    }
    const isSelectedAll = selected.length !== 0 && selected.length === this.props.workspaces.length;
    this.setState({
      selected,
      isSelectedAll,
    });
  }

  private areActionsDisabled(rowData: IRowData): boolean {
    const id = (rowData as RowData).props.workspaceId;
    return this.props.isDeleted.includes(id);
  }

  private handleAddWorkspace(): void {
    const path = buildGettingStartedPath('custom-workspace');
    this.props.history.push(path);
  }

  private handleLearnMore(): void {
    const { workspace: workspacesDocsLink } = this.props.branding.docs;
    this.props.history.push(workspacesDocsLink);
  }

  public componentDidUpdate(prevProps: Props): void {
    /* Update checkboxes states if workspaces list changes */
    if (prevProps.workspaces.length !== this.props.workspaces.length) {
      const selected: string[] = [];
      this.props.workspaces.forEach(workspace => {
        if (this.state.selected.indexOf(workspace.id) !== -1) {
          selected.push(workspace.id);
        }
      });
      const isSelectedAll = selected.length !== 0 && selected.length === this.props.workspaces.length;
      this.setState({
        isSelectedAll,
        selected,
      });
    }
    /* Update checkboxes states if workspaces are deleting */
    if (prevProps.isDeleted.length !== this.props.isDeleted.length) {
      const selected = this.state.selected.filter(id => false === this.props.isDeleted.includes(id));
      this.setState({
        selected,
      });
    }
  }

  public render(): React.ReactElement {
    const { workspaces } = this.props;
    const { selected, isSelectedAll } = this.state;

    const rows = this.buildRows();
    const toolbar = (<WorkspacesListToolbar
      workspaces={workspaces}
      selectedAll={isSelectedAll}
      enabledDelete={selected.length !== 0}
      onAddWorkspace={() => this.handleAddWorkspace()}
      onDeleteSelected={() => this.handleDeleteSelected()}
      onFilter={filtered => this.handleWorkspacesFilter(filtered)}
      onToggleSelectAll={isSelectedAll => this.handleSelectAll(isSelectedAll)}
    />);

    let emptyState: React.ReactElement = (<></>);
    if (workspaces.length === 0) {
      emptyState = <NoWorkspacesEmptyState onAddWorkspace={() => this.handleAddWorkspace()} />;
    } else if (rows.length === 0) {
      emptyState = <NothingFoundEmptyState />;
    }

    return (
      <React.Fragment>
        <Head pageName="Workspaces" />
        <PageSection variant={PageSectionVariants.light}>
          <TextContent>
            <Text component={'h1'}>Workspaces</Text>
            <Text component={'p'}>
              A workspace is where your projects live and run.
              Create workspaces from stacks that define projects, runtimes, and commands.
              <Button
                variant="link"
                icon={<ExternalLinkAltIcon />}
                iconPosition="right"
                aria-label="Learn more"
                onClick={() => this.handleLearnMore()}
              >
                Learn more
              </Button>
            </Text>
          </TextContent>
        </PageSection>
        <PageSection
          padding={{ default: 'noPadding' }}
          variant={PageSectionVariants.light}
          isFilled={false}
        >
          <Divider component="div" className="pf-u-mt-xl" />
          <Table
            actionResolver={rowData => this.actionResolver(rowData)}
            areActionsDisabled={rowData => this.areActionsDisabled(rowData)}
            aria-label="Workspaces List Table"
            canSelectAll={false}
            cells={this.columns}
            onSelect={(event, isSelected, rowIndex, rowData) => this.handleSelect(isSelected, rowIndex, rowData)}
            rows={rows}
            variant={TableVariant.compact}
            header={toolbar}
          >
            <TableHeader />
            <TableBody />
          </Table>
        </PageSection>
        {emptyState}
      </React.Fragment>
    );
  }

}
