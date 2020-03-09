import * as React from 'react';
import {connect} from 'react-redux';
import {container} from '../../../inversify.config';
import {AppState} from '../../../store';
import * as WorkspacesStore from '../../../store/Workspaces';
import {Button, PageSection, PageSectionVariants, Text} from '@patternfly/react-core';
import {Table, TableBody, TableHeader} from '@patternfly/react-table';
import {WorkspaceIndicator} from '../WorkspaceIndicator';
import WorkspaceStatus from './actions/WorkspaceStatus';
import DeleteWorkspace from './actions/DeleteWorkspace';
import {CheBranding} from '../../../services/bootstrap/CheBranding';
import {IBrandingDocs} from '../../../services/bootstrap/branding.constant';

import './workspaces-list.styl';


// At runtime, Redux will merge together...
type WorkspacesProps =
    WorkspacesStore.WorkspacesState // ... state we've requested from the Redux store
    & WorkspacesStore.IActionCreators; // ... plus action creators we've requested

export class WorkspacesList extends React.PureComponent<WorkspacesProps> {
    // TODO rework it for using a storage.
    private docs: IBrandingDocs = container.get(CheBranding).getDocs();

    // This method is called when the component is first added to the document
    public componentDidMount() {
        this.ensureDataFetched();
    }

    // This method is called when the route parameters change
    public componentDidUpdate() {
        this.ensureDataFetched();
    }

    public render() {
        const onRowClick = (workspace: che.IWorkspace) => {
            // TODO rework this native js solution.
            window.location.href = `#/workspace/${workspace.namespace}/${workspace.devfile.metadata.name}`;
        };

        const columns = ['NAME', 'RAM', 'PROJECTS', 'STACK', 'ACTIONS'];
        const rows = this.props.workspaces.map((workspace: che.IWorkspace) => {
            return {
                cells: [
                    (<span onClick={() => onRowClick(workspace)}>
                        <WorkspaceIndicator key={`indicator_${workspace.id}`} status={workspace.status}/>
                        {workspace.namespace}/{workspace.devfile.metadata.name}
                    </span>),
                    <span onClick={() => onRowClick(workspace)}>
                        -
                    </span>,
                    <span onClick={() => onRowClick(workspace)}>
                        {workspace.devfile.projects ? workspace.devfile.projects.length : '-'}
                    </span>,
                    <span onClick={() => onRowClick(workspace)}>
                        {workspace.attributes && workspace.attributes.stackName ? workspace.attributes.stackName : ''}
                    </span>,
                    (<span>
                        <WorkspaceStatus key={`status_${workspace.id}`} workspaceId={`${workspace.id}`}/>
                        <DeleteWorkspace key={`delete_${workspace.id}`} workspaceId={`${workspace.id}`}/>
                    </span>)
                ]
            }
        }) || [];

        return (
            <React.Fragment>
                <PageSection variant={PageSectionVariants.light}>
                    <Text className='page-label' component='h1'>Workspaces</Text>
                </PageSection>
                <Text className='page-description' component='p'>
                    A workspace is where your projects live and run.
                    Create workspaces from stacks that define projects, runtimes, and commands.
                    <a href={this.docs.workspace}>Learn more.</a>
                </Text>
                <PageSection variant={PageSectionVariants.light} className='header-buttons'>
                    <Button component='a' href='#/create-workspace' variant='primary'>
                        Add Workspace
                    </Button>
                </PageSection>
                <PageSection variant={PageSectionVariants.light}>
                    {rows.length === 0 ? (<Text component='p' className='workspaces-list-empty-state'>
                            There are no workspaces.
                        </Text>) :
                        (<Table cells={columns}
                                rows={rows}
                                aria-label='Workspaces'>
                            <TableHeader className='workspaces-list-table-header'/>
                            <TableBody className='workspaces-list-table-body'/>
                        </Table>)}
                </PageSection>
            </React.Fragment>
        );
    }

    private ensureDataFetched() {
        // TODO It was the fastest way to organize Debouncing. Rework it.
        this.props.requestWorkspaces(Math.round(new Date().getTime() / 5000));
    }
}

export default connect(
    (state: AppState) => state.workspaces, // Selects which state properties are merged into the component's props
    WorkspacesStore.actionCreators // Selects which action creators are merged into the component's props
)(WorkspacesList);
