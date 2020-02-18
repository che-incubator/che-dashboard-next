import * as React from 'react';
import {connect} from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { AppState } from '../store';
import * as WorkspacesStore from '../store/Workspaces';
import {Gallery, NavItem, PageSection, Text, TextContent} from "@patternfly/react-core";
import {Link} from "react-router-dom";

// At runtime, Redux will merge together...
type WorkspacesProps =
    WorkspacesStore.WorkspacesState // ... state we've requested from the Redux store
    & typeof WorkspacesStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ startDateIndex: string }>; // ... plus incoming routing parameters

export class WorkspacesLis extends React.PureComponent<WorkspacesProps> {
    // This method is called when the component is first added to the document
    public componentDidMount() {
        this.ensureDataFetched();
    }
    // This method is called when the route parameters change
    public componentDidUpdate() {
        this.ensureDataFetched();
    }

    public render() {
        return (
            <React.Fragment>
                {this.renderForecastsTable()}
            </React.Fragment>
        );
    }

    private ensureDataFetched() {
        this.props.requestWorkspaces(0);
    }

    private renderForecastsTable() {
        return (
            <React.Fragment>
                <PageSection>
                    <TextContent>
                        <Text component='h1'>Workspaces title</Text>
                    </TextContent>
                </PageSection>
                <PageSection>
                    <Gallery gutter='md'>
                        <table className='table table-striped' aria-labelledby="tabelLabel">
                            <thead>
                            <tr>
                                <th>Workspace names</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.props.workspaces.map((workspace: any) =>
                                <tr key={workspace.id}>
                                    <td>{workspace.devfile.metadata.name}</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </Gallery>
                </PageSection>
            </React.Fragment>
        );
    }
}


export default connect(
    (state: AppState) => state.workspaces, // Selects which state properties are merged into the component's props
    WorkspacesStore.actionCreators // Selects which action creators are merged into the component's props
)(WorkspacesLis as any);
