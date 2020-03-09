import * as React from 'react';
import {connect} from 'react-redux';
import {container} from '../../../inversify.config';
import {AppState} from '../../../store';
import * as WorkspacesStore from '../../../store/Workspaces';
import {Button, PageSection, PageSectionVariants, Text} from '@patternfly/react-core';
import {Table, TableBody, TableHeader} from '@patternfly/react-table';
import {WorkspaceIndicator} from '../WorkspaceIndicator';
import WorkspaceStatus from './actions/WorkspaceStatus';
import {CheBranding} from '../../../services/bootstrap/CheBranding';
import {IBrandingDocs} from '../../../services/bootstrap/branding.constant';

import './workspaces-list.styl';


// At runtime, Redux will merge together...
type WorkspacesProps =
    WorkspacesStore.WorkspacesState // ... state we've requested from the Redux store
    & WorkspacesStore.IActionCreators; // ... plus action creators we've requested

export class WorkspacesList extends React.PureComponent<WorkspacesProps> {
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
        let timerId: number;
        const onRowClick = (e: any, item: any) => {
            const namespace = this.props.workspaces[item.id].namespace;
            const name = this.props.workspaces[item.id].devfile.metadata.name;
            // TODO rework this native js solution
            // window events queue? ...  how to prevent DOM transforming by the widget ...
            timerId = setTimeout(() => {
                window.location.href = `#/workspace/${namespace}/${name}`;
            }, 500);
        };
        const onActionClick = () => {
            if (timerId) {
                clearTimeout(timerId);
            }
        };

        const columns = ['NAME', 'RAM', 'PROJECTS', 'STACK', 'ACTIONS'];
        // TODO move all widgets from the 'actions' in a separate file
        const rows = this.props.workspaces.map((workspace: che.IWorkspace) => {
            return {
                cells: [
                    (<React.Fragment>
                        <WorkspaceIndicator key={workspace.id} status={workspace.status}/>
                        {workspace.namespace}/{workspace.devfile.metadata.name}
                    </React.Fragment>),
                    `-`,
                    `${workspace.devfile.projects ? workspace.devfile.projects.length : '-'}`,
                    `${workspace.attributes && workspace.attributes.stackName ? workspace.attributes.stackName : ''}`,
                    (<React.Fragment>
                        <WorkspaceStatus workspaceId={workspace.id as string} onClick={onActionClick}/>
                    </React.Fragment>)
                ]
            }
        });

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
                    <Table cells={columns}
                           rows={rows}
                           aria-label='Workspaces'>
                        <TableHeader className='workspaces-list-table-header'/>
                        <TableBody className='workspaces-list-table-body' onRowClick={onRowClick}/>
                    </Table>
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
