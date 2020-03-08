import * as React from 'react';
import {connect} from 'react-redux';
import {container} from '../../../inversify.config';
import {RouteComponentProps} from 'react-router';
import {AppState} from '../../../store';
import * as WorkspacesStore from '../../../store/Workspaces';
import {PageSection, PageSectionVariants, Text, Tooltip} from '@patternfly/react-core';
import {Table, TableBody, TableHeader} from '@patternfly/react-table';
import {Button} from '@patternfly/react-core';
import {WorkspaceIndicator} from '../WorkspaceIndicator';
import {CheBranding} from '../../../services/bootstrap/CheBranding';
import {IBrandingDocs} from '../../../services/bootstrap/branding.constant';

import './workspaces-list.styl';


// At runtime, Redux will merge together...
type WorkspacesProps =
    WorkspacesStore.WorkspacesState // ... state we've requested from the Redux store
    & typeof WorkspacesStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ startDateIndex: string }>
    & { columns: string[], rows: any[] }; // ... plus incoming routing parameters

export class WorkspacesList extends React.PureComponent<WorkspacesProps> {
    private docs: IBrandingDocs;

    constructor(props: WorkspacesProps) {
        super(props);

        this.docs = container.get(CheBranding).getDocs();
    }

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
            timerId = setTimeout(() => {
                window.location.href = `#/workspace/${namespace}/${name}`;
            }, 500);
        };
        const onActionClick = (workspace: che.IWorkspace) => {
            if (timerId) {
                clearTimeout(timerId);
            }
            console.log('>>>>>>>>>>>>>>>>> OnActionClick', workspace);
        };

        const columns = ['NAME', 'RAM', 'PROJECTS', 'STACK', 'ACTIONS'];
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
                    (<span className='workspace-status' onClick={() => {
                        onActionClick(workspace);
                    }}>
                        <Tooltip content={workspace.status === 'STOPPED' ?
                            (<div>Run Workspace</div>) : (<div>Stop workspace</div>)}>
                        <span className={workspace.status === 'STOPPED' ? 'fa fa-play' : 'fa fa-stop'}></span>
                        </Tooltip>
                    </span>)
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
)(WorkspacesList as any);
