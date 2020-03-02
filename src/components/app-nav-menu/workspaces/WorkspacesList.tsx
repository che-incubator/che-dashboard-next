import * as React from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps} from 'react-router';
import {AppState} from '../../../store';
import * as WorkspacesStore from '../../../store/Workspaces';
import {PageSection, PageSectionVariants, Text, TextContent} from '@patternfly/react-core';
import {Table, TableBody, TableHeader,} from '@patternfly/react-table';

// At runtime, Redux will merge together...
type WorkspacesProps =
    WorkspacesStore.WorkspacesState // ... state we've requested from the Redux store
    & typeof WorkspacesStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ startDateIndex: string }>
    & { columns: string[], rows: any[] }; // ... plus incoming routing parameters

export class WorkspacesLis extends React.PureComponent<WorkspacesProps> {

    constructor(props: WorkspacesProps) {
        super(props);

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
        const columns = ['NAME', 'RAM', 'PROJECTS', 'STACK', 'ACTIONS'];
        const rows = this.props.workspaces.map((workspace: che.IWorkspace) => {
            return {
                cells: [
                    `${workspace.namespace}/${workspace.devfile.metadata.name}`,
                    `-`,
                    `${workspace.devfile.projects ? workspace.devfile.projects.length : '-'}`,
                    `${workspace.attributes && workspace.attributes.stackName ? workspace.attributes.stackName : ''}`,
                    `-`
                ]
            }
        });

        return (
            <React.Fragment>
                <PageSection variant={PageSectionVariants.light}>
                    <TextContent>
                        <Text component='h1'>Workspaces</Text>
                        <Text component='p'>
                            A workspace is where your projects live and run. Create workspaces from stacks that
                            define projects, runtimes, and commands.<br/>
                        </Text>
                    </TextContent>
                </PageSection>
                <PageSection>
                    <Table cells={columns} rows={rows} aria-label="Loading Table Demo">
                        <TableHeader/>
                        <TableBody/>
                    </Table>
                </PageSection>
            </React.Fragment>
        );
    }

    private ensureDataFetched() {
        // TODO It was the fastest way to organize Debouncing(rework it)
        this.props.requestWorkspaces(Math.round(new Date().getTime() / 5000));
    }
}


export default connect(
    (state: AppState) => state.workspaces, // Selects which state properties are merged into the component's props
    WorkspacesStore.actionCreators // Selects which action creators are merged into the component's props
)(WorkspacesLis as any);
